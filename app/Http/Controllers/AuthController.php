<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function showLogin()
    {
        return view('auth.login');
    }

    public function login(Request $request)
    {
        // Logic for local testing
        return redirect()->route('dashboard');
    }

    public function showForgotPassword()
    {
        return view('auth.forgot-password');
    }

    public function logout()
    {
        Auth::logout();
        return redirect()->route('login');
    }
}
