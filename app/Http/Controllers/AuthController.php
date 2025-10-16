<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Otp;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Send OTP to user email before registration
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users,email',
        ]);

        $otpCode = rand(100000, 999999);
        $expiry = Carbon::now()->addMinutes(5);

        // Save or update OTP record
        Otp::updateOrCreate(
            ['email' => $request->email],
            ['otp' => $otpCode, 'expires_at' => $expiry]
        );

        // Send OTP via email
        Mail::raw("Your verification code is: $otpCode", function ($message) use ($request) {
            $message->to($request->email)
                    ->subject('Your OTP Code');
        });

        return response()->json(['message' => 'OTP sent successfully']);
    }

    /**
     * Register user after OTP verification
     */
    public function registerWithOtp(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
            'fullName' => 'required|string|max:255',
            'nationality' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'passportId' => 'required|string|max:50',
            'password' => 'required|string|min:8',
        ]);

        $otpRecord = Otp::where('email', $validated['email'])->first();

        if (!$otpRecord) {
            return response()->json(['message' => 'OTP not found'], 404);
        }

        if ($otpRecord->isExpired()) {
            return response()->json(['message' => 'OTP expired'], 400);
        }

        if ($otpRecord->otp !== $validated['otp']) {
            return response()->json(['message' => 'Invalid OTP'], 400);
        }

        // Create user
        $user = User::create([
            'name' => $validated['fullName'],
            'email' => $validated['email'],
            'nationality' => $validated['nationality'],
            'phone' => $validated['phone'],
            'passport_id' => $validated['passportId'],
            'password' => Hash::make($validated['password']),
        ]);

        // Delete OTP after use
        $otpRecord->delete();

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user
        ], 201);
    }

    /**
     * Basic login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
        ]);
    }
}
