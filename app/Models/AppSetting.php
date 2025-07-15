<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pondok_pesantren',
        'logo_img',
        'alamat',
        'instagram',
        'facebook',
        'website',
        'linkeding',
    ];
}