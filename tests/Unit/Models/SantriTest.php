<?php

namespace Tests\Unit\Models;

use App\Models\Santri;
use App\Models\Unit;
use App\Models\Kelas;
use App\Models\Kamar;
use App\Models\SantriKelas;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SantriTest extends TestCase
{
    use RefreshDatabase;

    public function test_santri_can_be_created()
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

        $this->assertDatabaseHas('santris', [
            'nama' => 'Santri Test',
            'unit_id' => $unit->id,
            'kelas_id' => $kelas->id,
        ]);

        $this->assertEquals('Santri Test', $santri->nama);
        $this->assertEquals($unit->id, $santri->unit_id);
    }

    public function test_santri_has_fillable_attributes()
    {
        $santri = new Santri();
        $fillable = $santri->getFillable();

        $expectedFillable = [
            'unit_id', 'kelas_id', 'kamar_id', 'status',
            'nama', 'tanggal_lahir', 'alamat', 'ibu_kandung',
            'ayah_kandung', 'nisn', 'no_hp', 'no_hp_orang_tua',
            'password'
        ];

        foreach ($expectedFillable as $field) {
            $this->assertContains($field, $fillable);
        }
    }

    public function test_santri_belongs_to_unit()
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

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\BelongsTo', $santri->unit());
        $this->assertEquals($unit->id, $santri->unit->id);
        $this->assertEquals($unit->nama_unit, $santri->unit->nama_unit);
    }

    public function test_santri_belongs_to_kelas()
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

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\BelongsTo', $santri->kelas());
        $this->assertEquals($kelas->id, $santri->kelas->id);
        $this->assertEquals($kelas->nama_kelas, $santri->kelas->nama_kelas);
    }

    public function test_santri_has_many_riwayat_kelas()
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

        $this->assertInstanceOf('Illuminate\Database\Eloquent\Relations\HasMany', $santri->riwayatKelas());
        $this->assertTrue($santri->riwayatKelas->contains($santriKelas));
    }

    public function test_santri_uses_soft_deletes()
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

        $santri->delete();

        $this->assertSoftDeleted($santri);
        $this->assertDatabaseHas('santris', [
            'id' => $santri->id,
            'nama' => 'Santri Test'
        ]);
    }

    public function test_santri_uses_correct_table_name()
    {
        $santri = new Santri();
        $this->assertEquals('santris', $santri->getTable());
    }
}
