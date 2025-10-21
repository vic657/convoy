<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;

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
        // Load web routes (default)
        Route::middleware('web')
            ->group(base_path('routes/web.php'));

        // Load api routes
        Route::prefix('api')
            ->middleware('api')
            ->group(base_path('routes/api.php'));

        // Register admin middleware
        $this->app['router']->aliasMiddleware('admin', \App\Http\Middleware\AdminMiddleware::class);
    }
}
