<?php

namespace Tests\Unit;

use App\Models\Unit;
use App\Models\Kelas;
use App\Models\Santri;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FactoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_unit_factory_creates_unit()
    {
        $unit = Unit::factory()->create();

        $this->assertInstanceOf(Unit::class, $unit);
        $this->assertNotNull($unit->nama_unit);
        $this->assertDatabaseHas('units', [
            'id' => $unit->id,
            'nama_unit' => $unit->nama_unit,
        ]);
    }

    public function test_kelas_factory_creates_kelas_with_unit()
    {
        $kelas = Kelas::factory()->create();

        $this->assertInstanceOf(Kelas::class, $kelas);
        $this->assertNotNull($kelas->nama_kelas);
        $this->assertNotNull($kelas->unit_id);
        $this->assertInstanceOf(Unit::class, $kelas->unit);
        $this->assertDatabaseHas('kelas', [
            'id' => $kelas->id,
            'nama_kelas' => $kelas->nama_kelas,
            'unit_id' => $kelas->unit_id,
        ]);
    }

    public function test_santri_factory_creates_santri_with_relationships()
    {
        $santri = Santri::factory()->create();

        $this->assertInstanceOf(Santri::class, $santri);
        $this->assertNotNull($santri->nama);
        $this->assertNotNull($santri->unit_id);
        $this->assertNotNull($santri->kelas_id);
        $this->assertInstanceOf(Unit::class, $santri->unit);
        $this->assertInstanceOf(Kelas::class, $santri->kelas);
        $this->assertDatabaseHas('santris', [
            'id' => $santri->id,
            'nama' => $santri->nama,
            'unit_id' => $santri->unit_id,
            'kelas_id' => $santri->kelas_id,
        ]);
    }

    public function test_can_create_multiple_units()
    {
        $units = Unit::factory()->count(5)->create();

        $this->assertCount(5, $units);
        $this->assertEquals(5, Unit::count());
    }

    public function test_can_create_kelas_with_specific_unit()
    {
        $unit = Unit::factory()->create(['nama_unit' => 'Unit Khusus']);
        $kelas = Kelas::factory()->create(['unit_id' => $unit->id]);

        $this->assertEquals($unit->id, $kelas->unit_id);
        $this->assertEquals('Unit Khusus', $kelas->unit->nama_unit);
    }

    public function test_can_create_santri_with_specific_unit_and_kelas()
    {
        $unit = Unit::factory()->create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::factory()->create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);
        
        $santri = Santri::factory()->create([
            'unit_id' => $unit->id,
            'kelas_id' => $kelas->id,
            'nama' => 'Santri Test'
        ]);

        $this->assertEquals($unit->id, $santri->unit_id);
        $this->assertEquals($kelas->id, $santri->kelas_id);
        $this->assertEquals('Santri Test', $santri->nama);
        $this->assertEquals('Unit Test', $santri->unit->nama_unit);
        $this->assertEquals('Kelas Test', $santri->kelas->nama_kelas);
    }
}
