<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Santri extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $table = 'santris';

    protected $fillable = [
        'unit_id',
        'kelas_id',
        'kamar_id',
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

    protected $hidden = [
        'password',
    ];

    /**
     * Dapetin unit asal santri.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function kamar(): BelongsTo
    {
        return $this->belongsTo(Kamar::class);
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
