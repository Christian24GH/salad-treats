<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table = "payments";

    protected $fillable = [
        'order_id',
        'total_amount',
        'paid_amount',
        'payment_method',
        'payment_status',
        'provider_reference_id',
        'checkout_url',
        'receipt_url',
        'client_key',
        'payment_details',
        'remarks'
    ];

    protected $casts = [
        'payment_details' => 'array',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
    ];

    // Relationship to Order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Helper methods
    public function markAsCompleted($amountPaid)
    {
        $this->update([
            'paid_amount' => $amountPaid,
            'payment_status' => 'Completed'
        ]);
    }

    public function markAsPartial($amountPaid)
    {
        $this->update([
            'paid_amount' => $amountPaid,
            'payment_status' => 'Partial'
        ]);
    }

    public function markAsFailed($remarks)
    {
        $this->update([
            'remarks' => $remarks,
            'payment_status' => 'Failed'
        ]);
    }
}
