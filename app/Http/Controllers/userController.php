<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return response()->json([
            'users' => User::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email',
            'password'     => 'required|string|min:8',
            'nationality'  => 'required|string|max:100',
            'phone'        => 'required|string|max:20',
            'passport_id'  => 'required|string|max:50|unique:users,passport_id',
            'role'         => 'required|string|in:user,staff,admin,landlord', // adjust roles if needed
        ]);

        $user = User::create([
            'name'         => $request->name,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'nationality'  => $request->nationality,
            'phone'        => $request->phone,
            'passport_id'  => $request->passport_id,
            'role'         => $request->role,
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user'    => $user,
        ], 201);
    }
    public function destroy($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'User deleted successfully']);
}
public function update(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'nationality' => 'nullable|string|max:255',
        'phone' => 'nullable|string|max:255',
        'passport_id' => 'nullable|string|max:255',
        'role' => 'required|string',
        'password' => 'nullable|string|min:6',
    ]);

    if (!empty($validated['password'])) {
        $validated['password'] = bcrypt($validated['password']);
    } else {
        unset($validated['password']); // keep old password
    }

    $user->update($validated);

    return response()->json(['message' => 'User updated successfully', 'user' => $user]);
}

}
