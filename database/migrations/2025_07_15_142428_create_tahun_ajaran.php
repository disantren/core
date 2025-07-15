<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tahun_ajarans', function (Blueprint $table) {
            $table->id(); // Gue ganti `tahun_ajaran_id` jadi `id`
            $table->string('nama_tahun_ajaran');
            $table->timestamps(); // Opsional, tapi sangat disarankan
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tahun_ajarans');
    }
};