<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'date',
        'venue',
        'target_amount',
        'audience',
        'description',
        'image',
    ];

    // Accessor for full image URL
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? url('storage/' . $this->image) : null;
    }
    public function donations()
{
    return $this->hasMany(Donation::class, 'event_id');
}

}
