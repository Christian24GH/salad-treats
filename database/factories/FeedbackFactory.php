<?php

namespace Database\Factories;

use App\Models\Feedback;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Feedback>
 */
class FeedbackFactory extends Factory
{
    protected $model = Feedback::class;

    public function definition(): array
    {
        // Note: The actual values will be set in the FeedbackFactory's afterCreating method.
        return [
            // blank for now 
        ];
    }
}
