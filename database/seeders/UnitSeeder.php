<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        Unit::truncate();

        Unit::create([
            'nama_unit' => 'Reguler',
        ]);
        Unit::create([
            'nama_unit' => 'Yayasan'
        ]);
    }
}
