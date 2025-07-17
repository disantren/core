<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('santri_kelas', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('kelas_id')->constrained('kelas');
            $table->foreignId('santri_id')->constrained('santris');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran');
            $table->timestamps();
            $table->softDeletes();
        }); 
    }

    public function down(): void
    {
        Schema::dropIfExists('santri_kelas');
    }
};