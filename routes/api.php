<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

Route::get('/test', function () {
    return response()->json([
        'message' => 'API route is working in Laravel 12 🚀'
    ]);
});

// Grouped under /api/v1/auth
Route::prefix('v1/auth')->middleware(['api'])->group(function () {
    Route::post('/register', [AuthController::class, 'registerDirect']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp-register', [AuthController::class, 'registerWithOtp']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
});


