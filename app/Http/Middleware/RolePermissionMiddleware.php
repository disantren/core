<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RolePermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $permissionName  Nama izin yang diperlukan
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $permissionName)
    {
        // Pastikan pengguna sudah login
        if (!Auth::check()) {
            return Inertia::render("unauthorized-page");
        }

        // Dapatkan pengguna yang sedang login
        $user = Auth::user();

        // Periksa apakah pengguna memiliki izin yang diperlukan
        if (!$user->hasPermissionTo($permissionName)) {
            return Inertia::render("unauthorized-page");
        }

        // Jika pengguna memiliki izin, lanjutkan ke rute berikutnya
        return $next($request);
    }
}