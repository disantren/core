<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{

    public function run(): void
    {

        AppSetting::truncate();

        AppSetting::insert([
            'id' => 1,
            'nama_pondok_pesantren' => 'Pondok Pesantren Al-Falah',
            'logo_img' => 'logo.png',
            'alamat' => 'Jl. Raya No. 123, Jakarta',
            'instagram' => '@alfalah',
            'facebook' => 'facebook.com/alfalah',
            'website' => 'alfalah.com',
            'linkedin' => 'linkedin.com/company/alfalah',
        ]);
    }
}
