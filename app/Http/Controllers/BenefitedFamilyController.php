<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BenefitedFamily;
use App\Models\Event;

class BenefitedFamilyController extends Controller
{
    // List all families
    public function index()
    {
        $families = BenefitedFamily::with('event')->latest()->get();
        return response()->json([
            'success' => true,
            'families' => $families
        ]);
    }

    // Store a new family
    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'rep_name' => 'required|string|max:255',
            'members' => 'required|integer|min:1',
            'occupation' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:50',
        ]);

        $family = BenefitedFamily::create($validated);

        // Load event relation
        $family->load('event');

        return response()->json([
            'success' => true,
            'family' => $family
        ]);
    }
}

