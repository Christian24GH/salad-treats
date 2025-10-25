<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Product;

use Illuminate\Http\Request;

class LandingController extends Controller
{
    public function index()
    {
        return Inertia::render('landing');
    }

    public function menu()
    {
        $products = Product::get();
        return inertia::render('menu', [
            'product' => $products
        ]);
    }
}
