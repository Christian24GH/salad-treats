<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerOrderController extends Controller
{
    public function orders(){
        $this->authorize('Customer');
        return inertia('customer/orders');
    }

    public function create_order(){
        $this->authorize('Customer');
        $products = Product::get();
        return inertia('customer/create-order', [
            'products' => $products
        ]);
    }
}
