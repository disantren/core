<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kelas extends Model
{
    use HasFactory;
    
    // Nama tabelnya gue specify biar jelas
    protected $table = 'kelas'; 

    protected $fillable = [
        'unit_id',
        'nama_kelas',
    ];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function santri(): HasMany
    {
        return $this->hasMany(Santri::class);
    }

    public function santriKelas(): HasMany
    {
        return $this->hasMany(SantriKelas::class);
    }
}