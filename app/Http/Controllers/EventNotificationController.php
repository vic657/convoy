<?php

namespace App\Http\Controllers;

use App\Models\Donation;

class EventNotificationController extends Controller
{
    public function index()
    {
        return Donation::with('event')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($donation) {
                return [
                    'user_name' => $donation->user_name ?? 'Anonymous',
                    'event_title' => $donation->event->title ?? 'Unknown Event',
                    'created_at' => $donation->created_at->diffForHumans(),
                ];
            });
    }
}
