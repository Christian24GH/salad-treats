<?php

namespace App\Http\Controllers;

use App\Models\BlockedCustomer;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerManagementController extends Controller
{
    public function customers()
    {
        $this->authorize('Owner');

        $customers = User::where('role', 'Customer')
            ->withCount([
                'orders as delivered_orders_count' => fn($q) => $q->where('status', 'Delivered'),
                'orders as cancelled_orders_count' => fn($q) => $q->withTrashed()->where('status', 'Cancelled'),
                'orders as paid_orders_count' => fn($q) => $q->whereHas('payment', fn($p) => $p->where('payment_status', 'Completed')),
            ])
            ->with(['blocked.report'])
            ->orderBy('delivered_orders_count', 'asc')
            ->get();

        return inertia('owner/customers', [
            'customers' => $customers,
        ]);
    }


    public function customer_details($customer_id)
    {
        $this->authorize('Owner');
        return inertia('owner/customer_details');
    }

    public function block_customer(Request $request)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'message' => 'required|string|max:1000',
        ]);

        $user = User::where('role', 'Customer')->findOrFail($validated['user_id']);

        $existingBlock = BlockedCustomer::where('user_id', $user->id)
            ->where('is_blocked', true)
            ->first();

        if ($existingBlock) {
            return response()->json(['message' => 'This customer is already blocked.'], 400);
        }

        $report = Report::create([
            'reported_by' => Auth::id(),
            'type' => 'Fake Booking',
            'message' => $validated['message'],
        ]);

        BlockedCustomer::create([
            'user_id' => $user->id,
            'report_id' => $report->id,
            'is_blocked' => true,
        ]);

        return response()->json(['message' => 'Customer has been blocked successfully.'], 201);
    }

    public function unblock_customer(Request $request)
    {
        $this->authorize('Owner');

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $blocked = BlockedCustomer::where('user_id', $validated['user_id'])
            ->where('is_blocked', true)
            ->latest()
            ->first();

        if (!$blocked) {
            return response()->json(['message' => 'User is not currently blocked.'], 404);
        }

        $blocked->update([
            'is_blocked' => false,
        ]);

        return response()->json(['message' => 'Customer has been unblocked successfully.'], 200);
    }
}
