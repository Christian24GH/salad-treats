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
            'customer_name' => fake()->name(),
            'contact_number' => fake()->phoneNumber(),
            'delivery_address' => fake()->address(),
            'delivery_time' => fake()->dateTimeBetween('+1 days', '+7 days'),
            'delivery_instructions' => fake()->sentence(),
            'total_price' => 0, // Will be updated
            'status' => fake()->randomElement(['Pending', 'On Delivery', 'Delivered', 'Cancelled', 'Rejected', 'Accepted']),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Order $order) {
            $items = fake()->numberBetween(2, 6);
            for ($i = 1; $i <= $items; $i++) {
                $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
                $quantity = fake()->numberBetween(1, 10);
                $subtotal = $product->price * $quantity;
                $total = 0;

                Order_Details::factory()->create([
                    'order_uuid' => $order->order_uuid,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $order->total_price = $total;
            $order->save();
        });
    }
}