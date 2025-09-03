<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Santri;
use App\Models\StudentPayment;
use App\Models\LedgerEntry;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(){
        // KPI: jumlah santri
        $totalSantri = Santri::count();

        // KPI: total kas (akun Kas kode 1000)
        $kas = Account::where('code', '1000')->first();
        $totalKas = 0;
        if ($kas) {
            $totalKas = (float) LedgerEntry::where('account_id', $kas->id)
                ->select(DB::raw('COALESCE(SUM(debit - credit),0) as saldo'))
                ->value('saldo');
        }

        // KPI: total santri menunggak (sejak awal tahun)
        $start = now()->startOfYear()->startOfMonth();
        $end = now()->endOfMonth();
        $months = [];
        $cursor = $start->copy();
        while ($cursor->lte($end)) {
            $months[] = $cursor->format('Y-m');
            $cursor->addMonthNoOverflow();
        }
        $paidBySantriMonth = StudentPayment::where('status', 'paid')
            ->whereBetween('paid_at', [$start, $end])
            ->get()
            ->groupBy(fn($p) => $p->santri_id)
            ->map(function ($rows) {
                return collect($rows)->map(fn($p) => Carbon::parse($p->paid_at)->format('Y-m'))
                    ->unique()->values();
            });
        $santriIds = Santri::pluck('id');
        $totalTunggak = 0;
        foreach ($santriIds as $sid) {
            $paid = $paidBySantriMonth->get($sid, collect());
            $unpaid = collect($months)->reject(fn($m) => $paid->contains($m));
            if ($unpaid->count() > 0) $totalTunggak++;
        }

        // Grafik: pembayaran 6 bulan terakhir (jumlah total)
        $chartStart = now()->copy()->subMonths(5)->startOfMonth(); // include current
        $chartMonths = [];
        $ptr = $chartStart->copy();
        while ($ptr->lte($end)) {
            $chartMonths[] = $ptr->copy();
            $ptr->addMonthNoOverflow();
        }
        // Use Postgres-compatible date formatting (to_char)
        $payments = StudentPayment::where('status', 'paid')
            ->whereBetween('paid_at', [$chartStart, $end])
            ->selectRaw("to_char(paid_at, 'YYYY-MM') as ym, SUM(amount) as total")
            ->groupByRaw("to_char(paid_at, 'YYYY-MM')")
            ->get()
            ->keyBy('ym');
        $chartData = collect($chartMonths)->map(function ($d) use ($payments) {
            $ym = $d->format('Y-m');
            $label = $d->format('m-Y');
            $total = (float) ($payments[$ym]->total ?? 0);
            return [ 'month' => $label, 'total' => $total ];
        });

        return Inertia::render('dashboard/dashboard', [
            'stats' => [
                'total_santri' => $totalSantri,
                'total_kas' => $totalKas,
                'total_tunggak' => $totalTunggak,
            ],
            'charts' => [
                'payments_last_6_months' => $chartData,
            ],
        ]);
    }
}
