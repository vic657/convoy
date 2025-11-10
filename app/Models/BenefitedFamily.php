<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BenefitedFamily extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'rep_name',
        'members',
        'occupation',
        'address',
        'contact',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}

