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

    public function edit($id)
    {
        $this->authorize('Owner');
        $product = Product::find($id);
        return inertia('owner/edit-product', [
            'product' => $product
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->authorize('Owner');
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'product_price' => 'required|numeric|min:20',
            'product_picture' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'product_type' => 'required|in:Salad,Rolls,Platter,Extras',
        ]);

        $product = Product::find($id);
        $product->product_name = $request->product_name;
        $product->description = $request->product_description;
        $product->price = $request->product_price;
        $product->type = $request->product_type;

        // If a new picture is uploaded, handle the file upload
        if ($request->hasFile('product_picture')) {
            $path = $request->file('product_picture')->store('products', 'public');
            $product->image_path = $path;
        }

        $product->save();

        return response()->json('Product successfully updated', 200);
    }

    public function store(Request $request)
    {
        $this->authorize('Owner');
        $request->validate([
            'product_name' => 'required|string|max:255',
            'product_description' => 'required|string',
            'product_price' => 'required|numeric|min:20',
            'product_picture' => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'product_type' => 'required|in:Salad,Rolls,Platter,Extras',
        ]);

        // store the uploaded image file in storage/app/public/products
        $path = $request->file('product_picture')->store('products', 'public');

        // Save using the Product model
        Product::create([
            'product_name' => $request->product_name,
            'description' => $request->product_description,
            'price' => $request->product_price,
            'image_path' => $path,
            'type'  => $request->product_type,
        ]);

        return response()->json('Product successfully created', 200);
    }

    public function remove()
    {
        $this->authorize('Owner');

        return response()->json('Product deleted', 200);
    }
}
