<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::create([
            "name" => "superadmin",
        ]);

        $user = User::create([
            "name" => "superadmin",
            "role_id" => $role->id,
            "email" => "superadmin@superadmin.com",
            "password" => bcrypt("superadmin"),
        ]);


    }
}
