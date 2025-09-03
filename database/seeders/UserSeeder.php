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
        $role = Role::where("name", "superadmin")->first();
        $akuntan = Role::where("name", "Akuntan")->first();

        // $user = User::create([
        //     "name" => "superadmin",
        //     "role_id" => $role->id,
        //     "email" => "superadmin@superadmin.com",
        //     "password" => bcrypt("superadmin"),
        // ]);
        $user = User::create([
            "name" => "akuntan",
            "role_id" => $akuntan->id,
            "email" => "akuntan@akuntan.com",
            "password" => bcrypt("akuntan"),
        ]);


    }
}
