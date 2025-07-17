<?php

namespace App\Providers;

use App\Models\AppSetting;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $app_setting = AppSetting::find(1);
        if (!$app_setting) {
            $app_setting = new AppSetting();
            $app_setting->save();
        }


        Inertia::share("app_setting", $app_setting);
    }
}
