<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    public function orders()
    {
        $this->authorize('Owner');

        $orders = Order::with('user.address')->orderByDesc('created_at')->get();
        return inertia('owner/orders', [
            'orders' => $orders
        ]);
    }


    public function order_details($order_uuid)
    {
        $this->authorize('Owner');

        $order = Order::with(['user.address', 'order_details.product'])->where('order_uuid', $order_uuid)->firstOrFail();
        return inertia('owner/order-details', [
            'order' => $order
        ]);
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
        
        $validation = $request->validate([
            'uuid'  => ['required'],
            'notes' => ['required']
        ]);
        // add business logic here
        return response()->json(['message' => 'Order denied'], 200);
    }
}
