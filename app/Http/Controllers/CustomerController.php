<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function dashboard()
    {
        $this->authorize('Customer');
        return inertia('customer/dashboard');
    }

    public function orders(){
        $this->authorize('Customer');
        return inertia('customer/orders');
    }
}
