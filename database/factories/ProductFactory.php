<?php

namespace Database\Factories;

use App\Models\Ingredients;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Inventory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'product_name' => fake()->word(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 5, 100),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Product $product) {
            $items = fake()->numberBetween(2, 6);
            for ($i = 1; $i <= $items; $i++) {
                Ingredients::factory()->create([
                    'product_id' => $product->id,
                    'item_id' => Inventory::inRandomOrder()->value('id') ?? Inventory::factory(),
                    'quantity' => fake()->numberBetween(1, 10),
                ]);
            }
        });
    }
}