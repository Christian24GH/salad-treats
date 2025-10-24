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
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CustomerOrderController extends Controller
{
    public function orders(){
        $this->authorize('Customer');
        $user = Auth::id();
        $orders = Order::where('user_id', $user)
            ->with('orderDetails.product')
            ->with('payment')
            ->orderBy('created_at', 'desc')
            ->get();
        return inertia('customer/orders', [
            'orders' => $orders
        ]);
    }

    public function order_details($order_id){
        $this->authorize('Customer');
        $user = Auth::id();
        $order = Order::where('user_id', $user)
            ->where('id', $order_id)
            ->with('orderDetails.product')
            ->with('payment')
            ->orderBy('created_at', 'desc')
            ->first();
        return inertia('customer/order-details', [
            'order' => $order
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
        $this->authorize('Customer');

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'contact_number' => ['required', 'regex:/^09\d{9}$/'],
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
            'payment_method' => 'required|in:Cash on Delivery,GCash',
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
                'total_price' => 0,
                'status' => 'Pending',
            ]);

            $total = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $quantity = $item['quantity'];
                $subtotal = $product->price * $quantity;
                $total += $subtotal;

                OrderDetail::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'subtotal' => $subtotal,
                    'instructions' => $item['instructions'] ?? null,
                ]);

                if (!empty($item['extras'])) {
                    foreach ($item['extras'] as $extra) {
                        $extraProduct = Product::findOrFail($extra['product_id']);
                        $extraQty = $extra['quantity'];
                        $extraSubtotal = $extraProduct->price * $extraQty;
                        $total += $extraSubtotal;

                        OrderDetail::create([
                            'order_id' => $order->id,
                            'product_id' => $extraProduct->id,
                            'quantity' => $extraQty,
                            'subtotal' => $extraSubtotal,
                            'instructions' => 'Extra for product #' . $product->id,
                        ]);
                    }
                }
            }

            $order->update(['total_price' => $total]);

            $paymentData = [
                'order_id' => $order->id,
                'total_amount' => $total,
                'paid_amount' => 0,
                'payment_method' => $validated['payment_method'],
                'payment_status' => 'Pending',
            ];

            if ($validated['payment_method'] === 'GCash') {
                $secret = env('PAYMONGO_MODE') === 'TEST' 
                    ? env('PAYMONGO_TEST_SK') 
                    : env('PAYMONGO_LIVE_SK');

                // Create PaymentIntent only
                $intentResp = Http::withBasicAuth($secret, '')
                    ->post('https://api.paymongo.com/v1/payment_intents', [
                        'data' => [
                            'attributes' => [
                                'amount' => intval($total * 100),
                                'currency' => 'PHP',
                                'payment_method_allowed' => ['gcash'],
                                'capture_type' => 'automatic',
                                'description' => "Order #{$order->order_uuid}",
                                'metadata' => [
                                    'order_uuid' => (string) $order->order_uuid,
                                    'user_id' => (string) Auth::id(),
                                ],
                            ]
                        ]
                    ]);

                $intent = $intentResp->json();
                if (!isset($intent['data']['id'])) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Failed to create PayMongo Payment Intent',
                        'errors' => $intent['errors'] ?? null,
                    ], 500);
                }

                $paymentData['provider_reference_id'] = $intent['data']['id'];
                $paymentData['client_key'] = $intent['data']['attributes']['client_key'];
                $paymentData['payment_details'] = $intent;
            }

            Payment::create($paymentData);
            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'order_uuid' => $order->order_uuid,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error placing order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function pay_gcash($order_id)
    {
        $this->authorize('Customer');

        $order = Order::where('id', $order_id)
            ->where('user_id', Auth::id())
            ->with('payment')
            ->firstOrFail();

        if (!$order->payment || $order->payment->payment_method !== 'GCash') {
            return response()->json(['message' => 'No GCash payment found for this order.'], 400);
        }

        $secret = env('PAYMONGO_MODE') === 'TEST' 
            ? env('PAYMONGO_TEST_SK') 
            : env('PAYMONGO_LIVE_SK');

        try {
            $paymentIntentId = $order->payment->provider_reference_id;
            $clientKey = $order->payment->client_key;

            // 1. Check current Payment Intent status
            $intentResp = Http::withBasicAuth($secret, '')
                ->get("https://api.paymongo.com/v1/payment_intents/{$paymentIntentId}");
            $intent = $intentResp->json();
            $status = $intent['data']['attributes']['status'] ?? null;

            if ($status === 'succeeded') {
                return response()->json(['message' => 'Payment already completed.']);
            }

            // 2. Create new Payment Method
            $methodResp = Http::withBasicAuth($secret, '')
                ->post('https://api.paymongo.com/v1/payment_methods', [
                    'data' => [
                        'attributes' => [
                            'type' => 'gcash',
                            'billing' => [
                                'name' => $order->customer_name,
                                'email' => $order->email ?? Auth::user()->email,
                                'phone' => $order->contact_number,
                            ],
                        ]
                    ]
                ]);
            $paymentMethod = $methodResp->json();
            $paymentMethodId = $paymentMethod['data']['id'] ?? null;

            // 3. Attach Payment Method to Payment Intent
            $attachResp = Http::withBasicAuth($secret, '')
                ->post("https://api.paymongo.com/v1/payment_intents/{$paymentIntentId}/attach", [
                    'data' => [
                        'attributes' => [
                            'payment_method' => $paymentMethodId,
                            'client_key' => $clientKey,
                            'return_url' => route('customer.orders.gcash_return', ['order_id' => $order->id])
                        ]
                    ]
                ]);

            $attach = $attachResp->json();
            $nextActionUrl = $attach['data']['attributes']['next_action']['redirect']['url'] ?? null;

            // 4. Update Payment record with latest checkout info
            $order->payment->update([
                'payment_details' => $attach,
                'checkout_url' => $nextActionUrl,
            ]);

            return response()->json(['redirect_url' => $nextActionUrl]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error initiating GCash payment',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function gcash_return($order_id)
    {
        $order = Order::with('payment')->findOrFail($order_id);
        $secret = env('PAYMONGO_MODE') === 'TEST' 
            ? env('PAYMONGO_TEST_SK') 
            : env('PAYMONGO_LIVE_SK');

        $intentResp = Http::withBasicAuth($secret, '')
            ->get("https://api.paymongo.com/v1/payment_intents/{$order->payment->provider_reference_id}");

        $intent = $intentResp->json();
        Log::info('PayMongo Payment Intent Status Response: ', $intent);

        if ($intent['data']['attributes']['status'] === 'succeeded') {
            
            $order->payment->update([
                'payment_status' => 'Completed',
                'paid_amount' => $order->total_price,
            ]);

        } else {
            $order->payment->update([
                'payment_status' => ucfirst($intent['data']['attributes']['status']),
            ]);
        }

        return redirect()->route('customer.order.details', $order_id)
            ->with('message', 'Payment status updated.');
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
