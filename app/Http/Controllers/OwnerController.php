<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        if($user->role !== 'Owner'){
            abort(403, 'Unauthorized action.');
            return redirect()->route('login');
        }

        return inertia('owner/dashboard', [
            'user' => $user
        ]);
    }
}
