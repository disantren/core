<?php

use App\Http\Controllers\kelasController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    // Kelas Management Routes
    Route::get('/kelas', kelasController::class)->name('kelas');
    Route::post('/kelas', [kelasController::class, "create"])->name('kelas.create');
    Route::patch('/kelas', [kelasController::class, "update"])->name('kelas.edit');
    Route::get('/kelas/{unit_id}', [kelasController::class, "get_kelas_by_unit"])->name('kelas.get_kelas_by_unit');
});
