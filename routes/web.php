<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfessionalPracticeController;
use App\Http\Controllers\PracticeTypeTemplateController;
use App\Http\Controllers\Auth\LoginController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

// Authentication Routes
Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');

// Protected Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');
    
    // Professional Practices Routes
    Route::resource('practices', ProfessionalPracticeController::class);
    Route::post('practices/{practice}/review', [ProfessionalPracticeController::class, 'review'])->name('practices.review');
    Route::post('practices/{practice}/approve', [ProfessionalPracticeController::class, 'approve'])->name('practices.approve');
    Route::post('practices/{practice}/certify', [ProfessionalPracticeController::class, 'certify'])->name('practices.certify');
    
    // Admin Routes
    Route::prefix('admin')->name('admin.')->middleware('can:admin-access')->group(function () {
        // Practice Type Templates
        Route::resource('templates', PracticeTypeTemplateController::class);
        Route::patch('templates/{template}/toggle', [PracticeTypeTemplateController::class, 'toggle'])->name('templates.toggle');
    });
});