<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    protected $table = 'order_details';
    protected $primaryKey = 'id';

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'subtotal',
        'instructions',
    ];

    /**
     * Each order detail belongs to one order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Each order detail belongs to one product.
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}