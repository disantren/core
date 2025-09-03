<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\kelasController;
use App\Http\Controllers\kamarController;
use App\Http\Controllers\SantriController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home Route
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Dashboard Main Route (secured)
Route::prefix('dashboard')->middleware('auth')->group(function () {
    Route::get('/', DashboardController::class)->name('dashboard');
});



// Auth-protected feature routes
Route::middleware('auth')->prefix('dashboard')->group(function () {
    // User Management
    Route::get('/user-management', UserManagementController::class)
        ->middleware('permission:user-management.view')
        ->name('user-management');

    Route::post('/user-management', [UserManagementController::class, 'create_user'])
        ->middleware('permission:user-management.create')
        ->name('user-management.create_user');

    Route::patch('/user-management', [UserManagementController::class, 'update_user'])
        ->middleware('permission:user-management.edit')
        ->name('user-management.edit_user');

    // Role Management
    Route::get('/user-management/roles', [UserManagementController::class, 'Role'])
        ->middleware('permission:roles.view')
        ->name('user-management.role');

    Route::post('/user-management/roles', [UserManagementController::class, 'create_role'])
        ->middleware('permission:roles.create')
        ->name('user-management.create_role');

    Route::patch('/user-management/roles', [UserManagementController::class, 'edit_role'])
        ->middleware('permission:roles.edit')
        ->name('user-management.edit_role');

    // Permission Management
    Route::get('/user-management/permissions', [UserManagementController::class, 'Permission'])
        ->middleware('permission:permissions.view')
        ->name('user-management.permission');

    Route::post('/user-management/permissions', [UserManagementController::class, 'create_permission'])
        ->middleware('permission:permissions.create')
        ->name('user-management.create_permission');

    Route::patch('/user-management/permissions', [UserManagementController::class, 'edit_permission'])
        ->middleware('permission:permissions.edit')
        ->name('user-management.edit_permission');

    // App Setting
    Route::get('/app-setting', AppSettingController::class)
        ->middleware('permission:app-setting.view')
        ->name('app-setting');

    Route::post('/app-setting/update', [AppSettingController::class, 'update'])
        ->middleware('permission:app-setting.update')
        ->name('app-setting.update');

    // Units under App Setting
    Route::get('/app-setting/unit', [AppSettingController::class, 'unit'])
        ->middleware('permission:units.view')
        ->name('app-setting.unit');

    Route::post('/app-setting/unit', [AppSettingController::class, 'create_unit'])
        ->middleware('permission:units.create')
        ->name('app-setting.unit.create');

    Route::patch('/app-setting/unit', [AppSettingController::class, 'update_unit'])
        ->middleware('permission:units.edit')
        ->name('app-setting.unit.update');

    // Kelas
    Route::get('/kelas', kelasController::class)
        ->middleware('permission:kelas.view')
        ->name('kelas');

    Route::post('/kelas', [kelasController::class, 'create'])
        ->middleware('permission:kelas.create')
        ->name('kelas.create');

    Route::patch('/kelas', [kelasController::class, 'update'])
        ->middleware('permission:kelas.edit')
        ->name('kelas.edit');

    Route::get('/kelas/{unit_id}', [kelasController::class, 'get_kelas_by_unit'])
        ->middleware('permission:kelas.view')
        ->name('kelas.get_kelas_by_unit');

    // Kamar
    Route::get('/kamar', kamarController::class)
        ->middleware('permission:kamar.view')
        ->name('kamar');

    Route::post('/kamar', [kamarController::class, 'create'])
        ->middleware('permission:kamar.create')
        ->name('kamar.create');

    Route::patch('/kamar', [kamarController::class, 'update'])
        ->middleware('permission:kamar.edit')
        ->name('kamar.edit');

    // Santri
    Route::get('/santri', [SantriController::class, 'index'])
        ->middleware('permission:santri.view')
        ->name('santri.index');

    Route::post('/santri', [SantriController::class, 'create'])
        ->middleware('permission:santri.create')
        ->name('santri.create');

    // Santri Edit Page + Update
    Route::get('/santri/{santri}/edit', [SantriController::class, 'edit'])
        ->middleware('permission:santri.edit')
        ->name('santri.edit');

    Route::patch('/santri/{santri}', [SantriController::class, 'update'])
        ->middleware('permission:santri.edit')
        ->name('santri.update');

    // Santri Destroy (Soft Delete)
    Route::delete('/santri/{santri}', [SantriController::class, 'destroy'])
        ->middleware('permission:santri.edit')
        ->name('santri.destroy');
});

// Include default Laravel route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
