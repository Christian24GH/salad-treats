<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Feedback;

class FeedbackController extends Controller
{
    public function feedback()
    {
        $this->authorize('Owner');

        $feedbacks = Feedback::with(['order', 'order.user'])
            ->get();
        return inertia('owner/feedbacks', [
            'feedbacks' => $feedbacks,
        ]);
    }

    public function feedback_details($id)
    {
        $this->authorize('Owner');
        return inertia('owner/feedback-details');
    }
}
