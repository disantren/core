<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
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
        $data->save();
        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
