<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('santris', function (Blueprint $table) {
            $table->id(); // Gue ganti `santri_id` jadi `id`
            $table->foreignId('unit_id')->constrained('units');
            // WARNING: Di diagram lu ga ada relasi buat kelas_id, tapi gue tambahin karena logis.
            $table->foreignId('kelas_id')->constrained('kelas'); 
            $table->string('status')->nullable();
            $table->string('nama');
            $table->date('tanggal_lahir')->nullable();
            $table->string('alamat')->nullable();
            $table->string('ibu_kandung')->nullable();
            $table->string('ayah_kandung')->nullable();
            $table->string('nisn')->unique()->nullable();
            $table->string('no_hp')->nullable();
            $table->string('no_hp_orang_tua')->nullable();
            $table->text('password'); // Biasanya password di-hash jadi string(255), tapi text juga oke
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('santris');
    }
};