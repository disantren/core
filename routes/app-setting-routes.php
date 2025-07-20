<?php

use App\Http\Controllers\AppSettingController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    // App Setting Routes
    Route::get('/app-setting', AppSettingController::class)->name('app-setting');
    Route::post('/app-setting/update', [AppSettingController::class, 'update'])->name('app-setting.update');
    
    // Unit Management Routes
    Route::get('/app-setting/unit', [AppSettingController::class, 'unit'])->name('app-setting.unit');
    Route::post('/app-setting/unit', [AppSettingController::class, 'create_unit'])->name('app-setting.unit.create');
    Route::patch('/app-setting/unit', [AppSettingController::class, 'update_unit'])->name('app-setting.unit.update');
});
