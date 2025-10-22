<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $this->authorize('Owner');
        $products = Product::get();
        return inertia('owner/menu', [
            'products' => $products
        ]);
    }

    public function show()
    {
        $this->authorize('Owner');
        return inertia('owner/menu-details');
    }

    public function create()
    {
        $this->authorize('Owner');
        return inertia('owner/create-product');
    }

    public function store(Request $request)
    {
        $this->authorize('Owner');
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'production_price' => 'required|numeric',
            'product_picture' => 'required|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // store the uploaded image file in storage/app/public/products
        $path = $request->file('product_picture')->store('products', 'public');

        // Save using the Product model
        Product::create([
            'product_name' => $request->product_name,
            'description' => $request->product_description,
            'price' => $request->production_price,
            'image_path' => $path,
        ]);

        return response()->json('Product successfully created', 200);
    }

    public function remove()
    {
        $this->authorize('Owner');

        return response()->json('Product deleted', 200);
    }
}
