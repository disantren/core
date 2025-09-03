<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('santris', function (Blueprint $table) {
            $table->id();   
            $table->foreignId('unit_id')->constrained('units');
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
            $table->text('password');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('santris');
    }
};