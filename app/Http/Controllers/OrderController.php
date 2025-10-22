<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function orders()
    {
        $this->authorize('Owner');
        return inertia('owner/orders');
    }

    public function order_details($uuid)
    {
        $this->authorize('Owner');
        return inertia('owner/order-details');
    }
}
