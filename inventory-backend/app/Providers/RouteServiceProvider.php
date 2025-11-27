<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    // ... other properties and methods ...

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // 1. Define rate limiting (standard)
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        // 2. Map the route files
        $this->routes(function () {

            // CRITICAL: This block must be present and correctly point to your routes/api.php file.
            Route::middleware('api') // Applies 'api' middleware to all routes here
                ->prefix('api')      // Prepends 'api/' to all route URIs
                ->group(base_path('routes/api.php')); // Loads the routes/api.php file

            // Loads the standard web routes
            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }
}