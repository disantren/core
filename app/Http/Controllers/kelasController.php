<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Kelas;
use App\Models\Unit;
use Illuminate\Support\Facades\Auth;
class kelasController extends Controller
{
    public function __invoke(){

        $kelas = Kelas::with("unit")->get();
        $units = Unit::all();
        return Inertia::render("kelas-management/kelas-management", [
            "kelas" => $kelas,
            "units" => $units,
        ]);
    }

    public function create(Request $request){
        $request->validate([
            "nama_kelas" => "required",
            "unit_id" => "required",
        ]);

        $kelas = Kelas::create([
            "nama_kelas" => $request->nama_kelas,
            "unit_id" => $request->unit_id,
        ]);

        return redirect()->route("kelas");
    }
    public function update(Request $request){
        $request->validate([
            "id"=> "required",
            "nama_kelas"=> "required",
            "unit_id"=> "required",
        ]);

        $kelas = Kelas::find($request->id);
        $kelas->update([
            "nama_kelas"=> $request->nama_kelas,
            "unit_id"=> $request->unit_id,
        ]);

        return redirect()->route("kelas");      
    }
}
