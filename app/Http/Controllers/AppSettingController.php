<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AppSettingController extends Controller
{
    public function __invoke()
    {


        $data = AppSetting::find(1);
        if (!$data) {
            $data = new AppSetting();
            $data->save();
        }
        return Inertia::render('app-setting/app-setting', [
            'data' => $data,
        ]);
    }

    public function update(Request $request)
    {
        $rule_validation = [
            'nama_pondok_pesantren' => 'required|string|max:255',
            'alamat' => 'string',
            'instagram' => 'string',
            'facebook' => 'string',
            'website' => 'string',
            'linkedin' => 'string',
            'spp_monthly_price' => 'nullable|numeric|min:0',
            'attendance_enabled' => 'nullable|boolean',
        ];

        if ($request->hasFile('logo_img')) {
            $rule_validation['logo_img'] = 'required|image|mimes:jpeg,png,jpg,gif,svg';
        }

        $request->validate($rule_validation);

        Log::info($request->all());

        $data = AppSetting::find(1);

        if ($request->hasFile('logo_img')) {
            $file = $request->file('logo_img');
            $path = $file->store('app', 'public');
            if ($path) {
                $data->logo_img = $path;
            } else {
                Log::error('Failed to store logo image.');
                return redirect()->back()->withErrors(['logo_img' => 'Gagal mengunggah gambar logo. Mohon coba lagi.']);
            }
        }


        $data->nama_pondok_pesantren = $request->nama_pondok_pesantren;
        $data->alamat = $request->alamat;
        $data->instagram = $request->instagram;
        $data->facebook = $request->facebook;
        $data->website = $request->website;
        $data->linkedin = $request->linkedin;
        if ($request->has('spp_monthly_price')) {
            $data->spp_monthly_price = $request->spp_monthly_price;
        }
        if ($request->has('attendance_enabled')) {
            $data->attendance_enabled = (bool) $request->boolean('attendance_enabled');
        }
        $data->save();
        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function unit(){
        $data = Unit::all();

        return Inertia::render('app-setting/unit/unit', [
            'units' => $data,
        ]);
    }

    public function create_unit(Request $request){
        $request->validate([
            'nama_unit' => 'required|string|max:255',
            'spp_monthly_price' => 'nullable|numeric|min:0',
        ]);

        $data = new Unit();
        $data->nama_unit = $request->nama_unit;
        if ($request->has('spp_monthly_price')) {
            $data->spp_monthly_price = (int) $request->spp_monthly_price;
        }
        $data->save();
        return redirect()->back()->with('success', 'Unit berhasil dibuat.');
    }

    public function update_unit(Request $request){
        $request->validate([
            'id' => 'required|numeric',
            'nama_unit' => 'required|string|max:255',
            'spp_monthly_price' => 'nullable|numeric|min:0',
        ]);

        $data = Unit::find($request->id);
        $data->nama_unit = $request->nama_unit;
        if ($request->has('spp_monthly_price')) {
            $data->spp_monthly_price = (int) $request->spp_monthly_price;
        }
        $data->save();
        return redirect()->back()->with('success', 'Unit berhasil diperbarui.');
    }

}
