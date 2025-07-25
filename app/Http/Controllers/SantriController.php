<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Kelas;
use App\Models\Santri;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SantriController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            $units = Unit::all();
            $kelas = Kelas::all();
            $kamar = Kamar::all();

            $query = Santri::with([
                'unit',
                'kamar',
                'kelas',
                'riwayatKelas.kelas',
                'riwayatKelas.tahunAjaran'
            ]);

            if ($request->has('unit_id')) {
                $query->where('unit_id', $request->input('unit_id'));
            }

            if ($request->has('tahun_ajaran_id')) {
                $query->whereHas('riwayatKelas', function ($query) use ($request) {
                    $query->where('tahun_ajaran_id', $request->input('tahun_ajaran_id'));
                });
            }

            if ($request->has('kelas_id')) {
                $query->whereHas('kelas', function ($query) use ($request) {
                    $query->where('kelas_id', $request->input('kelas_id'));
                });
            }

            if ($request->has('kamar_id')) {
                $query->where('kamar_id', $request->input('kamar_id'));
            }

            // Search functionality for nama and NISN
            if ($request->has('search') && !empty($request->input('search'))) {
                $searchTerm = $request->input('search');
                $query->where(function ($query) use ($searchTerm) {
                    $query->where('nama', 'LIKE', '%' . $searchTerm . '%')
                        ->orWhere('nisn', 'LIKE', '%' . $searchTerm . '%');
                });
            }

            $perPage = $request->input('per_page', 15);
            $santri = $query->paginate($perPage);

            return Inertia::render("santri-management/santri-management", [
                "santri" => $santri,
                "units" => $units,
                "kelas" => $kelas,
                "kamar" => $kamar
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal mengambil data santri.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
