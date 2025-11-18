<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\Event;
use App\Models\Beneficiary;
use Illuminate\Http\Request;

class AdminDonationController extends Controller
{
    // ✅ Summary of all donations (cash + noncash)
    public function summary()
    {
        $events = Event::with(['donations' => function($q) {
            $q->select('id', 'event_id', 'type', 'amount', 'status', 'item_name', 'quantity', 'unit', 'condition');
        }])->get();

        $summary = $events->map(function ($event) {
            $cashTotal = $event->donations->where('type', 'cash')->sum('amount');
            $nonCashTotal = $event->donations->where('type', 'non-cash')->count();

            return [
                'event_id' => $event->id,
                'title' => $event->title,
                'date' => $event->date,
                'venue' => $event->venue,
                'target_amount' => $event->target_amount,
                'cash_total' => $cashTotal,
                'non_cash_total' => $nonCashTotal,
                'progress' => $event->target_amount ? round(($cashTotal / $event->target_amount) * 100, 2) : 0,
            ];
        });

        return response()->json($summary);
    }

    // ✅ View donors for a specific event
    public function eventDonors($eventId)
    {
        $donations = Donation::with('user')
            ->where('event_id', $eventId)
            ->get(['id', 'user_id', 'type', 'amount', 'item_name', 'quantity', 'unit', 'status', 'created_at']);

        return response()->json($donations);
    }

    // ✅ View beneficiaries for an event
    public function eventBeneficiaries($eventId)
    {
        $beneficiaries = Beneficiary::where('event_id', $eventId)->get();
        return response()->json($beneficiaries);
    }
}
