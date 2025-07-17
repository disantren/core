<?php

namespace Tests\Unit\Models;

use App\Models\Kelas;
use App\Models\Unit;
use App\Models\Santri;
use App\Models\SantriKelas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class KelasTest extends TestCase
{
    use RefreshDatabase;

    public function test_kelas_can_be_created()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $this->assertDatabaseHas('kelas', [
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $this->assertEquals('Kelas Test', $kelas->nama_kelas);
        $this->assertEquals($unit->id, $kelas->unit_id);
    }

    public function test_kelas_has_fillable_attributes()
    {
        $kelas = new Kelas();
        $fillable = $kelas->getFillable();

        $this->assertContains('unit_id', $fillable);
        $this->assertContains('nama_kelas', $fillable);
    }

    public function test_kelas_belongs_to_unit()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\BelongsTo', $kelas->unit());
        $this->assertEquals($unit->id, $kelas->unit->id);
        $this->assertEquals($unit->nama_unit, $kelas->unit->nama_unit);
    }

    public function test_kelas_has_many_santri()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $santri = Santri::create([
            'unit_id' => $unit->id,
            'kelas_id' => $kelas->id,
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

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\HasMany', $kelas->santri());
        $this->assertTrue($kelas->santri->contains($santri));
    }

    public function test_kelas_has_many_santri_kelas()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $santri = Santri::create([
            'unit_id' => $unit->id,
            'kelas_id' => $kelas->id,
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

        $santriKelas = SantriKelas::create([
            'santri_id' => $santri->id,
            'kelas_id' => $kelas->id,
            'tahun_ajaran_id' => 1,
            'status' => 'aktif'
        ]);

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\HasMany', $kelas->santriKelas());
        $this->assertTrue($kelas->santriKelas->contains($santriKelas));
    }

    public function test_kelas_uses_soft_deletes()
    {
        $unit = Unit::create(['nama_unit' => 'Unit Test']);
        $kelas = Kelas::create([
            'unit_id' => $unit->id,
            'nama_kelas' => 'Kelas Test'
        ]);

        $kelas->delete();

        $this->assertSoftDeleted($kelas);
        $this->assertDatabaseHas('kelas', [
            'id' => $kelas->id,
            'nama_kelas' => 'Kelas Test'
        ]);
    }

    public function test_kelas_uses_correct_table_name()
    {
        $kelas = new Kelas();
        $this->assertEquals('kelas', $kelas->getTable());
    }
}
