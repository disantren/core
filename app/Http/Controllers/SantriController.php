<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SantriController extends Controller
{
    public function __invoke(){
        return Inertia::render("santri-management/santri-management");
    }


}
