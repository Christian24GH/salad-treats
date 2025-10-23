<?php

namespace Database\Factories;

use App\Models\Inventory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inventory>
 */
class InventoryFactory extends Factory
{
    protected $model = Inventory::class;

    public function definition(): array
    {
        return [
            'item_name' => fake()->word(),
            'amount' => fake()->numberBetween(1, 100),
            'unit' => fake()->randomElement(['kg', 'g', 'liters']),
        ];
    }
}