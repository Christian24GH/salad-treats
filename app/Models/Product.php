<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $table = 'product';

    protected $fillable = [
        'product_name',
        'description',
        'price',
        'image_path',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    // Add accessor for full image URL
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image_path 
            ? Storage::url($this->image_path) 
            : asset('images/default-product.png'); // fallback image
    }
}