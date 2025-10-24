<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_uuid', 12)->unique();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('order_date');
            $table->time('order_time');
            $table->timestamps();
            $table->decimal('total_price', 10, 2);
            $table->enum('payment_method', ['online', 'cash'])->default('cash')->index();
            $table->enum('status', ['pending', 'on delivery', 'delivered'])->default('pending')->index();
            $table->softDeletes();
        });

        Schema::create('orders_details', function (Blueprint $table) {
            $table->id();
            $table->string('order_uuid', 12);
            $table->foreign('order_uuid')->references('order_uuid')->on('orders')->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('orders_details');
    }
};
