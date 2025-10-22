<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
