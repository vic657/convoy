<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Donation;
use Illuminate\Support\Facades\Auth;

class DonationController extends Controller
{
    // ==========================
    // Store Donation
    // ==========================
    public function store(Request $request)
    {
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

        // Validate money donation
        if ($validated['type'] === 'money' && empty($validated['amount'])) {
            return response()->json(['message' => 'Amount is required for money donations'], 422);
        }

        $user = Auth::user();

        $donation = Donation::create([
            'user_id' => $user?->id,
            'event_id' => $validated['event_id'],
            'donor_name' => $user?->name ?? $request->input('donor_name', 'Anonymous Donor'),
            'email' => $user?->email ?? $request->input('email', null),
            'type' => $validated['type'],
            'amount' => $validated['amount'] ?? null,
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

    // ==========================
    // All Donations (Public)
    // ==========================
    public function index()
{
    $donations = Donation::with('event:id,title,date,venue,target_amount')
        ->latest()
        ->get()
        ->map(fn($d) => [
            'id' => $d->id,
            'donor_name' => $d->donor_name,
            'email' => $d->email,
            'type' => $d->type,
            'amount' => $d->amount,
            'item_category' => $d->item_category,
            'item_description' => $d->item_description,
            'pickup_location' => $d->pickup_location,
            'contact' => $d->contact,
            'payment_method' => $d->payment_method,
            'message' => $d->message,
            'status' => $d->status, // ✅ include status here
            'item_name' => $d->item_name,
            'quantity' => $d->quantity,
            'unit' => $d->unit,
            'condition' => $d->condition,
            'remarks' => $d->remarks,
            'event' => [
                'id' => $d->event?->id,
                'title' => $d->event?->title,
                'date' => $d->event?->date,
                'venue' => $d->event?->venue,
                'target_amount' => $d->event?->target_amount,
            ],
            'created_at' => $d->created_at->format('Y-m-d H:i'),
        ]);

    return response()->json([
        'success' => true,
        'donations' => $donations
    ]);
}



    // ==========================
    // Donations for Specific Event
    // ==========================
    public function showByEvent($eventId)
    {
        $donations = Donation::where('event_id', $eventId)
            ->with('event:id,title,date,venue')
            ->latest()
            ->get()
            ->map(fn($d) => [
                'id' => $d->id,
                'donor_name' => $d->donor_name,
                'type' => $d->type,
                'amount' => $d->amount,
                'item_category' => $d->item_category,
                'item_description' => $d->item_description,
                'pickup_location' => $d->pickup_location,
                'contact' => $d->contact,
                'payment_method' => $d->payment_method,
                'message' => $d->message,
                'event' => [
                    'id' => $d->event?->id,
                    'title' => $d->event?->title,
                    'date' => $d->event?->date,
                    'venue' => $d->event?->venue,
                ],
                'created_at' => $d->created_at->format('Y-m-d H:i'),
            ]);

        return response()->json([
            'success' => true,
            'donations' => $donations
        ]);
    }

    // ==========================
    // Logged-in User Donations
    // ==========================
    public function userDonations()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Not authenticated'], 401);
        }

        $donations = Donation::with('event:id,title,date,venue')
            ->where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(fn($d) => [
                'id' => $d->id,
                'type' => $d->type,
                'amount' => $d->amount,
                'item_category' => $d->item_category,
                'item_description' => $d->item_description,
                'payment_method' => $d->payment_method,
                'event' => [
                    'id' => $d->event?->id,
                    'title' => $d->event?->title,
                    'date' => $d->event?->date,
                    'venue' => $d->event?->venue,
                ],
                'created_at' => $d->created_at->format('Y-m-d H:i'),
            ]);

        return response()->json([
            'success' => true,
            'donations' => $donations
        ]);
    }
public function updateStatus(Request $request, $id)
{
    $donation = Donation::findOrFail($id);

    // Only apply to non-cash donations
    if ($donation->type === 'money') {
        return response()->json(['message' => 'Cannot update cash donations.'], 400);
    }

    // Validate input
    $validated = $request->validate([
        'status' => 'required|string|in:received,pending',
        'item_name' => 'nullable|string|max:255',
        'quantity' => 'nullable|numeric',
        'unit' => 'nullable|string|max:50',
        'condition' => 'nullable|string|max:100',
        'remarks' => 'nullable|string|max:500',
    ]);

    // Update record
    $donation->update($validated);

    return response()->json([
        'message' => 'Donation status updated successfully.',
        'donation' => $donation
    ]);
}

}
