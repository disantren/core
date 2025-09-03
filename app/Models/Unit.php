<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['nama_unit', 'spp_monthly_price'];

    public function kelas(): HasMany
    {
        return $this->hasMany(Kelas::class);
    }

    public function santri(): HasMany
    {
        return $this->hasMany(Santri::class);
    }
}
