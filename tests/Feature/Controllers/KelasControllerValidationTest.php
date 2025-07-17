<?php

namespace Tests\Feature\Controllers;

use App\Models\Kelas;
use App\Models\Unit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KelasControllerValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_create_kelas_requires_nama_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);

        $response = $this->post('/kelas/create', [
            'unit_id' => $unit->id,
            // nama_kelas is missing
        ]);

        $response->assertSessionHasErrors(['nama_kelas']);
    }

    public function test_create_kelas_requires_unit_id()
    {
        $response = $this->post('/kelas/create', [
            'nama_kelas' => 'Kelas Test',
            // unit_id is missing
        ]);

        $response->assertSessionHasErrors(['unit_id']);
    }

    public function test_update_kelas_requires_id()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);

        $response = $this->put('/kelas/update', [
            'nama_kelas' => 'Kelas Test',
            'unit_id' => $unit->id,
            // id is missing
        ]);

        $response->assertSessionHasErrors(['id']);
    }

    public function test_update_kelas_requires_nama_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $response = $this->put('/kelas/update', [
            'id' => $kelas->id,
            'unit_id' => $unit->id,
            // nama_kelas is missing
        ]);

        $response->assertSessionHasErrors(['nama_kelas']);
    }

    public function test_update_kelas_requires_unit_id()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $response = $this->put('/kelas/update', [
            'id' => $kelas->id,
            'nama_kelas' => 'Kelas Update',
            // unit_id is missing
        ]);

        $response->assertSessionHasErrors(['unit_id']);
    }

    public function test_update_nonexistent_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);

        $response = $this->put('/kelas/update', [
            'id' => 999, // non-existent id
            'nama_kelas' => 'Kelas Update',
            'unit_id' => $unit->id,
        ]);

        // This should result in a 404 or similar error
        $response->assertStatus(500); // or appropriate error status
    }
}
