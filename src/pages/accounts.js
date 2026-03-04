import { renderLayout } from '../components/layout.js';

const accounts = [
    {
        id: '88294102931',
        name: 'Travel Nusantara ID',
        type: 'FB Page',
        typeIcon: 'flag',
        status: 'Aktif',
        expiry: '12 Mei 2024',
        daysLeft: 45,
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        icon: 'social_leaderboard',
    },
    {
        id: '10293184920',
        name: '@nusantara_travel',
        type: 'IG Business',
        typeIcon: 'business',
        status: 'Perlu Re-auth',
        expiry: 'Kedaluwarsa',
        daysLeft: -2,
        iconBg: 'bg-gradient-to-br from-pink-500 to-orange-400',
        iconColor: 'text-white',
        icon: 'photo_camera',
    },
    {
        id: '77210592183',
        name: 'Kuliner Hits Bandung',
        type: 'FB Page',
        typeIcon: 'flag',
        status: 'Aktif',
        expiry: '20 Juni 2024',
        daysLeft: 84,
        iconBg: 'bg-primary',
        iconColor: 'text-white',
        icon: 'social_leaderboard',
    },
];

function getAccountStatusBadge(status) {
    if (status === 'Aktif') return '<span class="flex items-center gap-1.5"><span class="size-2 bg-emerald-500 rounded-full"></span><span class="badge-success">Aktif</span></span>';
    if (status === 'Perlu Re-auth') return '<span class="flex items-center gap-1.5"><span class="size-2 bg-orange-500 rounded-full"></span><span class="badge-warning">Perlu Re-auth</span></span>';
    return '<span class="badge-danger">Terputus</span>';
}

export function accountsPage(app) {
    const content = `
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div class="space-y-2">
        <h3 class="text-3xl font-black text-slate-900 tracking-tight">Manajemen Akun Terhubung</h3>
        <p class="text-slate-500 max-w-xl">Kelola integrasi Facebook Page dan Instagram Business dalam satu dashboard pusat.</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3">
        <button class="btn-primary">
          <span class="material-symbols-outlined text-sm">add</span>
          Hubungkan Akun Baru
        </button>
        <button class="btn-outline">
          <span class="material-symbols-outlined text-sm">sync</span>
          Segarkan Semua Token
        </button>
      </div>
    </div>

    <!-- Info Banner -->
    <div class="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
      <span class="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
      <div>
        <h5 class="font-bold text-primary text-sm mb-1">Pemberitahuan Kebijakan Meta</h5>
        <p class="text-sm text-slate-600 leading-relaxed">
          Berdasarkan kebijakan keamanan terbaru dari Meta, token akses berumur panjang (long-lived) wajib diperbarui secara berkala
          setiap 60 hingga 90 hari. Kegagalan melakukan pembaruan akan mengakibatkan pemutusan koneksi API secara otomatis.
          <a href="#" class="text-primary font-semibold underline">Pelajari selengkapnya.</a>
        </p>
      </div>
    </div>

    <!-- Accounts Table -->
    <div class="space-y-4">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
        <div class="col-span-4">Nama Akun</div>
        <div class="col-span-2">Jenis</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-3">Kedaluwarsa Token</div>
        <div class="col-span-1 text-right">Aksi</div>
      </div>

      <!-- Account Cards -->
      ${accounts.map(acc => `
      <div class="card p-5 hover:shadow-md transition-shadow">
        <div class="grid grid-cols-12 gap-4 items-center">
          <!-- Name -->
          <div class="col-span-4 flex items-center gap-3">
            <div class="size-10 ${acc.iconBg} ${acc.iconColor} rounded-xl flex items-center justify-center">
              <span class="material-symbols-outlined">${acc.icon}</span>
            </div>
            <div>
              <p class="font-bold text-slate-900">${acc.name}</p>
              <p class="text-xs text-slate-400">ID: ${acc.id}</p>
            </div>
          </div>
          <!-- Type -->
          <div class="col-span-2 flex items-center gap-2">
            <span class="material-symbols-outlined text-slate-400 text-lg">${acc.typeIcon}</span>
            <span class="text-sm text-slate-600">${acc.type}</span>
          </div>
          <!-- Status -->
          <div class="col-span-2">
            ${getAccountStatusBadge(acc.status)}
          </div>
          <!-- Expiry -->
          <div class="col-span-3">
            <p class="text-sm font-medium ${acc.daysLeft < 0 ? 'text-rose-600' : 'text-slate-900'}">${acc.expiry}</p>
            <p class="text-xs ${acc.daysLeft < 0 ? 'text-rose-500' : 'text-emerald-600'}">
              ${acc.daysLeft < 0 ? `${Math.abs(acc.daysLeft)} hari yang lalu` : `Sisa ${acc.daysLeft} hari`}
            </p>
          </div>
          <!-- Actions -->
          <div class="col-span-1 flex justify-end">
            ${acc.status === 'Perlu Re-auth'
            ? '<button class="btn-outline text-xs py-1.5 px-3"><span class="material-symbols-outlined text-sm">refresh</span>Re-auth</button>'
            : '<button class="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"><span class="material-symbols-outlined">more_vert</span></button>'
        }
          </div>
        </div>
      </div>
      `).join('')}

      <!-- Show More -->
      <div class="text-center py-4">
        <button class="text-sm text-slate-500 hover:text-primary font-medium flex items-center gap-1 mx-auto cursor-pointer">
          Tampilkan lebih banyak
          <span class="material-symbols-outlined text-lg">expand_more</span>
        </button>
      </div>
    </div>
  </div>`;

    renderLayout(app, 'Akun Terhubung', content);
}
