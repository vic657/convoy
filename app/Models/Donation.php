<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'event_id',
        'donor_name',
        'email',
        'type', // ✅ added
        'amount',
        'item_category', // ✅ added
        'item_description', // ✅ added
        'pickup_location', // ✅ added
        'contact', // ✅ added
        'payment_method',
        'transaction_id',
        'message',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted()
    {
        static::addGlobalScope('latest', function ($query) {
            $query->latest();
        });
    }
}
