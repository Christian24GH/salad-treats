<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrackerController extends Controller
{
    public function trackers()
    {
        $this->authorize('Owner');
        return inertia('/owner/tracker');
    }
}
