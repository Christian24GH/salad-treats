<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CustomerProductController extends Controller
{
    public function products(){
        $this->authorize('Customer');
        $products = Product::get();
        return inertia('customer/menu', [
            'products' => $products
        ]);
    }

    public function product_details($id){
        $this->authorize('Customer');
        $product = Product::find($id);
        return inertia('customer/product-details', [
            'product' => $product
        ]);
    }
    
}
