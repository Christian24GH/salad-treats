<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    public function feedback()
    {
        $this->authorize('Owner');
        return inertia('owner/feedback');
    }

    public function feedback_details($id)
    {
        $this->authorize('Owner');
        return inertia('owner/feedback-details');
    }
}
