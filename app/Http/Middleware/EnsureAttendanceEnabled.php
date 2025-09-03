<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAttendanceEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $setting = AppSetting::find(1);
        if (!$setting || !$setting->attendance_enabled) {
            if ($request->expectsJson()) {
                abort(403, 'Fitur absensi dinonaktifkan.');
            }
            return redirect()->route('dashboard')->with('error', 'Fitur absensi dinonaktifkan.');
        }

        return $next($request);
    }
}

