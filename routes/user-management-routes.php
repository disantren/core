<?php

use App\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::prefix('dashboard')->group(function () {
    // User Management Routes
    Route::get('/user-management', UserManagementController::class)->name('user-management');
    Route::post('/user-management', [UserManagementController::class, "create_user"])->name('user-management.create_user');
    Route::patch('/user-management', [UserManagementController::class, "update_user"])->name('user-management.edit_user');
    
    // Role Management Routes
    Route::get('/user-management/roles', [UserManagementController::class, "Role"])->name('user-management.role');
    Route::post('/user-management/roles', [UserManagementController::class, "create_role"])->name('user-management.create_role');
    Route::patch('/user-management/roles', [UserManagementController::class, "edit_role"])->name('user-management.edit_role');

    // Permission Management Routes
    Route::get('/user-management/permissions', [UserManagementController::class, "Permission"])->name('user-management.permission');
    Route::post('/user-management/permissions', [UserManagementController::class, "create_permission"])->name('user-management.create_permission');
    Route::patch('/user-management/permissions', [UserManagementController::class, "edit_permission"])->name('user-management.edit_permission');
});
