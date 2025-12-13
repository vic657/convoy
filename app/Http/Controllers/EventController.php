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
        $mapEvent = function ($event) {
            $totalDonations = Donation::where('event_id', $event->id)->sum('amount');

            $event->total_donations = $totalDonations;
            $event->progress = $event->target_amount > 0
                ? round(($totalDonations / $event->target_amount) * 100, 2)
                : 0;

            // Always return ImageKit URL
            $event->image_url = $event->image;

            return $event;
        };

        return response()->json([
            'upcoming' => Event::where('date', '>=', now())
                ->orderBy('date', 'asc')
                ->get()
                ->map($mapEvent),

            'past' => Event::where('date', '<', now())
                ->orderBy('date', 'desc')
                ->get()
                ->map($mapEvent),
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
            'image' => 'sometimes|nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadImage($request->file('image'));
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
            'image' => 'sometimes|nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadImage($request->file('image'));
        } else {
            unset($validated['image']); // 🔐 protect old image
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

    private function uploadImage($file)
    {
        $upload = $this->imageKit->upload([
            'file' => fopen($file->getRealPath(), 'r'),
            'fileName' => time() . '_' . $file->getClientOriginalName(),
            'folder' => '/events'
        ]);

        return $upload->result->url;
    }
}
