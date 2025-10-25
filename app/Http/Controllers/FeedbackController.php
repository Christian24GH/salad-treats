<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function feedback()
    {
        $this->authorize('Owner');

        $feedback = Feedback::with(['order', 'order.user'])
            ->get();

            //dd($feedback);
        return inertia('owner/feedback', [
            'feedback' => $feedback,
        ]);
    }

    public function feedback_details($id)
    {
        $this->authorize('Owner');
        
        $feedback = Feedback::with(['order', 'order.user'])
            ->get();

            //dd($feedback);
        return inertia('owner/feedback-details', [
            'feedback' => $feedback,
        ]);
    }
}
