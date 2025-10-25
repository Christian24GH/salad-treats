<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function customerAccount()
    {
        $user = Auth::user();

        if ($user->role === 'owner') {
            return redirect()->route('owner.account');
        }

        return Inertia::render('customer/Account', [
            'user' => $user,
        ]);
    }

    public function ownerAccount()
    {
        $user = Auth::user();

        return Inertia::render('owner/Account', [
            'user' => $user,
        ]);
    }
}

