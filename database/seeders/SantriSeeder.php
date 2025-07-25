<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Santri;
use App\Models\Unit;
use App\Models\Kamar;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\SantriKelas;
use Illuminate\Support\Facades\Hash; // Untuk hashing password
use Faker\Factory as Faker; // Untuk generate data palsu

class SantriSeeder extends Seeder
{
    /**
     * Jalankan database seeder.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create('id_ID'); // Menggunakan Faker dengan lokal Indonesia

        // 1. Buat data Unit
        $units = [];
        for ($i = 0; $i < 3; $i++) { // Contoh: 3 Unit
            $units[] = Unit::create([
                'nama_unit' => 'Unit ' . chr(65 + $i), // Unit A, Unit B, Unit C
            ]);
        }
        $this->command->info('Unit berhasil di-seed.');

        // 2. Buat data Kamar
        $kamars = [];
        for ($i = 0; $i < 5; $i++) { // Contoh: 5 Kamar
            $kamars[] = Kamar::create([
                'nama_kamar' => 'Kamar ' . ($i + 1),
            ]);
        }
        $this->command->info('Kamar berhasil di-seed.');

        // 3. Buat data Kelas (terkait dengan Unit)
        $kelas = [];
        foreach ($units as $unit) {
            for ($i = 0; $i < 4; $i++) { // Setiap Unit punya 4 Kelas
                $kelas[] = Kelas::create([
                    'unit_id' => $unit->id,
                    'nama_kelas' => 'Kelas ' . ($i + 1) . ' ' . $unit->nama_unit,
                ]);
            }
        }
        $this->command->info('Kelas berhasil di-seed.');

        // 4. Buat data Tahun Ajaran
        $tahunAjarans = [];
        for ($i = 0; $i < 3; $i++) { // Contoh: 3 Tahun Ajaran terakhir
            $tahunAjarans[] = TahunAjaran::create([
                'nama_tahun_ajaran' => (date('Y') - $i) . '/' . (date('Y') - $i + 1),
            ]);
        }
        $this->command->info('Tahun Ajaran berhasil di-seed.');

        // 5. Buat data Santri
        $this->command->info('Memulai seeding Santri...');
        for ($i = 0; $i < 50; $i++) { // Contoh: 50 Santri
            $randomUnit = $faker->randomElement($units);
            $randomKamar = $faker->randomElement($kamars);
            // Ambil kelas yang terkait dengan unit yang dipilih secara acak
            $kelasInUnit = Kelas::where('unit_id', $randomUnit->id)->get();
            $randomKelas = $faker->randomElement($kelasInUnit->toArray()); // Konversi ke array karena randomElement butuh array

            $santri = Santri::create([
                'unit_id' => $randomUnit->id,
                'kelas_id' => $randomKelas['id'], // Ambil ID dari array
                'kamar_id' => $randomKamar->id,
                'status' => $faker->randomElement(['aktif', 'non-aktif', 'lulus']),
                'nama' => $faker->name,
                'tanggal_lahir' => $faker->date('Y-m-d', '2005-01-01'), // Santri lahir sebelum 2005
                'alamat' => $faker->address,
                'ibu_kandung' => $faker->name('female'),
                'ayah_kandung' => $faker->name('male'),
                'nisn' => $faker->unique()->numerify('##########'), // 10 digit NISN
                'no_hp' => $faker->phoneNumber,
                'no_hp_orang_tua' => $faker->phoneNumber,
                'password' => Hash::make('password123'), // Password default yang sudah di-hash
            ]);

            // 6. Buat data SantriKelas untuk setiap Santri
            // Setiap santri bisa punya riwayat di beberapa tahun ajaran
            foreach ($tahunAjarans as $tahunAjaran) {
                // Pilih kelas acak yang terkait dengan unit santri tersebut
                $kelasForSantriKelas = Kelas::where('unit_id', $santri->unit_id)->get();
                $randomKelasForSantriKelas = $faker->randomElement($kelasForSantriKelas->toArray());

                SantriKelas::create([
                    'santri_id' => $santri->id,
                    'kelas_id' => $randomKelasForSantriKelas['id'],
                    'tahun_ajaran_id' => $tahunAjaran->id,
                ]);
            }
        }
        $this->command->info('Santri dan SantriKelas berhasil di-seed.');
    }
}
