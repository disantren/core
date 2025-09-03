<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\LedgerEntry;
use App\Models\Santri;
use App\Models\StudentPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AccountingController extends Controller
{
    /**
     * Akuntansi Dashboard
     */
    public function index(Request $request)
    {
        // Aggregate stats
        $totalAccounts = Account::count();
        $totalEntries = LedgerEntry::count();

        // Total revenue = sum(credit - debit) for revenue accounts
        $totalRevenue = DB::table('ledger_entries as le')
            ->join('accounts as a', 'a.id', '=', 'le.account_id')
            ->where('a.type', 'revenue')
            ->selectRaw('COALESCE(SUM(le.credit - le.debit),0) as total')
            ->value('total');

        // Payment stats
        $paymentPaid = StudentPayment::where('status', 'paid')->sum('amount');
        $paymentPendingCount = StudentPayment::where('status', 'pending')->count();
        $paymentFailedCount = StudentPayment::where('status', 'failed')->count();
        $paymentPaidCount = StudentPayment::where('status', 'paid')->count();

        $recentLedgerEntries = LedgerEntry::with(['account', 'santri'])
            ->orderByDesc('entry_date')
            ->orderByDesc('id')
            ->limit(10)
            ->get();

        $recentPayments = StudentPayment::with('santri')
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $accounts = Account::orderBy('code')->get();
        $santriOptions = Santri::select('id', 'nama')->orderBy('nama')->limit(50)->get();

        return Inertia::render('akuntansi/akuntansi-dashboard', [
            'stats' => [
                'total_accounts' => $totalAccounts,
                'total_entries' => $totalEntries,
                'total_revenue' => (float) $totalRevenue,
                'payments' => [
                    'paid_amount' => (float) $paymentPaid,
                    'paid_count' => $paymentPaidCount,
                    'pending_count' => $paymentPendingCount,
                    'failed_count' => $paymentFailedCount,
                ],
            ],
            'accounts' => $accounts,
            'recent_ledger_entries' => $recentLedgerEntries,
            'recent_student_payments' => $recentPayments,
            'santris' => $santriOptions,
        ]);
    }

    /**
     * Create an account (Chart of Accounts)
     */
    public function createAccount(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:accounts,code',
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
            'parent_id' => 'nullable|exists:accounts,id',
        ]);

        Account::create($validated);

        return redirect()->route('akuntansi.dashboard');
    }

    /**
     * Create a ledger entry
     */
    public function createLedgerEntry(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'entry_date' => 'required|date',
            'description' => 'nullable|string',
            'debit' => 'nullable|numeric|min:0',
            'credit' => 'nullable|numeric|min:0',
            'santri_id' => 'nullable|exists:santris,id',
            'reference' => 'nullable|string|max:100',
        ]);

        $debit = (float) ($validated['debit'] ?? 0);
        $credit = (float) ($validated['credit'] ?? 0);
        if ($debit <= 0 && $credit <= 0) {
            return back()->withErrors(['debit' => 'Debit atau Credit harus diisi > 0']);
        }
        if ($debit > 0 && $credit > 0) {
            return back()->withErrors(['debit' => 'Hanya salah satu: Debit ATAU Credit']);
        }

        LedgerEntry::create($validated + [
            'debit' => $debit,
            'credit' => $credit,
        ]);

        return redirect()->route('akuntansi.dashboard');
    }

    /**
     * Create a dummy student payment (no gateway)
     */
    public function createDummyPayment(Request $request)
    {
        $validated = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,failed',
            'note' => 'nullable|string',
        ]);

        $paidAt = null;
        if ($validated['status'] === 'paid') {
            $paidAt = now();
        }

        StudentPayment::create([
            'santri_id' => $validated['santri_id'],
            'amount' => $validated['amount'],
            'status' => $validated['status'],
            'method' => 'dummy',
            'note' => $validated['note'] ?? null,
            'paid_at' => $paidAt,
        ]);

        return redirect()->route('akuntansi.dashboard');
    }
}
