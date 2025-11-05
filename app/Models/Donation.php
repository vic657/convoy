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
        'type', 
        'amount',
        'item_category', 
        'item_description', 
        'pickup_location', 
        'contact', 
        'payment_method',
        'transaction_id',
        'message',
        'type',
    'status',
    'item_name',
    'quantity',
    'unit',
    'condition',
    'remarks',
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
