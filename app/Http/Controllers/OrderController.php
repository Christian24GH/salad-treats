<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    public function orders()
    {
        $this->authorize('Owner');
        $orders = Order::with(['orderDetails.product', 'payment'])
            ->where('orders.status', 'Pending')
            ->get();
        return inertia('owner/orders', [
            'orders' => $orders,
        ]);
    }

    public function order_details($order_id)
    {
        $this->authorize('Owner');
        $order = Order::with(['user', 'orderDetails.product', 'payment', 'delivery'])
            ->findOrFail($order_id);
        return inertia('owner/order-details', [
            'order' => $order
        ]);
    }


    public function approve_order(Request $request)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'order_uuid' => ['required', 'exists:orders,order_uuid'],
        ]);

        DB::transaction(function () use ($validated) {
            $order = Order::where('order_uuid', $validated['order_uuid'])->firstOrFail();

            
            $order->update([
                'status' => 'Accepted',
                'updated_at' => now(),
            ]);
        });

        return response()->json(['message' => 'Order approved successfully.'], 200);
    }

    public function reject_order(Request $request)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'order_uuid'  => ['required', 'exists:orders,order_uuid'],
            'notes'       => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($validated) {
            $order = Order::where('order_uuid', $validated['order_uuid'])->firstOrFail();

            
            $order->update([
                'status' => 'Rejected',
                'updated_at' => now(),
            ]);

            
            if ($order->payment) {
                $order->payment->update([
                    'remarks' => 'Order rejected: ' . $validated['notes'],
                ]);
            }
        });

        return response()->json(['message' => 'Order rejected successfully.'], 200);
    }

    

}
