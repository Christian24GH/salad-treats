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
<<<<<<< HEAD
            'quantity' => fake()->numberBetween(1, 10),
=======
            'quantity' => fake()->randomFloat(2, 1, 20),
>>>>>>> master
        ];
    }
}