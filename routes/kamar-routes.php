<?php

use App\Http\Controllers\kamarController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    // Kamar Management Routes
    Route::get('/kamar', kamarController::class)->name('kamar');
    Route::post('/kamar', [kamarController::class, "create"])->name('kamar.create');
    Route::patch('/kamar', [kamarController::class, "update"])->name('kamar.edit');
});
