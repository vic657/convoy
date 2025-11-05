<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use Illuminate\Support\Facades\Storage;
use App\Models\Donation;

class EventController extends Controller
{
    public function index()
{
    $upcoming = Event::where('date', '>=', now())
        ->orderBy('date', 'asc')
        ->get()
        ->map(function ($event) {
            $totalDonations = Donation::where('event_id', $event->id)->sum('amount');
            $event->total_donations = $totalDonations;
            $event->progress = $event->target_amount > 0
                ? round(($totalDonations / $event->target_amount) * 100, 2)
                : 0;
            return $event;
        });

    $past = Event::where('date', '<', now())
        ->orderBy('date', 'desc')
        ->get()
        ->map(function ($event) {
            $totalDonations = Donation::where('event_id', $event->id)->sum('amount');
            $event->total_donations = $totalDonations;
            $event->progress = $event->target_amount > 0
                ? round(($totalDonations / $event->target_amount) * 100, 2)
                : 0;
            return $event;
        });

    return response()->json([
        'upcoming' => $upcoming,
        'past' => $past,
    ]);
}


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'venue' => 'required|string|max:255',
            'target_amount' => 'nullable|numeric',
            'audience' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = $path;
        }

        $event = Event::create($validated);

        return response()->json([
            'message' => 'Event created successfully',
            'event' => $event
        ]);
    }

    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'date' => 'required|date',
            'venue' => 'required|string|max:255',
            'target_amount' => 'nullable|numeric',
            'audience' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($event->image && Storage::disk('public')->exists($event->image)) {
                Storage::disk('public')->delete($event->image);
            }
            $path = $request->file('image')->store('events', 'public');
            $validated['image'] = $path;
        }

        $event->update($validated);

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        if ($event->image && Storage::disk('public')->exists($event->image)) {
            Storage::disk('public')->delete($event->image);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
    
}

