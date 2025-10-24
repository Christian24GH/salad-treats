<?php

namespace Database\Factories;

use App\Models\Order_Details;
<<<<<<< HEAD
=======
use App\Models\Product;
>>>>>>> master
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order_Details>
 */
class Order_DetailsFactory extends Factory
{
    protected $model = Order_Details::class;

    public function definition(): array
    {
<<<<<<< HEAD
        return [
            'quantity' => fake()->numberBetween(1, 10),
            'price' => fake()->randomFloat(2, 5, 100),
        ];
    }
}
=======
        // Note: The actual values will be set in the OrderFactory's afterCreating method.
        return [
            // blank for now 
        ];
    }
}
>>>>>>> master
