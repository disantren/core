<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Santri extends Authenticatable
{
    use HasFactory, Notifiable;
    
    
    // Nama tabelnya gue specify biar jelas
    protected $table = 'santris';

    protected $fillable = [
        'unit_id',
        'kelas_id',
        'status',
        'nama',
        'tanggal_lahir',
        'alamat',
        'ibu_kandung',
        'ayah_kandung',
        'nisn',
        'no_hp',
        'no_hp_orang_tua',
        'password',
    ];

    /**
     * Dapetin unit asal santri.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * Dapetin kelas AKTIF santri saat ini.
     */
    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Dapetin SEMUA histori kelas santri.
     */
    public function riwayatKelas(): HasMany
    {
        return $this->hasMany(SantriKelas::class);
    }
}