<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SantriKelas extends Model
{
    use HasFactory;
    
    // Nama tabelnya gue specify biar jelas
    protected $table = 'santri_kelas'; 

    protected $fillable = [
        'kelas_id',
        'santri_id',
        'tahun_ajaran_id',
    ];

    public function santri(): BelongsTo
    {
        return $this->belongsTo(Santri::class);
    }

    public function kelas(): BelongsTo
    {
        return $this->belongsTo(Kelas::class);
    }

    public function tahunAjaran(): BelongsTo
    {
        return $this->belongsTo(TahunAjaran::class);
    }
}