<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController; // <-- MUST ADD THIS IMPORT

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Default welcome route (shows the main Laravel page)
Route::get('/', function () {
    return view('welcome');
});

// ** CRITICAL FIX: MANUALLY DEFINING THE API ROUTE HERE **
// We use the full 'api/products' URI since this file is loaded without the 'api' prefix.
Route::get('/api/products', [ProductController::class, 'index']);