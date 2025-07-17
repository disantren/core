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
        return Inertia::render("Kamar", [
            "kamar" => $kamar,
        ]);
    }
}
