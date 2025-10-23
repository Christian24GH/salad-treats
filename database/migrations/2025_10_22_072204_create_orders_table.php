<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        /**
         * PRODUCTS TABLE
         */
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('image_path')->nullable();
            $table->enum('type', ['Salad', 'Rolls', 'Platter', 'Extras']);
            $table->timestamps();
        });

        /**
         * ORDERS TABLE
         */
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->uuid('order_uuid')->unique()->index();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

            $table->string('customer_name');
            $table->string('contact_number');
            $table->string('delivery_address');
            $table->dateTime('delivery_time');
            $table->text('delivery_instructions')->nullable();

            $table->decimal('total_price', 10, 2);
            $table->enum('status', [
                'Pending',
                'Cancelled',
                'Rejected',
                'Accepted',
                'On Delivery',
                'Delivered'
            ])->default('Pending')->index();

            $table->timestamps();
            $table->softDeletes();
        });

        /**
         * ORDER DETAILS TABLE
         */
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('quantity')->default(1);
            $table->decimal('price', 10, 2); // snapshot of product price
            $table->text('instructions')->nullable();
            $table->timestamps();
        });

        /**
         * DELIVERIES TABLE (for delivery personnel)
         */
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->foreignId('delivery_person_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['Pending', 'In Progress', 'Completed', 'Failed'])->default('Pending');
            $table->timestamps();
        });

        /**
         * PAYMENTS TABLE
         */
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['Cash on Delivery', 'Online Payment']);
            $table->enum('payment_status', ['Pending', 'Completed', 'Failed'])->default('Pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop in reverse order to avoid foreign key constraint errors
        Schema::dropIfExists('payments');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('order_details');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
    }
};
