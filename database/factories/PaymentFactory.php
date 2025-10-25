<?php

namespace Database\Factories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        // Note: The actual values will be set in the OrderFactory's afterCreating method.
        return [
            // blank for now 
        ];
    }
}
