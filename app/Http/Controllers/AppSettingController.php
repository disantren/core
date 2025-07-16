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
            'logo_img' => 'image|mimes:jpeg,png,jpg,gif,svg',
            'alamat' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'website' => 'nullable|string',
            'linkedin' => 'nullable|string',
        ];

        if($request->hasFile('logo_img')){
            $rule_validation['logo_img'] = 'required|image|mimes:jpeg,png,jpg,gif,svg';
        }

        $request->validate($rule_validation);


        $data = AppSetting::find(1);
        if (!$data) {
            $data = new AppSetting();
        }
        
        if($request->hasFile('logo_img')){
            $file = $request->file('logo_img');
            $path = $file->store('app', 'public');
            if ($path) {
                $data->logo_img = $path;
            } else {
                Log::error('Failed to store logo image.');
                return redirect()->back()->withErrors(['logo_img' => 'Gagal mengunggah gambar logo. Mohon coba lagi.']);
            }
        }
        
        $data->fill($request->except('logo_img'));
        $data->save();
        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
