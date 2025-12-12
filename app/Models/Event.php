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
    if (!$this->image) {
        return null;
    }

    // If already a full URL (ImageKit), return as-is
    if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
        return $this->image;
    }

    // Otherwise treat as local storage
    return url('storage/' . $this->image);
}

    public function donations()
{
    return $this->hasMany(Donation::class, 'event_id');
}

}
