<?php

use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\kamarController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\kelasController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::prefix('dashboard')->group(function () {
    Route::get('/', DashboardController::class);

    Route::get('/app-setting', AppSettingController::class)->name('app-setting');
    Route::get('/app-setting/unit', [AppSettingController::class, 'unit'])->name('app-setting.unit');
    Route::post('/app-setting/unit', [AppSettingController::class, 'create_unit'])->name('app-setting.unit.create');
    Route::patch('/app-setting/unit', [AppSettingController::class, 'update_unit'])->name('app-setting.unit.update');

    Route::post('/app-setting/update', [AppSettingController::class, 'update'])->name('app-setting.update');

    Route::get('/user-management', UserManagementController::class)->name('user-management');
    
    Route::post('/user-management', [UserManagementController::class, "create_user"])->name('user-management.create_user');
    Route::patch('/user-management', [UserManagementController::class, "update_user"])->name('user-management.edit_user');
    
    Route::get('/user-management/roles', [UserManagementController::class, "Role"])->name('user-management.role');
    Route::post('/user-management/roles', [UserManagementController::class, "create_role"])->name('user-management.create_role');
    Route::patch('/user-management/roles', [UserManagementController::class, "edit_role"])->name('user-management.edit_role');


    Route::get('/user-management/permissions', [UserManagementController::class, "Permission"])->name('user-management.permission');
    Route::post('/user-management/permissions', [UserManagementController::class, "create_permission"])->name('user-management.create_permission');
    Route::patch('/user-management/permissions', [UserManagementController::class, "edit_permission"])->name('user-management.edit_permission');
    
    
    Route::get('/kelas', kelasController::class)->name('kelas');
    Route::post('/kelas', [kelasController::class, "create"])->name('kelas.create');
    Route::patch('/kelas', [kelasController::class, "update"])->name('kelas.edit');

    Route::get('/kamar', kamarController::class)->name('kamar');
    Route::post('/kamar', [kamarController::class, "create"])->name('kamar.create');
    Route::patch('/kamar', [kamarController::class, "update"])->name('kamar.edit');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
