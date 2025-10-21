<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing/landing');
});

Route::get('/login', function () {
    return Inertia::render('landing/login');
});