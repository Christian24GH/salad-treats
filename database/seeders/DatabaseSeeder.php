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

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role' => 'owner',
            'password' => bcrypt('12345678'),
        ]);

        User::factory(10)->create([
            'role' => 'customer',
            'password' => bcrypt('12345678'),
        ]);

        
        User::create([
            'name' => 'Delivery',
            'email' => 'delivery@gmail.com',
            'role'  => 'Delivery',
            'password' => '12345678',
            'email_verified_at' => now(),
        ]);

        Product::factory(20)->create();
        Order::factory(25)->create();
    }
}
