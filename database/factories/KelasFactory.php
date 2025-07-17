<?php

namespace Database\Factories;

use App\Models\Kelas;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class KelasFactory extends Factory
{
    protected $model = Kelas::class;

    public function definition()
    {
        return [
            'unit_id' => Unit::factory(),
            'nama_kelas' => $this->faker->randomElement([
                '1A', '1B', '1C', '2A', '2B', '2C', '3A', '3B', '3C',
                'Ula', 'Wustho', 'Ulya', 'Tamhidi', 'I\'dadi'
            ]),
        ];
    }
}
