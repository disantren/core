<?php

namespace Database\Seeders;

use App\Models\AppSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    // $table->id();
    //         $table->string('nama_pondok_pesantren')->nullable();
    //         $table->string('logo_img')->nullable();
    //         $table->text('alamat')->nullable();
    //         $table->string('instagram')->nullable();
    //         $table->string('facebook')->nullable();
    //         $table->string('website')->nullable();
    //         $table->string('linkedin')->nullable();


    public function run(): void
    {
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
