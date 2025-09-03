<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Kelas;
use App\Models\Santri;
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

            $query = Santri::with([
                'unit',
                'kamar',
                'kelas',
                'riwayatKelas.kelas',
            ]);

            Log::info($request->all());

            if ($request->has('unit_id')) {
                $query->whereHas('unit', function ($query) use ($request) {
                    // Dipertahankan sesuai kode awalmu
                    $query->where('unit_id', $request->input('unit_id'));
                });

                $kelas = Kelas::where('unit_id', $request->input('unit_id'))->get();
            }

            // Tahun ajaran filter dihapus sementara

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
            'status' => 'required|in:aktif,nonaktif,lulus,pindah',
            'nama' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $santri = Santri::create($validate);
        // Catatan: Histori kelas (SantriKelas) tidak dibuat sementara karena tahun ajaran dinonaktifkan
    }

    /**
     * EDIT PAGE (GET)
     */
    public function edit(Santri $santri)
    {
        $santri->load(['unit', 'kelas', 'kamar']);
        $units = Unit::all();
        // Prefill kelas by current unit for initial options
        $kelas = $santri->unit_id ? Kelas::where('unit_id', $santri->unit_id)->get() : Kelas::all();

        return Inertia::render('santri-management/santri-edit', [
            'santri' => $santri,
            'units' => $units,
            'kelas' => $kelas,
        ]);
    }

    /**
     * UPDATE (PATCH)
     */
    public function update(Request $request, Santri $santri)
    {
        $validate = $request->validate([
            'unit_id' => 'required|exists:units,id',
            'kelas_id' => 'required|exists:kelas,id',
            'status' => ['required', Rule::in(['aktif', 'nonaktif', 'lulus', 'pindah'])],
            'nama' => 'required|string|max:255',
            'nisn' => 'nullable|string|max:50',
            'no_hp' => 'nullable|string|max:50',
            'tanggal_lahir' => 'nullable|date',
            'alamat' => 'nullable|string|max:255',
            'ayah_kandung' => 'nullable|string|max:255',
            'ibu_kandung' => 'nullable|string|max:255',
            'no_hp_orang_tua' => 'nullable|string|max:50',
            // password optional on update
            'password' => 'nullable|string|min:8',
        ]);

        // If password provided, keep; else remove to avoid overriding with null
        if (empty($validate['password'])) {
            unset($validate['password']);
        }

        $santri->update($validate);

        return redirect()->route('santri.index')->with('success', 'Data santri berhasil diperbarui');
    }

    /**
     * DESTROY (DELETE) - Soft delete santri
     */
    public function destroy(Santri $santri)
    {
        $santri->delete(); // Uses SoftDeletes

        return redirect()->back()->with('success', 'Data santri berhasil dihapus');
    }
}
