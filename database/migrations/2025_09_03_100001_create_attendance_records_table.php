<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_session_id')->constrained('attendance_sessions')->onDelete('cascade');
            $table->foreignId('santri_id')->constrained('santris');
            $table->string('status'); // present, late, sick, permit, absent
            $table->dateTime('checkin_at')->nullable();
            $table->dateTime('checkout_at')->nullable();
            $table->integer('late_minutes')->default(0);
            $table->string('method')->nullable(); // manual, qr, rfid
            $table->foreignId('marked_by')->nullable()->constrained('users');
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['attendance_session_id', 'santri_id'], 'uniq_att_record_session_santri');
            $table->index(['santri_id']);
            $table->index(['status']);
            $table->index(['checkin_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_records');
    }
};

