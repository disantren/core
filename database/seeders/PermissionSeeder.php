<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Seed the application's permissions based on route usage.
     */
    public function run(): void
    {
        // Define modules and their actions as used in routes/web.php
        $permissionMap = [
            'user-management' => ['view', 'create', 'edit'],
            'roles' => ['view', 'create', 'edit'],
            'permissions' => ['view', 'create', 'edit'],
            'app-setting' => ['view', 'update'],
            'units' => ['view', 'create', 'edit'],
            'kelas' => ['view', 'create', 'edit'],
            'kamar' => ['view', 'create', 'edit'],
            'santri' => ['view', 'create', 'edit'],
        ];

        $permissions = [];
        foreach ($permissionMap as $module => $actions) {
            foreach ($actions as $action) {
                $permissions[] = "$module.$action";
            }
        }

        // Seed permissions (idempotent)
        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name]);
        }
    }
}

