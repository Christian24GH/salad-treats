<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderDetail;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CustomerOrderController extends Controller
{
    public function orders(){
        $this->authorize('Customer');
        $user = Auth::id();
        $orders = Order::where('user_id', $user)
            ->with('orderDetails.product')
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('customer/orders', [
            'orders' => $orders
        ]);
    }

    public function create_order(){
        $this->authorize('Customer');
        $products = Product::get();
        return inertia('customer/create-order', [
            'products' => $products
        ]);
    }

    public function place_order(Request $request)
    {
        // Authorize only customers
        $this->authorize('Customer');

        // Validate input
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
            'payment_method' => 'required|in:Cash on Delivery, GCash',
        ]);

        DB::beginTransaction();
        try {
            
            $order = Order::create([
                'order_uuid' => Str::uuid(),
                'user_id' => Auth::id(),
                'customer_name' => $validated['customer_name'],
                'contact_number' => $validated['contact_number'],
                'delivery_address' => $validated['delivery_address'],
                'delivery_time' => $validated['delivery_time'],
                'delivery_instructions' => $validated['delivery_instructions'] ?? null,
                'total_price' => 0, // placeholder, will update later
                'status' => 'Pending',
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $quantity = $item['quantity'];
                $itemTotal = $product->price * $quantity;
                $total += $itemTotal;

                $orderDetail = OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'instructions' => $item['instructions'] ?? null,
                ]);

    
                if (!empty($item['extras'])) {
                    foreach ($item['extras'] as $extra) {
                        $extraProduct = Product::findOrFail($extra['product_id']);
                        $extraQty = $extra['quantity'];
                        $extraTotal = $extraProduct->price * $extraQty;
                        $total += $extraTotal;

                        OrderDetail::create([
                            'order_id' => $order->id,
                            'product_id' => $extraProduct->id,
                            'quantity' => $extraQty,
                            'price' => $extraProduct->price,
                            'instructions' => 'Extra for product #' . $product->id,
                        ]);
                    }
                }
            }
            
            $order->update(['total_price' => $total]);

            $payment = Payment::create([
                'order_id' => $order->id,
                'amount' => $total,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'Pending',
            ]);
            

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'order_uuid' => $order->order_uuid,
                'total' => $total
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error placing order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function cancel_order($order_uuid)
    {
        $this->authorize('Customer');

        $order = Order::where('order_uuid', $order_uuid)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($order->status !== 'Pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled.'
            ], 400);
        }

        $order->status = 'Cancelled';
        $order->save();
        $order->delete();
        return response()->json([
            'message' => 'Order cancelled successfully.'
        ], 201);
    }
}
