<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    protected function authorize($allowed_role){
        $user = Auth::user();
        if($user->role !== $allowed_role){
            abort(403, 'Unauthorized action.');
            return redirect()->route('login');
        }

        return $user;
    }
}
