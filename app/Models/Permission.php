<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    use HasFactory;

    // Nama tabel yang terkait dengan model ini
    protected $table = 'permissions';

    // Kolom yang bisa diisi secara massal (mass assignable)
    protected $fillable = ['name'];

    /**
     * Mendefinisikan relasi Many-to-Many dengan model Role.
     * Sebuah izin bisa dimiliki oleh banyak peran (roles).
     */
    public function roles()
    {
        // Relasi many-to-many menggunakan tabel pivot 'permission_role'
        return $this->belongsToMany(Role::class, 'permission_role', 'permission_id', 'role_id');
    }
}