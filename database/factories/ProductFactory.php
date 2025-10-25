<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    protected $defaultImage = 'products/default.jpg';

    public function definition(): array
    {
        $types = ['Salad', 'Rolls', 'Platter', 'Extras'];

        return [
            'product_name' => $this->faker->words(2, true),
            'description' => $this->faker->sentence(),
            'price' => 20,
            'image_path' => $this->defaultImage,
            'type' => $this->faker->randomElement($types),
        ];
    }
}
