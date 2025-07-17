<?php

namespace Tests\Unit\Models;

use App\Models\Unit;
use App\Models\Kelas;
use App\Models\Santri;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UnitTest extends TestCase
{
    use RefreshDatabase;

    public function test_unit_can_be_created()
    {
        $unit = Unit::create([
            'nama_unit' => 'Unit Test'
        ]);

        $this->assertDatabaseHas('units', [
            'nama_unit' => 'Unit Test'
        ]);

        $this->assertEquals('Unit Test', $unit->nama_unit);
    }

    public function test_unit_has_fillable_attributes()
    {
        $unit = new Unit();
        $fillable = $unit->getFillable();

        $this->assertContains('nama_unit', $fillable);
    }

    public function test_unit_has_many_kelas_relationship()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\HasMany', $unit->kelas());
        $this->assertTrue($unit->kelas->contains($kelas));
    }

    public function test_unit_has_many_santri_relationship()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        
        $santri = Santri::create([
            'unit_id' => $unit->id,
            'nama' => 'Santri Test',
            'tanggal_lahir' => '2000-01-01',
            'alamat' => 'Alamat Test',
            'ibu_kandung' => 'Ibu Test',
            'ayah_kandung' => 'Ayah Test',
            'nisn' => '1234567890',
            'no_hp' => '081234567890',
            'no_hp_orang_tua' => '081234567891',
            'password' => bcrypt('password'),
        ]);

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\HasMany', $unit->santri());
        $this->assertTrue($unit->santri->contains($santri));
    }

    public function test_unit_uses_soft_deletes()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        
        $unit->delete();

        $this->assertSoftDeleted($unit);
        $this->assertDatabaseHas('units', [
            'id' => $unit->id,
            'nama_unit' => 'Unit Test'
        ]);
    }
}
