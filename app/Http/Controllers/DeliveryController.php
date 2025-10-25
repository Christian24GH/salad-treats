<?php

namespace App\Http\Controllers;

use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DeliveryController extends Controller
{
    public function deliveries(){
        $this->authorize('Delivery');
        $user = Auth::id();

        $deliveries = Delivery::where('delivery_person_id', $user)
            ->whereIn('status', ['Pending', 'In Progress'])
            ->with([
                'order.orderDetails.product',
                'order.payment'
            ])
            ->get();

        return inertia('delivery/deliveries', [
            'deliveries' => $deliveries
        ]);
    }

    public function delivery_details($delivery_id){
        $this->authorize('Delivery');
        $user = Auth::id();
        $delivery = Delivery::where('delivery_person_id', $user)
            ->where('id', $delivery_id)
            ->with('order.orderDetails.product')
            ->with('order.payment')
            ->firstOrFail();
        return inertia('delivery/details', [
            'delivery' => $delivery
        ]);
    }

    public function update_status(Request $request, $delivery_id){
        $this->authorize('Delivery');
        $user = Auth::id();
        $delivery = Delivery::where('delivery_person_id', $user)
            ->where('id', $delivery_id)
            ->firstOrFail();

        $request->validate([
            'status' => 'required|string|in:Pending,Out for Delivery,Delivered,Cancelled',
        ]);

        $delivery->status = $request->input('status');
        $delivery->save();

        return redirect()->route('delivery.details', ['delivery_id' => $delivery_id])
            ->with('success', 'Delivery status updated successfully.');
    }

    // mark payment_status as Completed, order as Delivered

    //for gcash,
    // Mark as Delivered for GCash
    public function order_delivered(Request $request, $delivery_id)
    {
        $this->authorize('Delivery');

        $user = Auth::id();

        $delivery = Delivery::where('delivery_person_id', $user)
            ->where('id', $delivery_id)
            ->with('order.payment')
            ->firstOrFail();

        $order = $delivery->order;

        if ($order->payment->payment_method !== 'GCash') {
            return back()->with('error', 'This order is not a GCash payment.');
        }

        // Mark order as delivered
        $delivery->status = 'Completed';
        $delivery->save();

        $order->update(['status' => 'Delivered']);

        return back()->with('success', 'Order marked as delivered successfully.');
    }



    // Mark as Paid and Delivered for COD
    public function order_delivered_paid(Request $request, $delivery_id)
    {
        $this->authorize('Delivery');

        $user = Auth::id();

        $delivery = Delivery::where('delivery_person_id', $user)
            ->where('id', $delivery_id)
            ->with('order.payment')
            ->firstOrFail();

        $order = $delivery->order;

        if ($order->payment->payment_method !== 'Cash on Delivery') {
            return back()->with('error', 'This order is not Cash on Delivery.');
        }

        // Mark as paid & delivered
        $delivery->status = 'Completed';
        $delivery->save();

        $order->update(['status' => 'Delivered']);
        $order->payment->update(['payment_status' => 'Completed']);

        return back()->with('success', 'Order marked as paid and delivered successfully.');
    }
}
