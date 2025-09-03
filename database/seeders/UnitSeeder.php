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
            'spp_monthly_price' => 300000,
        ]);
        Unit::create([
            'nama_unit' => 'Yayasan',
            'spp_monthly_price' => 250000,
        ]);
    }
}
