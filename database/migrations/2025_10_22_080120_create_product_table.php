<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product', function (Blueprint $table) {
            $table->id();
            $table->string('product_name');
            $table->text('description');
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });

        Schema::create('inventory', function (Blueprint $table) {
            $table->id();
            $table->string('item_name');
            $table->decimal('amount', 10, 2);
            $table->string('unit');
            $table->timestamps();
        });

        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('product')->cascadeOnDelete();
            $table->foreignId('item_id')->constrained('inventory')->cascadeOnDelete();
            $table->decimal('quantity', 10, 2);
            $table->timestamps();
        });

        Schema::table('order_details', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained('product')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('ingredients');

        Schema::table('order_details', function (Blueprint $table) {
            $table->dropForeign(['product_id']);
            $table->dropColumn('product_id');
        });
    }
};
