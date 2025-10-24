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
        $delivery = Delivery::where('delivery_person_id', $user)
            ->with('order.orderDetails.product')
            ->with('order.payment')
            ->get();
        return inertia('delivery/deliveries', [
            'deliveries' => $delivery
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
        return inertia('delivery/delivery_details', [
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

    public function payment_received(Request $request, $delivery_id){
        $this->authorize('Delivery');
        $user = Auth::id();
        $delivery = Delivery::where('delivery_person_id', $user)
            ->where('id', $delivery_id)
            ->with('order.payment')
            ->firstOrFail();

        $delivery->order->payment->payment_status = 'Paid';
        $delivery->order->payment->save();

        return redirect()->route('delivery.details', ['delivery_id' => $delivery_id])
            ->with('success', 'Payment status updated to Paid.');
    }
}
