@extends('layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="container-fluid">
    <div class="row mb-4">
        <div class="col">
            <h2 class="fw-black">Ringkasan Statistik</h2>
            <p class="text-muted">Pantau performa postingan Anda hari ini.</p>
        </div>
    </div>

    <div class="row g-4 mb-5">
        <div class="col-md-4">
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="bg-primary bg-opacity-10 text-primary rounded-4 p-3">
                        <i class="bi bi-bar-chart-fill fs-4"></i>
                    </div>
                    <span class="badge bg-success bg-opacity-10 text-success rounded-pill">+12.5%</span>
                </div>
                <small class="text-muted fw-bold text-uppercase">Total Posting</small>
                <h1 class="fw-black mb-0">1,284</h1>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="bg-warning bg-opacity-10 text-warning rounded-4 p-3">
                        <i class="bi bi-clock-fill fs-4"></i>
                    </div>
                    <span class="badge bg-success bg-opacity-10 text-success rounded-pill">+5%</span>
                </div>
                <small class="text-muted fw-bold text-uppercase">Terjadwal</small>
                <h1 class="fw-black mb-0">42</h1>
            </div>
        </div>
        <div class="col-md-4">
            <div class="card p-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="bg-success bg-opacity-10 text-success rounded-4 p-3">
                        <i class="bi bi-check-circle-fill fs-4"></i>
                    </div>
                    <span class="badge bg-success bg-opacity-10 text-success rounded-pill">+10.2%</span>
                </div>
                <small class="text-muted fw-bold text-uppercase">Sukses Terbit</small>
                <h1 class="fw-black mb-0">1,230</h1>
            </div>
        </div>
    </div>

    <div class="row">
        <div class="col">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="fw-black">Postingan Terbaru</h4>
                <a href="#" class="text-primary fw-bold text-decoration-none">Lihat Semua</a>
            </div>
            <div class="card overflow-hidden">
                <table class="table table-hover mb-0">
                    <thead class="bg-light">
                        <tr>
                            <th class="px-4 py-3 text-muted text-uppercase small fw-black">Media</th>
                            <th class="px-4 py-3 text-muted text-uppercase small fw-black">Caption</th>
                            <th class="px-4 py-3 text-muted text-uppercase small fw-black">Jadwal</th>
                            <th class="px-4 py-3 text-muted text-uppercase small fw-black">Platform</th>
                            <th class="px-4 py-3 text-muted text-uppercase small fw-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($postings as $post)
                        <tr>
                            <td class="px-4 py-3">
                                <img src="{{ $post->media_url }}" class="rounded-3" width="48" height="48" style="object-fit: cover;">
                            </td>
                            <td class="px-4 py-3 fw-bold align-middle">{{ Str::limit($post->caption, 40) }}</td>
                            <td class="px-4 py-3 align-middle">
                                <div class="fw-bold">{{ $post->scheduled_at->format('d M Y') }}</div>
                                <small class="text-muted">{{ $post->scheduled_at->format('H:i') }} WIB</small>
                            </td>
                            <td class="px-4 py-3 align-middle">
                                <span class="badge bg-light text-dark border p-2 rounded-3">
                                    <i class="bi bi-{{ strtolower($post->platform) }} text-primary me-1"></i> {{ $post->platform }}
                                </span>
                            </td>
                            <td class="px-4 py-3 align-middle">
                                <span class="badge rounded-pill bg-{{ $post->status == 'Sukses' ? 'success' : ($post->status == 'Gagal' ? 'danger' : 'warning') }} bg-opacity-10 text-{{ $post->status == 'Sukses' ? 'success' : ($post->status == 'Gagal' ? 'danger' : 'warning') }} px-3">
                                    {{ $post->status }}
                                </span>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
