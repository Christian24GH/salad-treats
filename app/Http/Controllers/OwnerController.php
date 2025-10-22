<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OwnerController extends Controller
{
    public function orders()
    {
        $this->authorize('Owner');
        return inertia('owner/orders');
    }
}
