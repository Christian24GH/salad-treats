<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;   

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';
    protected $primaryKey = 'id';

    protected $fillable = [
        'order_uuid',
        'user_id',
        'customer_name',
        'contact_number',
        'delivery_address',
        'delivery_time',
        'delivery_instructions',
        'total_price',
        'status',
    ];

    /**
     * An order belongs to one user (customer).
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * An order can have multiple order details.
     */
    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class, 'order_id');
    }

    /**
     * An order may have one delivery.
     */
    public function delivery()
    {
        return $this->hasOne(Delivery::class, 'order_id');
    }
}
