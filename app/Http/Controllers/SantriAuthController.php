<?php

namespace App\Http\Controllers;

use App\Models\Santri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SantriAuthController extends Controller
{
    public function showLogin()
    {
        // If already logged in as santri, redirect to absen page
        if (Auth::guard('santri')->check()) {
            return Redirect::to('/santri/absen');
        }
        return Inertia::render('santri/login');
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'identifier' => 'required|string', // NIS atau NISN
            'password' => 'required|string',
        ]);

        $santri = Santri::where('nis', $data['identifier'])
            ->orWhere('nisn', $data['identifier'])
            ->first();

        if (!$santri) {
            return back()->withErrors(['identifier' => 'Akun santri tidak ditemukan']);
        }

        // Catatan: password santri saat ini disimpan plaintext. Ini tidak aman.
        // Disarankan untuk di-hash. Untuk kompatibilitas sekarang, bandingkan langsung.
        if ($santri->password !== $data['password']) {
            return back()->withErrors(['password' => 'Password salah']);
        }

        Auth::guard('santri')->login($santri, true);

        return Redirect::to('/santri/absen');
    }

    public function logout(Request $request)
    {
        Auth::guard('santri')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::to('/santri/login');
    }
}

