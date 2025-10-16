<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Direct registration without OTP
     */
    public function registerDirect(Request $request)
    {
        // Validate input and store the result in $validated
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'fullName' => 'required|string|max:255',
            'nationality' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'passportId' => 'required|string|max:50',
            'password' => 'required|string|min:8',
        ]);

        // Create user using validated data
        $user = User::create([
            'name' => $validated['fullName'],
            'email' => $validated['email'],
            'nationality' => $validated['nationality'],
            'phone' => $validated['phone'],
            'passport_id' => $validated['passportId'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Basic login with email and password
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Invalid credentials'
            ], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user,
        ]);
    }
}
