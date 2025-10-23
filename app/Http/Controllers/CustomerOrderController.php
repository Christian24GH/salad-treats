<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CustomerOrderController extends Controller
{
    public function orders(){
        $this->authorize('Customer');
        return inertia('customer/orders');
    }

    public function create_order(){
        $this->authorize('Customer');
        $products = Product::get();
        return inertia('customer/create-order', [
            'products' => $products
        ]);
    }

    public function place_order(Request $request){
        // should accept
        $this->authorize('Customer');
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'contact_number' => [
                'required',
                'regex:/^[0-9]+$/',
                'min:11',
                'max:11'
            ],
            'delivery_address' => 'required|string|max:500',
            'delivery_time' => 'required|date',
            'delivery_instructions' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.instructions' => 'nullable|string|max:255',
            'items.*.extras' => 'nullable|array',
            'items.*.extras.*.product_id' => 'required|integer|exists:products,id',
            'items.*.extras.*.quantity' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();
        try {
            

            DB::commit();

            return response()->json(['message' => 'Order placed successfully'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error placing order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
