<?php

namespace Database\Factories;

use App\Models\Order_Details;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order_Details>
 */
class Order_DetailsFactory extends Factory
{
    protected $model = Order_Details::class;

    public function definition(): array
    {
        // Note: The actual values will be set in the OrderFactory's afterCreating method.
        return [
            // blank for now 
        ];
    }
}
