<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Order_Details;
use App\Models\Product;
use Illuminate\Support\Str;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->value('id') ?? User::factory(),
            'order_uuid' => Str::upper(Str::random(12, false, true)),
            'order_date' => fake()->date(),
            'order_time' => fake()->time(),
            'total_price' => fake()->randomFloat(2, 20, 500),
            'status' => fake()->randomElement(['pending', 'on delivery', 'delivered']),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $items = fake()->numberBetween(2, 6);
            for ($i = 1; $i <= $items; $i++) {
                Order_Details::factory()->create([
                    'order_uuid' => $order->order_uuid,
                    'quantity' => fake()->numberBetween(1, 10),
                    'price' => fake()->randomFloat(2, 5, 100),
                    'product_id' => Product::inRandomOrder()->value('id') ?? Product::factory(),
                ]);
            }
        });
    }
}