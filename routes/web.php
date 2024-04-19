<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PriceController;

Route::get('/', [PriceController::class, 'index'])->name('price.index');