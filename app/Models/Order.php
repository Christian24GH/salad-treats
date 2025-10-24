<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;   
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'orders';

    protected $fillable = [
        'user_id',
        'order_uuid',
        'order_date',
        'order_time',
        'total_price',
        'status',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function orders_details()
    {
        return $this->hasMany(Order_Details::class, 'order_uuid', 'order_uuid');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            Log::info('Order boot creating event fired');
            if (empty($order->order_id)) {
                $order->order_id = self::generateUniqueString();
            }
        });
    }


    protected static function generateUniqueString(): string
    {
        do {
            $string = Str::upper(Str::random(12, false, true));
        } while (self::where('order_id', $string)->exists());

        return $string;
    }
}
