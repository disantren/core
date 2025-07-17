<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TahunAjaran extends Model
{
    use HasFactory, SoftDeletes;

    // Nama tabelnya gue specify biar jelas, soalnya beda dari nama model
    protected $table = 'tahun_ajarans'; 

    protected $fillable = ['nama_tahun_ajaran'];

    public function santriKelas(): HasMany
    {
        return $this->hasMany(SantriKelas::class);
    }
}