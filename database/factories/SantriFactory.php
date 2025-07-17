<?php

namespace Database\Factories;

use App\Models\Santri;
use App\Models\Unit;
use App\Models\Kelas;
use Illuminate\Database\Eloquent\Factories\Factory;

class SantriFactory extends Factory
{
    protected $model = Santri::class;

    public function definition()
    {
        return [
            'unit_id' => Unit::factory(),
            'kelas_id' => Kelas::factory(),
            'nama' => $this->faker->name(),
            'tanggal_lahir' => $this->faker->dateTimeBetween('-25 years', '-15 years')->format('Y-m-d'),
            'alamat' => $this->faker->address(),
            'ibu_kandung' => $this->faker->name('female'),
            'ayah_kandung' => $this->faker->name('male'),
            'nisn' => $this->faker->numerify('##########'),
            'no_hp' => $this->faker->phoneNumber(),
            'no_hp_orang_tua' => $this->faker->phoneNumber(),
            'password' => bcrypt('password'),
            'status' => $this->faker->randomElement(['aktif', 'non-aktif', 'alumni']),
        ];
    }
}
