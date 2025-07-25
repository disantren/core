<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Route
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard Main Route
Route::prefix('dashboard')->group(function () {
    Route::get('/', DashboardController::class);
});



// Include separated route files
require __DIR__ . '/app-setting-routes.php';
require __DIR__ . '/user-management-routes.php';
require __DIR__ . '/kelas-routes.php';
require __DIR__ . '/kamar-routes.php';
require __DIR__ . '/santri-router.php';

// Include default Laravel route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
