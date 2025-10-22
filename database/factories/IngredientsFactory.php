<?php

namespace Database\Factories;

use App\Models\Ingredients;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ingredients>
 */
class IngredientsFactory extends Factory
{
    protected $model = Ingredients::class;

    public function definition(): array
    {
        return [
            'quantity' => fake()->numberBetween(1, 10),
        ];
    }
}