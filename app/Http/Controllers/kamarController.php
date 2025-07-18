<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kamar;
use Inertia\Inertia;

class kamarController extends Controller
{
    public function __invoke()
    {
        $kamar = Kamar::all();
        return Inertia::render("kamar-management/kamar-management", [
            "kamar" => $kamar,
        ]);
    }


    public function create(Request $request)
    {
        $request->validate([
            "nama_kamar" => "required",
        ]);

        $kamar = Kamar::create([
            "nama_kamar" => $request->nama_kamar,
        ]);
    }
    public function update(Request $request)
    {
        $request->validate([
            "id" => "required",
            "nama_kamar" => "required",
        ]);

        $kamar = Kamar::find($request->id);
        $kamar->update([
            "nama_kamar" => $request->nama_kamar,
        ]);
    }
}
