<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthPageController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\OwnerController;

//ONLY RENDERS PAGES, POST LOGIN ROUTE IS HANDLED BY LARAVEL FORTIFY
Route::get('/login', [AuthPageController::class, 'login'])->name('login');
Route::get('/register', [AuthPageController::class, 'register'])->name('register');

Route::get('/home', [AuthPageController::class, 'home'])->name('home');

Route::post('/make-account', [AuthController::class, 'store'])->name('register');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});


//DASHBOARDS
Route::prefix('/customer')->group(function () {
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');
});

Route::prefix('/owner')->group(function () {
    Route::get('/dashboard', [OwnerController::class, 'dashboard'])->name('owner.dashboard');
});