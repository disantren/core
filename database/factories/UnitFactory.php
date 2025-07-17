<?php

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

class UnitFactory extends Factory
{
    protected $model = Unit::class;

    public function definition()
    {
        return [
            'nama_unit' => $this->faker->randomElement([
                'Putra', 'Putri', 'Tahfidz', 'Qiroah', 'Kitab Kuning'
            ]) . ' ' . $this->faker->numberBetween(1, 10),
        ];
    }
}
