<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Nama tabel yang terkait dengan model ini
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     * Kolom yang bisa diisi secara massal.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id', // Tambahkan role_id karena ada di tabel users
    ];

    /**
     * The attributes that should be hidden for serialization.
     * Kolom yang harus disembunyikan saat diserialisasi (misalnya ke JSON).
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     * Tipe data untuk casting atribut.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Mendefinisikan relasi One-to-One (atau One-to-Many dari sisi Role) dengan model Role.
     * Seorang pengguna hanya memiliki satu peran (role).
     */
    public function role()
    {
        // Relasi belongsTo, di mana 'role_id' adalah foreign key di tabel users
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Mengecek apakah user memiliki izin tertentu melalui perannya.
     * Ini adalah metode bantu untuk memeriksa izin.
     *
     * @param string $permissionName Nama izin yang ingin dicek.
     * @return bool
     */
    public function hasPermissionTo(string $permissionName): bool
    {
        if (!$this->role) {
            return false;
        }
        return $this->role->permissions->contains('name', $permissionName);
    }
}
