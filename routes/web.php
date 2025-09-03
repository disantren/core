<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AppSettingController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\kelasController;
use App\Http\Controllers\kamarController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\AccountingController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\SantriAuthController;
use App\Http\Controllers\SantriAttendanceController;
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

    // Akuntansi
    Route::get('/akuntansi', [AccountingController::class, 'index'])
        ->name('akuntansi.dashboard');

    Route::post('/akuntansi/akun', [AccountingController::class, 'createAccount'])
        ->name('akuntansi.create_account');

    Route::post('/akuntansi/jurnal', [AccountingController::class, 'createLedgerEntry'])
        ->name('akuntansi.create_ledger');

    Route::post('/akuntansi/pembayaran', [AccountingController::class, 'createDummyPayment'])
        ->name('akuntansi.create_payment');

    // Akuntansi CRUD pages

    Route::prefix('akuntansi')->name('akuntansi.')->group(function () {
        Route::get('/', [AccountingController::class, 'index'])->name('dashboard');

        // Page routes
        Route::get('/akun', [AccountingController::class, 'akun'])->name('akun');
        Route::get('/jurnal', [AccountingController::class, 'jurnal'])->name('jurnal');
        Route::get('/pembayaran', [AccountingController::class, 'pembayaran'])->name('pembayaran');

        // Account CRUD
        Route::post('/akun', [AccountingController::class, 'createAccount'])->name('create_account');
        Route::put('/akun/{account}', [AccountingController::class, 'updateAccount'])->name('update_account');
        Route::delete('/akun/{account}', [AccountingController::class, 'deleteAccount'])->name('delete_account');

        // Ledger Entry CRUD
        Route::post('/jurnal', [AccountingController::class, 'createLedgerEntry'])->name('create_ledger');
        Route::put('/jurnal/{entry}', [AccountingController::class, 'updateLedgerEntry'])->name('update_ledger');
        Route::delete('/jurnal/{entry}', [AccountingController::class, 'deleteLedgerEntry'])->name('delete_ledger');

        // Payment CRUD
        Route::post('/pembayaran', [AccountingController::class, 'createDummyPayment'])->name('create_payment');
        Route::put('/pembayaran/{payment}', [AccountingController::class, 'updatePayment'])->name('update_payment');
        Route::delete('/pembayaran/{payment}', [AccountingController::class, 'deletePayment'])->name('delete_payment');
    });

    // Attendance (Absensi)
    Route::middleware('feature.attendance')->prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::post('/sessions', [AttendanceController::class, 'storeSession'])->name('sessions.store');
        Route::post('/sessions/{session}/lock', [AttendanceController::class, 'lock'])->name('sessions.lock');
        Route::get('/sessions/{session}', [AttendanceController::class, 'detail'])->name('sessions.detail');
        Route::post('/sessions/{session}/records', [AttendanceController::class, 'mark'])->name('records.mark');
    });
});

// Include default Laravel route files
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Backward-compatibility for typo route: /dahsboard/akuntansi
Route::get('/dahsboard/akuntansi', function () {
    return redirect()->route('akuntansi.dashboard');
})->middleware('auth');

// Santri Auth + Attendance routes
Route::prefix('santri')->group(function () {
    Route::middleware('guest:santri')->group(function () {
        Route::get('/login', [SantriAuthController::class, 'showLogin'])->name('santri.login');
        Route::post('/login', [SantriAuthController::class, 'login'])->name('santri.login.post');
    });

    Route::middleware(['auth:santri', 'feature.attendance'])->group(function () {
        Route::get('/', function () { return redirect('/santri/absen'); });
        Route::get('/absen', [SantriAttendanceController::class, 'index'])->name('santri.absen');
        Route::post('/absen', [SantriAttendanceController::class, 'mark'])->name('santri.absen.mark');
        Route::post('/logout', [SantriAuthController::class, 'logout'])->name('santri.logout');
    });
});
