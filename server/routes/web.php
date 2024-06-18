<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
Route::resource('users', UserController::class)->middleware(['is_admin']);
Route::get('orders/new', [OrderController::class, 'new'])->middleware(['is_admin']);
Route::get('orders/{order}/appoint', [OrderController::class, 'appoint'])->middleware(['is_admin']);
Route::resource('orders', OrderController::class)->middleware(['is_admin']);
