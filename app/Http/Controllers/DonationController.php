<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Donation;
use Illuminate\Support\Facades\Auth;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        // Basic validation
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'type' => 'required|in:money,item,other',
            'payment_method' => 'nullable|string|max:100',
            'amount' => 'nullable|numeric|min:1',
            'item_category' => 'nullable|string|max:255',
            'item_description' => 'nullable|string',
            'pickup_location' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:50',
            'message' => 'nullable|string',
        ]);

        // Custom logic based on donation type
        if ($validated['type'] === 'money') {
            if (empty($validated['amount'])) {
                return response()->json(['message' => 'Amount is required for money donations'], 422);
            }
        } else {
            // Non-money donations: clear amount
            $validated['amount'] = null;
        }

        $user = Auth::user();

        $donation = Donation::create([
            'user_id' => $user ? $user->id : null,
            'event_id' => $validated['event_id'],
            'donor_name' => $user ? $user->name : $request->input('donor_name', 'Anonymous Donor'),
            'email' => $user ? $user->email : $request->input('email', null),
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'item_category' => $validated['item_category'] ?? null,
            'item_description' => $validated['item_description'] ?? null,
            'pickup_location' => $validated['pickup_location'] ?? null,
            'contact' => $validated['contact'] ?? null,
            'payment_method' => $validated['payment_method'] ?? 'Unknown',
            'message' => $validated['message'] ?? null,
        ]);

        return response()->json([
            'message' => 'Thank you for your donation!',
            'donation' => $donation,
        ], 201);
    }

    public function index()
    {
        return response()->json(Donation::with('event')->latest()->get());
    }

    public function showByEvent($eventId)
    {
        return response()->json(
            Donation::where('event_id', $eventId)->with('event')->latest()->get()
        );
    }

    public function userDonations()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $donatedEventIds = Donation::where('user_id', $user->id)
            ->pluck('event_id')
            ->unique()
            ->values();

        return response()->json([
            'donated_event_ids' => $donatedEventIds
        ]);
    }
}
