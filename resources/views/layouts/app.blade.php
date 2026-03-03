<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - Meta Automation</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Google Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f5f7f8; }
        .sidebar { width: 280px; height: 100vh; position: fixed; background: white; border-right: 1px solid #eee; }
        .main-content { margin-left: 280px; padding: 40px; }
        .nav-link { border-radius: 12px; padding: 12px 20px; margin-bottom: 4px; font-weight: 500; color: #666; }
        .nav-link.active { background: #0668e015; color: #0668e0; font-weight: 700; }
        .card { border-radius: 24px; border: 1px solid #eee; box-shadow: 0 2px 12px rgba(0,0,0,0.02); }
        .btn-primary { background: #0668e0; border: none; border-radius: 12px; padding: 12px 24px; font-weight: 700; }
    </style>
</head>
<body>
    @auth
    <div class="sidebar p-4">
        <div class="d-flex align-items-center gap-3 mb-5">
            <div class="bg-primary text-white rounded-3 p-2">
                <i class="bi bi-shield-check fs-4"></i>
            </div>
            <div>
                <h5 class="mb-0 fw-bold">Meta Auto</h5>
                <small class="text-muted text-uppercase fw-bold" style="font-size: 10px;">Automation System</small>
            </div>
        </div>
        
        <nav class="nav flex-column">
            <a class="nav-link {{ request()->routeIs('dashboard') ? 'active' : '' }}" href="{{ route('dashboard') }}">
                <i class="bi bi-grid-1x2-fill me-3"></i> Dashboard
            </a>
            <a class="nav-link {{ request()->routeIs('accounts') ? 'active' : '' }}" href="{{ route('accounts') }}">
                <i class="bi bi-link-45deg me-3"></i> Akun Terhubung
            </a>
            <a class="nav-link" href="#">
                <i class="bi bi-plus-square me-3"></i> Buat Postingan
            </a>
            <a class="nav-link" href="#">
                <i class="bi bi-calendar3 me-3"></i> Kalender
            </a>
            <a class="nav-link {{ request()->routeIs('profile') ? 'active' : '' }}" href="{{ route('profile') }}">
                <i class="bi bi-person me-3"></i> Profil
            </a>
        </nav>

        <div class="mt-auto pt-4 border-top">
            <form action="{{ route('logout') }}" method="POST">
                @csrf
                <button class="btn btn-light w-100 text-danger fw-bold rounded-3">
                    <i class="bi bi-box-arrow-right me-2"></i> Keluar
                </button>
            </form>
        </div>
    </div>
    <div class="main-content">
        @yield('content')
    </div>
    @else
        @yield('content')
    @endauth

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
