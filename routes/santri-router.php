<?php

use App\Http\Controllers\SantriController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    // Santri Management Routes
    Route::get('/santri', SantriController::class)->name('santri.index');
    Route::post('/santri', [SantriController::class, "create"])->name('santri.create');
    Route::patch('/santri', [SantriController::class, "update"])->name('santri.edit');
}); 