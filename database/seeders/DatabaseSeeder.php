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

        Order::factory(50)->create();
        Inventory::factory(100)->create();
        Product::factory(10)->create();
    }
}
