<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles  Allowed role names (comma-separated)
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!Auth::check()) {
            return Inertia::render('unauthorized-page');
        }

        $user = Auth::user();

        // Normalize role names (case-insensitive compare)
        $allowed = array_map(fn($r) => strtolower(trim($r)), $roles);
        $current = strtolower(optional($user->role)->name ?? '');

        if ($current === '' || (!empty($allowed) && !in_array($current, $allowed, true))) {
            return Inertia::render('unauthorized-page');
        }

        return $next($request);
    }
}

