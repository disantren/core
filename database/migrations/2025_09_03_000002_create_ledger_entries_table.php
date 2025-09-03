<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('account_id')->constrained('accounts');
            $table->foreignId('santri_id')->nullable()->constrained('santris')->nullOnDelete();
            $table->date('entry_date');
            $table->string('description')->nullable();
            $table->decimal('debit', 15, 2)->default(0);
            $table->decimal('credit', 15, 2)->default(0);
            $table->string('reference')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['entry_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};

