<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OwnerController;
use App\Http\Middleware\EnsureAuthenticated;

//ONLY RENDERS PAGES, POST LOGIN ROUTE IS HANDLED BY LARAVEL FORTIFY
Route::get('/login', [AuthPageController::class, 'login'])->name('login');
Route::get('/register', [AuthPageController::class, 'register'])->name('register');

Route::get('/sanctum/csrf-cookie', fn()=>response()->noContent());

Route::middleware(EnsureAuthenticated::class)->group(function(){
    Route::get('/home', [AuthPageController::class, 'home'])->name('home');
    Route::post('/make-account', [AuthController::class, 'store'])->name('register');
    
    //DASHBOARDS
    Route::prefix('/customer')->group(function () {
        Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');    
    });
    
    Route::prefix('/owner')->group(function () {
        Route::get('/orders', [OwnerController::class, 'orders'])->name('owner.orders');
    });
});