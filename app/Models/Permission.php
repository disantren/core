<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Permission extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'permissions';

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