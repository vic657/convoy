<?php

use Illuminate\Support\Facades\Route;

// Serve React SPA from root
Route::get('/{any}', function () {
    return view('react');
})->where('any', '.*'); //  catch-all so React handles client-side routing
