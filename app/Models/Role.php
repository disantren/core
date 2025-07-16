<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Role extends Model
{
    use HasFactory;

    // Nama tabel yang terkait dengan model ini
    protected $table = 'roles';

    // Kolom yang bisa diisi secara massal (mass assignable)
    protected $fillable = ['name'];

    /**
     * Mendefinisikan relasi Many-to-Many dengan model Permission.
     * Sebuah peran bisa memiliki banyak izin (permissions).
     */
    public function permissions()
    {
        // Relasi many-to-many menggunakan tabel pivot 'permission_role'
        return $this->belongsToMany(Permission::class, 'permission_role', 'role_id', 'permission_id');
    }

    /**
     * Mendefinisikan relasi One-to-Many dengan model User.
     * Sebuah peran bisa dimiliki oleh banyak pengguna (users).
     */
    public function users()
    {
        // Relasi one-to-many, di mana 'role_id' adalah foreign key di tabel users
        return $this->hasMany(User::class, 'role_id');
    }
}
