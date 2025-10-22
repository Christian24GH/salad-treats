<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        if($user->role !== 'Customer'){
            abort(403, 'Unauthorized action.');
            return redirect()->route('login');
        }

        $user = Auth::user();
        return inertia('customer/dashboard', [
            'user' => $user
        ]);
    }
}
