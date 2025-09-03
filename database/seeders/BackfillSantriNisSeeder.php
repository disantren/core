<?php

namespace Database\Seeders;

use App\Models\Santri;
use Illuminate\Database\Seeder;

class BackfillSantriNisSeeder extends Seeder
{
    public function run(): void
    {
        // Generate NIS untuk santri yang belum punya, cukup nomor urut (ID) saja
        Santri::whereNull('nis')->orderBy('id')->chunkById(200, function ($rows) {
            foreach ($rows as $s) {
                $nis = (string) $s->id;
                // Pastikan unik; jika ada bentrok, tambahkan suffix numerik
                $suffix = 0;
                $final = $nis;
                while (Santri::where('nis', $final)->where('id', '!=', $s->id)->exists()) {
                    $suffix++;
                    $final = (string) ((int) $nis + $suffix);
                }
                $s->nis = $final;
                $s->save();
            }
        });
    }
}
