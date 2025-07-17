<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kamar extends Model
{
    protected $table = "kamar";
    protected $fillable = [
        'nama_kamar',
    ];

    public $timestamps = false;

    public function santri(): HasMany
    {
        return $this->hasMany(Santri::class);
    }
}
