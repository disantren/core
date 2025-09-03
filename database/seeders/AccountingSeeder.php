<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\LedgerEntry;
use App\Models\Santri;
use App\Models\StudentPayment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AccountingSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // 1) Seed Chart of Accounts (idempotent by code)
            $accounts = [
                // Assets
                ['code' => '1000', 'name' => 'Kas', 'type' => 'asset'],
                ['code' => '1100', 'name' => 'Bank', 'type' => 'asset'],
                // Liabilities
                ['code' => '2000', 'name' => 'Utang Usaha', 'type' => 'liability'],
                // Equity
                ['code' => '3000', 'name' => 'Modal', 'type' => 'equity'],
                // Revenue
                ['code' => '4000', 'name' => 'Pendapatan SPP', 'type' => 'revenue'],
                // Expense
                ['code' => '5000', 'name' => 'Beban Operasional', 'type' => 'expense'],
            ];

            foreach ($accounts as $acc) {
                Account::updateOrCreate(
                    ['code' => $acc['code']],
                    ['name' => $acc['name'], 'type' => $acc['type']]
                );
            }

            $kas = Account::where('code', '1000')->first();
            $modal = Account::where('code', '3000')->first();
            $pendapatanSpp = Account::where('code', '4000')->first();

            // 2) Opening balance: Debit Kas 10,000,000; Credit Modal 10,000,000
            if ($kas && $modal) {
                $exists = LedgerEntry::where('reference', 'INIT-OPENING')->exists();
                if (!$exists) {
                    $date = now()->toDateString();
                    LedgerEntry::create([
                        'account_id' => $kas->id,
                        'entry_date' => $date,
                        'description' => 'Saldo awal kas',
                        'debit' => 10000000,
                        'credit' => 0,
                        'reference' => 'INIT-OPENING',
                    ]);
                    LedgerEntry::create([
                        'account_id' => $modal->id,
                        'entry_date' => $date,
                        'description' => 'Saldo awal kas',
                        'debit' => 0,
                        'credit' => 10000000,
                        'reference' => 'INIT-OPENING',
                    ]);
                }
            }

            // 3) Sample student payments (if santri exists)
            $santris = Santri::query()->limit(3)->get();
            if ($santris->count() > 0 && $kas && $pendapatanSpp) {
                foreach ($santris as $santri) {
                    // Avoid duplicate sample for same santri
                    $already = StudentPayment::where('santri_id', $santri->id)
                        ->where('note', 'LIKE', 'Seeder sample%')
                        ->exists();
                    if ($already) continue;

                    $amount = 300000; // SPP contoh
                    $payment = StudentPayment::create([
                        'santri_id' => $santri->id,
                        'amount' => $amount,
                        'status' => 'paid',
                        'method' => 'dummy',
                        'paid_at' => now(),
                        'note' => 'Seeder sample payment',
                    ]);

                    $ref = 'PMT-' . $payment->id;
                    $date = now()->toDateString();
                    // Debit Kas
                    LedgerEntry::create([
                        'account_id' => $kas->id,
                        'santri_id' => $santri->id,
                        'entry_date' => $date,
                        'description' => 'Pembayaran SPP ' . $santri->nama,
                        'debit' => $amount,
                        'credit' => 0,
                        'reference' => $ref,
                    ]);
                    // Credit Pendapatan SPP
                    LedgerEntry::create([
                        'account_id' => $pendapatanSpp->id,
                        'santri_id' => $santri->id,
                        'entry_date' => $date,
                        'description' => 'Pembayaran SPP ' . $santri->nama,
                        'debit' => 0,
                        'credit' => $amount,
                        'reference' => $ref,
                    ]);
                }
            }
        });
    }
}

