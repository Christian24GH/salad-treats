<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerFeedbackController extends Controller
{
    public function feedback(){
        $this->authorize('Customer');
        $user = Auth::id();
        $feedback = Feedback::where('user_id', $user)->with('order')->get();
        return inertia('customer/feedback', [
            'feedback' => $feedback
        ]);
    }

    public function write_feedback(){
        $this->authorize('Customer');
        $orders = Order::where('user_id', Auth::id())->where('status', 'Delivered')->get();
        return inertia('customer/feedback-write', [
            'order' => $orders,
        ]);
    }

    public function store_feedback(Request $request){
        $this->authorize('Customer');
        $request->validate([
            'order_id' => ['nullable', 'exists:orders,id'],
            'user_id' => ['required', 'exists:users,id'],
            'customer_name' => ['required', 'exists:users,name'],
            'rating' => ['required', 'numeric', 'min:0'],
            'comment' => ['required', 'min:0'],
        ]);
        try {
            Feedback::create([
                'order_id' => $request['order_id'],
                'user_id'  => $request['user_id'],
                'customer_name'  => $request['customer_name'],
                'rating'  => $request['rating'],
                'comment'  => $request['comment'],
            ]);

            return response()->json(['message' => 'Feedback Added'], 201);
        }catch (Exception $e){
            return response()->json(['message' => 'Feedback Failed'], 500);
        }
    }
}
