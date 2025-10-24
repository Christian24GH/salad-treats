<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    protected $table = 'address';

    protected $fillable = [
        'user_id',
        'house_no',
        'street',
        'barangay',
        'city',
        'region',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected $appends = ['full_address'];

    public function getFullAddressAttribute()
    {
        return "{$this->house_no} {$this->street}, {$this->barangay}, {$this->city}, {$this->region}";
    }
}