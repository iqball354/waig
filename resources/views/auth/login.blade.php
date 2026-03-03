@extends('layouts.app')

@section('title', 'Login')

@section('content')
<div class="min-vh-100 d-flex align-items-center justify-content-center p-4">
    <div class="card p-5 shadow-lg border-0" style="max-width: 450px; width: 100%; border-radius: 40px;">
        <div class="text-center mb-5">
            <div class="bg-primary bg-opacity-10 text-primary rounded-4 d-inline-flex p-3 mb-4">
                <i class="bi bi-shield-lock-fill fs-1"></i>
            </div>
            <h2 class="fw-black">Meta Automation</h2>
            <p class="text-muted">Silakan masuk untuk mengelola sistem Anda</p>
        </div>

        <form action="{{ route('login') }}" method="POST">
            @csrf
            <div class="mb-4">
                <label class="form-label fw-bold small">Alamat Email</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" name="email" class="form-control bg-light border-0 py-3" placeholder="nama@perusahaan.com" required>
                </div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between">
                    <label class="form-label fw-bold small">Kata Sandi</label>
                    <a href="{{ route('password.request') }}" class="small fw-bold text-primary text-decoration-none">Lupa Password?</a>
                </div>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-lock text-muted"></i></span>
                    <input type="password" name="password" class="form-control bg-light border-0 py-3" placeholder="••••••••" required>
                </div>
            </div>

            <div class="mb-4 form-check">
                <input type="checkbox" class="form-check-input" id="remember">
                <label class="form-check-label small fw-bold text-muted" for="remember">Ingat saya di perangkat ini</label>
            </div>

            <button type="submit" class="btn btn-primary w-100 py-3 shadow-lg">
                <i class="bi bi-box-arrow-in-right me-2"></i> Login Meta
            </button>
        </form>

        <div class="mt-5 text-center">
            <p class="small text-muted fw-bold">Belum memiliki akun? <a href="#" class="text-primary text-decoration-none">Daftar sekarang</a></p>
        </div>
    </div>
</div>
@endsection
