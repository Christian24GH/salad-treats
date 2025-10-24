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

<<<<<<< HEAD
        User::factory(10)->create([
            'role' => 'customer',
            'password' => bcrypt('12345678'),
        ]);

        Order::factory(50)->create();
        Inventory::factory(100)->create();
        Product::factory(10)->create();
=======
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
>>>>>>> 5d35d11d510550b56319823741fc9de0e00bad9c
    }
}
