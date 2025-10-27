<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class CustomerManagementController extends Controller
{
    public function customers()
    {
        $this->authorize('Owner');
        $customers = User::where('role', 'Customer')
            ->withCount([
                'orders as delivered_orders_count' => function ($query) {
                    $query->where('status', '=', 'Delivered');
                }, 
                'orders as cancelled_orders_count' => function ($query) {
                    $query->withTrashed()->where('status', '=', 'Cancelled');
                }, 
                'orders as paid_orders_count' => function ($query) {
                    $query->whereHas('payment', function ($query) {
                        $query->where('payment_status', '=', 'Completed');
                    });
                }
            ])
            ->get();
        return inertia('owner/customers', [
            'customers' => $customers
        ]);
    }

    public function customer_details($customer_id)
    {
        $this->authorize('Owner');
        return inertia('owner/customer_details');
    }
}
