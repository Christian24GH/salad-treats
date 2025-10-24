<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class TrackerController extends Controller
{
    public function tracker()
    {
        $this->authorize('Owner');

        $orders = Order::with(['payment', 'orderDetails', 'user'])
            ->where('orders.status', 'Accepted')
            ->orWhere('orders.status', 'Packaged')
            ->orWhere('orders.status', 'On Delivery')
            ->orWhere('orders.status', 'Delivered')
            ->latest()
            ->get();

        return inertia('owner/tracker', [
            'orders' => $orders,
        ]);
    }

    public function tracker_details($id)
    {
        $this->authorize('Owner');

        $order = Order::with(['payment', 'orderDetails.product', 'user', 'delivery.deliveryPerson'])
            ->findOrFail($id);
            
        $drivers = User::where('role', 'Delivery')->get(['id', 'name']);
        return inertia('owner/tracker-details', [
            'order' => $order,
            'drivers' => $drivers
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:Accepted,Preparing,Packaged,On Delivery,Delivered']
        ]);

        $order = Order::findOrFail($id);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => "Order status updated to {$validated['status']} successfully."
        ], 200);
    }

    public function assignDriver(Request $request, $id)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'assigned_driver' => ['required', 'exists:users,id'],
        ]);

        $order = Order::findOrFail($id);

        
        $delivery = Delivery::updateOrCreate(
            ['order_id' => $order->id],
            [
                'delivery_person_id' => $validated['assigned_driver'],
                'status' => 'Pending'
            ]
        );

        return response()->json([
            'message' => 'Driver assigned successfully.',
            'delivery' => $delivery
        ], 200);
    }

}
