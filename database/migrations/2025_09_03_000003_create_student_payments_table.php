<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('santri_id')->constrained('santris')->cascadeOnDelete();
            $table->decimal('amount', 15, 2);
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->string('method')->default('dummy'); // planned: xendit later
            $table->timestamp('paid_at')->nullable();
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(['status', 'paid_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_payments');
    }
};

