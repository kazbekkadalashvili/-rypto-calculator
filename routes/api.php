<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PriceController;

Route::get('/price', [PriceController::class, 'getPrice']);

