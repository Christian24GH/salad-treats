<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{   
    public function deliveryaccount()
    {
        $user = Auth::user();

        $this->authorize('Delivery');

        return Inertia::render('customer/account', [
            'user' => $user,
        ]);
    }

    public function customerAccount()
    {
        $user = Auth::user();
        $this->authorize('Customer');

        return Inertia::render('customer/account', [
            'customerAccount' => $user,
        ]);
    }

    public function ownerAccount()
    {
        $user = Auth::user();
        $this->authorize('Owner');
        return Inertia::render('owner/account', [
            'customerAccount' => $user,
        ]);
    }
}

