<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthPageController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('auth/login');
    }

    public function register(): Response
    {
        return Inertia::render('auth/signup');
    }

    public function home(): Response|RedirectResponse
    {
        $user = Auth::user();

        // If not logged in, redirect to login
        if (!$user) {
            return redirect()->route('login');
        }

        // Redirect based on role
        switch ($user->role) {
            case 'Customer':
                return redirect()->route('customer.orders');
                
            case 'Owner':
                return redirect()->route('owner.orders');
            
            case 'Delivery':
                return redirect()->route('deliveries');

            default:
                return redirect()->route('login');
        }
    }
}
