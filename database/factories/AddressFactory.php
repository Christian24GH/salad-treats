<?php

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    public function definition(): array
    {
        return [
            'house_no' => fake()->buildingNumber(),
            'street' => fake()->streetName(),
            'barangay' => fake()->citySuffix(),
            'city' => fake()->city(),
            'region' => fake()->state(),
        ];
    }
}