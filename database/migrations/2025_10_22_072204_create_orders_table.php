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
                'Packaged',
                'Preparing',
                'On Delivery',
                'Delivered'
            ])->default('Pending')->index();

            $table->text('cancellation_reason')->nullable();
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
            $table->decimal('subtotal', 10, 2);
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

            // Payment details
            $table->decimal('total_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2);
            $table->enum('payment_method', ['Cash on Delivery', 'GCash']);
            $table->enum('payment_status', ['Pending', 'Completed', 'Failed', 'Partial'])->default('Pending');

            // PayMongo-specific fields
            $table->string('provider_reference_id')->nullable(); // PayMongo payment ID
            $table->string('client_key')->nullable();
            $table->string('checkout_url')->nullable(); // Redirect link for PayMongo checkout
            $table->string('receipt_url')->nullable(); // Optional, PayMongo receipt link
            $table->json('payment_details')->nullable(); // store entire PayMongo response

            $table->text('remarks')->nullable();
            $table->timestamps();
        });

        /**
         * FEEDBACK TABLE
         */
        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('order_id')->nullable()->constrained('orders')->nullOnDelete();
            
            $table->string('customer_name');
            $table->integer('rating')->unsigned()->default(5);
            $table->text('comment')->nullable();
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
        Schema::dropIfExists('feedbacks');
    }
};
