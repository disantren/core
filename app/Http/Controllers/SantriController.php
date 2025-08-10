<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Kelas;
use App\Models\Santri;
use App\Models\SantriKelas;
use App\Models\TahunAjaran;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SantriController extends Controller
{
    /**
     * Backward compatibility bila route lama masih pakai invokable.
     * Disarankan ganti ke index() via Route::resource.
     */
    public function __invoke(Request $request)
    {
        return $this->index($request);
    }

    /**
     * LIST + FILTER + SEARCH (Index)
     */
    public function index(Request $request)
    {
        try {
            $units = Unit::all();
            $kelas = Kelas::all();
            $kamar = Kamar::all();
            $tahun_ajaran = TahunAjaran::all();

            $query = Santri::with([
                'unit',
                'kamar',
                'kelas',
                'riwayatKelas.kelas',
                'riwayatKelas.tahunAjaran',
            ]);

            Log::info($request->all());

            if ($request->has('unit_id')) {
                $query->whereHas('unit', function ($query) use ($request) {
                    // Dipertahankan sesuai kode awalmu
                    $query->where('unit_id', $request->input('unit_id'));
                });

                $kelas = Kelas::where('unit_id', $request->input('unit_id'))->get();
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
                $query->whereHas('kamar', function ($query) use ($request) {
                    $query->where('kamar_id', $request->input('kamar_id'));
                });
            }

            // Search nama & NISN (dipertahankan)
            if ($request->filled('search')) {
                $searchTerm = $request->input('search');
                $driver = DB::getDriverName();

                $query->where(function ($query) use ($searchTerm, $driver) {
                    if ($driver === 'pgsql') {
                        $query->where('nama', 'ILIKE', '%' . $searchTerm . '%')
                            ->orWhere('nisn', 'ILIKE', '%' . $searchTerm . '%');
                    } else {
                        $lowerSearch = strtolower($searchTerm);
                        $query->whereRaw('LOWER(nama) LIKE ?', ['%' . $lowerSearch . '%'])
                            ->orWhereRaw('LOWER(nisn) LIKE ?', ['%' . $lowerSearch . '%']);
                    }
                });
            }

            $perPage = $request->input('per_page', 15);
            $santri = $query->paginate($perPage)->withQueryString();

            return Inertia::render("santri-management/santri-management", [
                "santri" => $santri,
                "units"  => $units,
                "kelas"  => $kelas,
                "kamar"  => $kamar,
                "tahun_ajaran" => $tahun_ajaran
            ]);
        } catch (\Exception $e) {
            Log::error("SantriController@index: " . $e);

            return response()->json([
                'message' => 'Gagal mengambil data santri.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * STORE (POST)
     */
    public function create(Request $request)
    {
        $validate = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'kelas_id' => 'required|exists:kelas,id',
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
            'status' => 'required|in:aktif,nonaktif,lulus,pindah',
            'nama' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $santri = Santri::create($validate);
        $santriKelas = SantriKelas::create([
            'santri_id' => $santri->id,
            'kelas_id' => $request->kelas_id,
            'tahun_ajaran_id' => $request->tahun_ajaran_id,
        ]);
    }
}
