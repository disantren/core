<?php

namespace Tests\Feature\Controllers;

use App\Models\Kelas;
use App\Models\Unit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KelasControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_kelas_index()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $this->get('/kelas')
            ->assertStatus(200)
            ->assertSee('Kelas Test')
            ->assertSee('Unit Test');
    }

    public function test_create_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);

        $response = $this->post('/kelas/create', [
            'nama_kelas' => 'Kelas Baru',
            'unit_id' => $unit->id,
        ]);

        $response->assertRedirect('/kelas');

        $this->assertDatabaseHas('kelas', [
            'nama_kelas' => 'Kelas Baru',
            'unit_id' => $unit->id,
        ]);
    }

    public function test_update_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Lama'
        ]);

        $response = $this->put('/kelas/update', [
            'id' => $kelas->id,
            'nama_kelas' => 'Kelas Update',
            'unit_id' => $unit->id,
        ]);

        $response->assertRedirect('/kelas');

        $this->assertDatabaseHas('kelas', [
            'nama_kelas' => 'Kelas Update',
            'unit_id' => $unit->id,
        ]);
    }
}

