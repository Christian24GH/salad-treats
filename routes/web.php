<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\TrackerController;
use App\Http\Middleware\EnsureAuthenticated;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;

Route::get('/sanctum/csrf-cookie', fn()=>response()->noContent());


//ONLY RENDERS PAGES, POST LOGIN ROUTE IS HANDLED BY LARAVEL FORTIFY
Route::get('/login', [AuthPageController::class, 'login'])->name('login');
Route::get('/register', [AuthPageController::class, 'register'])->name('register');
Route::get('/email/verify', function () {
    return inertia('auth/verify-email');
})->middleware('auth')->name('verification.notice');


Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    $request->fulfill();
    return redirect('/home');
})->middleware(['auth', 'signed'])->name('verification.verify');

Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('status', 'verification-link-sent');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send');


Route::middleware([EnsureAuthenticated::class, 'verified'])->group(function(){
    Route::get('/home', [AuthPageController::class, 'home'])->name('home');
    Route::post('/make-account', [AuthController::class, 'store'])->name('register');
    
    //DASHBOARDS
    Route::prefix('/customer')->group(function () {
        Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');    
    });
    
    Route::prefix('/owner')->group(function () {
        Route::prefix('/orders')->group(function () {
            Route::get('/', [OrderController::class, 'orders'])->name('owner.orders');
            Route::get('/{order_uuid}', [OrderController::class, 'order_details'])->name('owner.orders.show');
            Route::post('/approve', [OrderController::class, 'approve_order'])->name('owner.orders.approve');
            Route::post('/reject', [OrderController::class, 'reject_order'])->name('owner.orders.reject');
        });

        Route::prefix('/tracker')->group(function () {
            Route::get('/', [TrackerController::class, 'tracker'])->name('owner.tracker');
            Route::get('/{order_uuid}', [TrackerController::class, 'tracker_details'])->name('owner.tracker.show');
        });

        Route::prefix('/menu')->group(function () {
            // Displays the list of all menu items
            Route::get('/', [MenuController::class, 'index'])->name('owner.menu');

            // Shows the form for creating a new menu item
            Route::get('/create', [MenuController::class, 'create'])->name('owner.menu.create');

            // Handles the POST request to save a new menu item
            Route::post('/store', [MenuController::class, 'store'])->name('owner.menu.store');
            
            // Displays details of a single menu item by UUID
            Route::get('/{product_uuid}', [MenuController::class, 'show'])->name('owner.menu.show');
        });
    });
});