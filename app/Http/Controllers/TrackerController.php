<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TrackerController extends Controller
{
    public function tracker()
    {
        $this->authorize('Owner');
        return inertia('owner/tracker');
    }

    public function tracker_details($id)
    {
        $this->authorize('Owner');
        return inertia('owner/tracker-details');
    }
}
