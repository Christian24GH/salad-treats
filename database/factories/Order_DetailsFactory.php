<?php

namespace Database\Factories;

use App\Models\Order_Details;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order_Details>
 */
class Order_DetailsFactory extends Factory
{
    protected $model = Order_Details::class;

    public function definition(): array
    {
        return [
            'quantity' => fake()->numberBetween(1, 10),
            'price' => fake()->randomFloat(2, 5, 100),
        ];
    }
}