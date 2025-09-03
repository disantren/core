<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure roles exist (based on your provided list)
        $roles = [
            'superadmin',
            'Ustad',
            'Pengasuh',
            'Guru',
            'Pegawai',
            'Akuntan',
        ];

        $roleModels = [];
        foreach ($roles as $roleName) {
            $roleModels[$roleName] = Role::firstOrCreate(['name' => $roleName]);
        }

        // Build permission name lists used in the app
        $perm = function (string $module, array $actions) {
            return array_map(fn($a) => "$module.$a", $actions);
        };

        $allPermissionNames = [
            ...$perm('user-management', ['view', 'create', 'edit']),
            ...$perm('roles', ['view', 'create', 'edit']),
            ...$perm('permissions', ['view', 'create', 'edit']),
            ...$perm('app-setting', ['view', 'update']),
            ...$perm('units', ['view', 'create', 'edit']),
            ...$perm('kelas', ['view', 'create', 'edit']),
            ...$perm('kamar', ['view', 'create', 'edit']),
            ...$perm('santri', ['view', 'create', 'edit']),
            // Akuntansi
            ...$perm('akuntansi', ['view']),
            ...$perm('akuntansi.akun', ['view', 'create', 'update', 'delete']),
            ...$perm('akuntansi.jurnal', ['view', 'create', 'update', 'delete']),
            ...$perm('akuntansi.pembayaran', ['view', 'create', 'update', 'delete']),
        ];

        $permIdsByName = Permission::whereIn('name', $allPermissionNames)
            ->get()
            ->keyBy('name')
            ->map->id
            ->all();

        // Define default policy per role (adjust as needed)
        $policy = [
            'superadmin' => $allPermissionNames, // full access

            // Typical teaching role: manage santri data, view classes/rooms
            'Ustad' => [
                ...$perm('santri', ['view', 'create', 'edit']),
                ...$perm('kelas', ['view']),
                ...$perm('kamar', ['view']),
            ],

            // Caretaker/manager: manage santri, kelas, kamar
            'Pengasuh' => [
                ...$perm('santri', ['view', 'create', 'edit']),
                ...$perm('kelas', ['view', 'create', 'edit']),
                ...$perm('kamar', ['view', 'create', 'edit']),
            ],

            // Teacher: read-only access to santri and classes
            'Guru' => [
                ...$perm('santri', ['view']),
                ...$perm('kelas', ['view']),
            ],

            // Staff: manage units and basic app settings
            'Pegawai' => [
                ...$perm('units', ['view', 'create', 'edit']),
                ...$perm('app-setting', ['view', 'update']),
            ],

            // Accountant: full access to accounting module
            'Akuntan' => [
                ...$perm('akuntansi', ['view']),
                ...$perm('akuntansi.akun', ['view', 'create', 'update', 'delete']),
                ...$perm('akuntansi.jurnal', ['view', 'create', 'update', 'delete']),
                ...$perm('akuntansi.pembayaran', ['view', 'create', 'update', 'delete']),
            ],
        ];

        foreach ($policy as $roleName => $permissionNames) {
            $role = $roleModels[$roleName];
            $ids = collect($permissionNames)
                ->map(fn($name) => $permIdsByName[$name] ?? null)
                ->filter()
                ->values()
                ->all();

            // Attach without removing existing assignments to be safe in prod
            $role->permissions()->syncWithoutDetaching($ids);
        }
    }
}
