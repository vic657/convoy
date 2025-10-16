<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API route is working in Laravel 12 🚀'
    ]);
});

// Grouped under /api/v1/auth
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'registerDirect']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp-register', [AuthController::class, 'registerWithOtp']);

});

