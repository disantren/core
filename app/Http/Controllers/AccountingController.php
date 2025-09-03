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

        // Recent entries
        $recentLedgerEntries = LedgerEntry::with(['account', 'santri'])
            ->orderByDesc('entry_date')
            ->orderByDesc('id')
            ->limit(5)
            ->get();

        $recentStudentPayments = StudentPayment::with('santri')
            ->orderByDesc('paid_at')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

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
            'recent_ledger_entries' => $recentLedgerEntries,
            'recent_student_payments' => $recentStudentPayments,
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

        return redirect()->route('akuntansi.akun');
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

        return redirect()->route('akuntansi.jurnal');
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

        return redirect()->route('akuntansi.pembayaran');
    }

    /**
     * Account management page
     */
    public function akun(Request $request)
    {
        $accounts = Account::with('parent')->orderBy('code')->get();
        return Inertia::render('akuntansi/akun/index', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Journal entries page
     */
    public function jurnal(Request $request)
    {
        $query = LedgerEntry::with(['account', 'santri'])->orderByDesc('entry_date')->orderByDesc('id');
        if ($request->filled('account_id')) {
            $query->where('account_id', $request->integer('account_id'));
        }
        if ($request->filled('santri_id')) {
            $query->where('santri_id', $request->integer('santri_id'));
        }
        $perPage = (int) $request->input('per_page', 15);
        $entries = $query->paginate($perPage)->withQueryString();

        $accounts = Account::orderBy('code')->get();
        $santris = Santri::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('akuntansi/jurnal/index', [
            'ledger_entries' => $entries,
            'accounts' => $accounts,
            'santris' => $santris,
        ]);
    }

    /**
     * Student payments page
     */
    public function pembayaran(Request $request)
    {
        $query = StudentPayment::with('santri')->orderByDesc('paid_at')->orderByDesc('created_at');
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('santri_id')) {
            $query->where('santri_id', $request->integer('santri_id'));
        }
        $perPage = (int) $request->input('per_page', 15);
        $payments = $query->paginate($perPage)->withQueryString();

        $santris = Santri::select('id', 'nama')->orderBy('nama')->get();

        return Inertia::render('akuntansi/pembayaran/index', [
            'student_payments' => $payments,
            'santris' => $santris,
        ]);
    }

    // Update/Delete endpoints
    public function updateAccount(Request $request, Account $account)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:accounts,code,' . $account->id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
            'parent_id' => 'nullable|exists:accounts,id',
        ]);

        $account->update($validated);
        return redirect()->route('akuntansi.akun');
    }

    public function deleteAccount(Account $account)
    {
        $account->delete();
        return back();
    }

    public function updateLedgerEntry(Request $request, LedgerEntry $entry)
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
        $entry->update($validated + ['debit' => $debit, 'credit' => $credit]);
        return redirect()->route('akuntansi.jurnal');
    }

    public function deleteLedgerEntry(LedgerEntry $entry)
    {
        $entry->delete();
        return back();
    }

    public function updatePayment(Request $request, StudentPayment $payment)
    {
        $validated = $request->validate([
            'santri_id' => 'required|exists:santris,id',
            'amount' => 'required|numeric|min:0',
            'status' => 'required|in:pending,paid,failed',
            'note' => 'nullable|string',
        ]);
        $paidAt = $validated['status'] === 'paid' ? now() : null;
        $payment->update($validated + ['paid_at' => $paidAt]);
        return redirect()->route('akuntansi.pembayaran');
    }

    public function deletePayment(StudentPayment $payment)
    {
        $payment->delete();
        return back();
    }
}
