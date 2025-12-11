<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Models\Donation;
use ImageKit\ImageKit;

class EventController extends Controller
{
    protected $imageKit;

    public function __construct()
    {
        $this->imageKit = new ImageKit(
            env('IMAGEKIT_PUBLIC_KEY'),
            env('IMAGEKIT_PRIVATE_KEY'),
            env('IMAGEKIT_URL_ENDPOINT')
        );
    }

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

                // Return clean ImageKit URL
                $event->image_url = $event->image;

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

                // Return clean ImageKit URL
                $event->image_url = $event->image;

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
            $file = $request->file('image');

            $upload = $this->imageKit->upload([
                'file' => fopen($file->getRealPath(), 'r'),
                'fileName' => time() . '_' . $file->getClientOriginalName(),
                'folder' => '/events'
            ]);

            // Store ImageKit URL ONLY
            $validated['image'] = $upload->result->url;
        }

        $event = Event::create($validated);
        $event->image_url = $event->image;

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
            $file = $request->file('image');

            $upload = $this->imageKit->upload([
                'file' => fopen($file->getRealPath(), 'r'),
                'fileName' => time() . '_' . $file->getClientOriginalName(),
                'folder' => '/events'
            ]);

            // Store ImageKit URL ONLY
            $validated['image'] = $upload->result->url;
        }

        $event->update($validated);
        $event->image_url = $event->image;

        return response()->json([
            'message' => 'Event updated successfully',
            'event' => $event
        ]);
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }
}
