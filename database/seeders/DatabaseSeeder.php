<?php

namespace Database\Seeders;

use App\Models\Inventory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\Product;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

       /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);*/

        Product::factory(15)->create();
        User::create([
            'name' => 'Christian',
            'email' => 'loquezchristian@gmail.com',
            'role'  => 'Customer',
            'password' => '12345678',
            'email_verified_at' => now(),
        ]);
        User::create([
            'name' => 'Owner',
            'email' => 'owner@gmail.com',
            'role'  => 'Owner',
            'password' => '12345678',
            'email_verified_at' => now(),
        ]);
        User::create([
            'name' => 'Delivery',
            'email' => 'delivery@gmail.com',
            'role'  => 'Delivery',
            'password' => '12345678',
            'email_verified_at' => now(),
        ]);
    }
}
