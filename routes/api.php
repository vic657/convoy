<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\DonationController;

// ============================
// TEST ROUTE
// ============================
Route::get('/test', function () {
    return response()->json([
        'message' => 'API route is working in Laravel 12 🚀'
    ]);
});

// ============================
// AUTH ROUTES
// ============================
Route::prefix('v1/auth')->middleware(['api'])->group(function () {
    Route::post('/register', [AuthController::class, 'registerDirect']);
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp-register', [AuthController::class, 'registerWithOtp']);
});

// ============================
// ADMIN ROUTES
// ============================
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);

    // User Management
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::post('/users', [UserController::class, 'store']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);
    Route::put('/users/{id}', [UserController::class, 'update']);

    // Staff
    Route::get('/staff', [AdminController::class, 'getStaff']);
   


    // Events CRUD
    Route::apiResource('events', EventController::class);
});
// Allow both admin and staff/storekeepers to mark received
Route::middleware(['auth:sanctum'])->group(function () {
    Route::put('/donations/{id}/status', [DonationController::class, 'updateStatus']);
});


// ============================
// PUBLIC ROUTES
// ============================
Route::get('/users', [UserController::class, 'index']);
Route::get('/events', [EventController::class, 'index']);

// ============================
// DONATION ROUTES
// ============================

// Publicly viewable
Route::get('/donations', [DonationController::class, 'index']);
Route::get('/events/{id}/donations', [DonationController::class, 'showByEvent']);

// Logged-in user actions
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/donations/user', [DonationController::class, 'userDonations']); // ✅ Add this line
});
