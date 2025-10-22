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

    public function approve_order(Request $request)
    {
        $this->authorize('Owner');
        /*
        $validation = $request->validate([
            'uuid'  => ['required'],
        ]);*/
        // Logic to accept the order and move it to tracker
        return response()->json(['message' => 'Order accepted and moved to tracker'], 200);
    }

    public function reject_order(Request $request)
    {
        $this->authorize('Owner');
        /*
        $validation = $request->validate([
            'uuid'  => ['required'],
            'notes' => ['required']
        ]);*/

        // add business logic here
        return response()->json(['message' => 'Order denied'], 200);
    }
}
