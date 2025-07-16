<?php

use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::prefix('dashboard')->group(function () {
    Route::get('/', DashboardController::class);

    Route::get('/app-setting', AppSettingController::class)->name('app-setting');
    Route::post('/app-setting/update', [AppSettingController::class, 'update'])->name('app-setting.update');

    Route::get('/user-management', UserManagementController::class)->name('user-management');


    Route::get('/user-management/roles', [UserManagementController::class, "Role"])->name('user-management.role');
    Route::post('/user-management/roles', [UserManagementController::class, "create_role"])->name('user-management.create_role');
    Route::patch('/user-management/roles', [UserManagementController::class, "edit_role"])->name('user-management.edit_role');


    Route::get('/user-management/permissions', [UserManagementController::class, "Permission"])->name('user-management.permission');
    Route::post('/user-management/permissions', [UserManagementController::class, "create_permission"])->name('user-management.create_permission');
});



require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
