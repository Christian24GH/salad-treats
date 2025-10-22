<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthPageController;

Route::get('/login', [AuthPageController::class, 'login'])->name('login');
Route::get('/register', [AuthPageController::class, 'register'])->name('register');

Route::post('/make-account', [AuthController::class, 'store'])->name('register');

Route::get('/sanctum/csrf-cookie', function () {
    return response()->noContent();
});