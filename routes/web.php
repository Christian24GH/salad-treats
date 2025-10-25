<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\CustomerOrderController;
use App\Http\Controllers\CustomerProductController;
use App\Http\Controllers\DeliveryController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TrackerController;
use App\Http\Middleware\EnsureAuthenticated;
use App\Http\Controllers\LandingController;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

Route::get('/sanctum/csrf-cookie', fn()=>response()->noContent());

// Public landing route (no auth required)
Route::get('/', [LandingController::class, 'index'])->name('landing');


//ONLY RENDERS PAGES, POST LOGIN ROUTE IS HANDLED BY LARAVEL FORTIFY
Route::get('/login', [AuthPageController::class, 'login'])->name('login');
Route::get('/register', [AuthPageController::class, 'register']);
Route::get('/email/verify', function () {
    return inertia('auth/verify-email');
})->middleware('auth')->name('verification.notice');


Route::get('/email/verify/{id}/{hash}', function (Request $request, $id, $hash) {
    $user = User::findOrFail($id);

    // Check if the signed hash is valid
    if (! hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
        abort(403, 'Invalid or expired verification link.');
    }

    // Log in the user if not already authenticated
    if (! Auth::check()) {
        Auth::login($user);
    }

    // Mark email as verified if not yet verified
    if (! $user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
        event(new Verified($user));
    }

    return redirect()->intended('/home')->with('verified', true);
})->middleware(['signed'])->name('verification.verify');


Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('status', 'verification-link-sent');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');


Route::middleware([EnsureAuthenticated::class, 'verified'])->group(function(){
    Route::get('/home', [AuthPageController::class, 'home'])->name('home');
    Route::post('/make-account', [AuthController::class, 'store'])->name('register');
    
    //DASHBOARDS
    Route::prefix('/customer')->group(function () {
        Route::prefix('/orders')->group(function () {
            Route::get('/', [CustomerOrderController::class, 'orders'])->name('customer.orders');
            Route::get('/create', [CustomerOrderController::class, 'create_order'])->name('customer.order.create');
            Route::post('/place', [CustomerOrderController::class, 'place_order'])->name('customer.order.place');
            Route::post('/cancel/{order_uuid}', [CustomerOrderController::class, 'cancel_order'])->name('customer.order.cancel');
            Route::get('/{order_id}', [CustomerOrderController::class, 'order_details'])->name('customer.order.details');
            
            Route::get('/{order_id}/pay-gcash', [CustomerOrderController::class, 'pay_gcash'])->name('customer.order.pay-gcash');
            Route::get('/{order_id}/gcash-return', [CustomerOrderController::class, 'gcash_return'])->name('customer.orders.gcash_return')->excludedMiddleware('auth');

            
        });

        Route::prefix('/menu')->group(function () {
            Route::get('/', [CustomerProductController::class, 'products'])->name('customer.products');
            Route::get('/product/{id}', [CustomerProductController::class, 'product_details'])->name('customer.product.details');
        });
    });
    
    
    Route::prefix('/owner')->group(function () {
        Route::prefix('/orders')->group(function () {
            Route::get('/', [OrderController::class, 'orders'])->name('owner.orders');
            Route::get('/{order_id}', [OrderController::class, 'order_details'])->name('owner.orders.show');
            Route::post('/approve', [OrderController::class, 'approve_order'])->name('owner.orders.approve');
            Route::post('/reject', [OrderController::class, 'reject_order'])->name('owner.orders.reject');

            
        });

        Route::prefix('/tracker')->group(function () {
            Route::get('/', [TrackerController::class, 'tracker'])->name('owner.tracker');
            Route::get('/{id}', [TrackerController::class, 'tracker_details']);
            Route::post('/{id}/status', [TrackerController::class, 'updateStatus']);
            Route::post('/{id}/assign-driver', [TrackerController::class, 'assignDriver']);
        });

        Route::prefix('/feedback')->group(function () {
            Route::get('/', [FeedbackController::class, 'feedback'])->name('owner.feedback');
            Route::get('/{order_uuid}', [FeedbackController::class, 'feedback_details'])->name('owner.feedback.show');
        });

        Route::prefix('/menu')->group(function () {
            // Displays the list of all menu items
            Route::get('/', [MenuController::class, 'index'])->name('owner.menu');

            // Shows the form for creating a new menu item
            Route::get('/create', [MenuController::class, 'create'])->name('owner.menu.create');

            // Handles the POST request to save a new menu item
            Route::post('/store', [MenuController::class, 'store'])->name('owner.menu.store');
            
            Route::get('/edit/{id}', [MenuController::class, 'edit'])->name('owner.menu.edit');

            Route::post('/update/{id}', [MenuController::class, 'update'])->name('owner.menu.update');
            // Displays details of a single menu item by UUID
            Route::get('/{product_uuid}', [MenuController::class, 'show'])->name('owner.menu.show');
        });
    });

    Route::prefix('/d')->group(function(){
        Route::prefix('/deliveries')->group(function(){
            Route::get('/', [DeliveryController::class, 'deliveries'])->name('deliveries');
            Route::get('/{delivery_id}', [DeliveryController::class, 'delivery_details'])->name('delivery.details');
        });
    });
});