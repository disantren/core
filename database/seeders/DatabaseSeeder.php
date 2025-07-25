<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        // $this->call([AppSeeder::class, UserSeeder::class, UnitSeeder::class, SantriSeeder::class]);
        $this->call([SantriSeeder::class]);
    }
}
