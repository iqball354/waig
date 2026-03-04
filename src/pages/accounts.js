import { renderLayout } from '../components/layout.js';
import { api } from '../api.js';

function getAccountStatusBadge(status) {
  if (status === 'Aktif') return '<span class="flex items-center gap-1.5"><span class="size-2 bg-emerald-500 rounded-full"></span><span class="badge-success">Aktif</span></span>';
  if (status === 'Perlu Re-auth') return '<span class="flex items-center gap-1.5"><span class="size-2 bg-orange-500 rounded-full"></span><span class="badge-warning">Perlu Re-auth</span></span>';
  return '<span class="badge-danger">Terputus</span>';
}

function formatExpiry(iso) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export async function accountsPage(app) {
  renderLayout(app, 'Akun Terhubung', '<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span></div>');

  try {
    const accounts = await api.getAccounts();

    const content = `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div class="space-y-2">
          <h3 class="text-3xl font-black text-slate-900 tracking-tight">Manajemen Akun Terhubung</h3>
          <p class="text-slate-500 max-w-xl">Kelola integrasi Facebook Page dan Instagram Business dalam satu dashboard pusat.</p>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <a href="/api/meta/oauth" class="btn-primary"><span class="material-symbols-outlined text-sm">add</span>Hubungkan Akun Baru</a>
          <button id="refresh-all-btn" class="btn-outline"><span class="material-symbols-outlined text-sm">sync</span>Segarkan Semua Token</button>
        </div>
      </div>

      <div class="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-3">
        <span class="material-symbols-outlined text-primary text-xl mt-0.5">info</span>
        <div>
          <h5 class="font-bold text-primary text-sm mb-1">Pemberitahuan Kebijakan Meta</h5>
          <p class="text-sm text-slate-600 leading-relaxed">
            Berdasarkan kebijakan keamanan terbaru dari Meta, token akses berumur panjang (long-lived) wajib diperbarui secara berkala
            setiap 60 hingga 90 hari. <a href="#" class="text-primary font-semibold underline">Pelajari selengkapnya.</a>
          </p>
        </div>
      </div>

      <div id="accounts-message" class="hidden p-4 rounded-xl text-sm font-medium"></div>

      <div class="space-y-4">
        <div class="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div class="col-span-4">Nama Akun</div>
          <div class="col-span-2">Jenis</div>
          <div class="col-span-2">Status</div>
          <div class="col-span-3">Kedaluwarsa Token</div>
          <div class="col-span-1 text-right">Aksi</div>
        </div>

        ${accounts.map(acc => `
        <div class="card p-5 hover:shadow-md transition-shadow">
          <div class="grid grid-cols-12 gap-4 items-center">
            <div class="col-span-4 flex items-center gap-3">
              <div class="size-10 ${acc.type === 'FB Page' ? 'bg-primary' : 'bg-gradient-to-br from-pink-500 to-orange-400'} text-white rounded-xl flex items-center justify-center">
                <span class="material-symbols-outlined">${acc.type === 'FB Page' ? 'social_leaderboard' : 'photo_camera'}</span>
              </div>
              <div>
                <p class="font-bold text-slate-900">${acc.name}</p>
                <p class="text-xs text-slate-400">ID: ${acc.account_id}</p>
              </div>
            </div>
            <div class="col-span-2 flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400 text-lg">${acc.type === 'FB Page' ? 'flag' : 'business'}</span>
              <span class="text-sm text-slate-600">${acc.type}</span>
            </div>
            <div class="col-span-2">${getAccountStatusBadge(acc.status)}</div>
            <div class="col-span-3">
              <p class="text-sm font-medium ${acc.days_left < 0 ? 'text-rose-600' : 'text-slate-900'}">${formatExpiry(acc.token_expiry)}</p>
              <p class="text-xs ${acc.days_left < 0 ? 'text-rose-500' : 'text-emerald-600'}">
                ${acc.days_left < 0 ? `${Math.abs(acc.days_left)} hari yang lalu` : `Sisa ${acc.days_left} hari`}
              </p>
            </div>
            <div class="col-span-1 flex justify-end">
              ${acc.status === 'Perlu Re-auth'
        ? `<button class="reauth-btn btn-outline text-xs py-1.5 px-3" data-id="${acc.id}"><span class="material-symbols-outlined text-sm">refresh</span>Re-auth</button>`
        : `<button class="reauth-btn p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer" data-id="${acc.id}" title="Refresh Token"><span class="material-symbols-outlined">sync</span></button>`
      }
            </div>
          </div>
        </div>
        `).join('')}
      </div>
    </div>`;

    renderLayout(app, 'Akun Terhubung', content);

    // Re-auth handlers
    document.querySelectorAll('.reauth-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        btn.disabled = true;
        try {
          await api.reauthAccount(id);
          const msgEl = document.getElementById('accounts-message');
          msgEl.textContent = '✅ Token berhasil diperbarui!';
          msgEl.className = 'p-4 rounded-xl text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-700';
          msgEl.classList.remove('hidden');
          setTimeout(() => accountsPage(app), 1500); // Reload
        } catch (err) {
          alert('Gagal refresh token: ' + err.message);
        }
      });
    });

    // Refresh all
    document.getElementById('refresh-all-btn')?.addEventListener('click', async () => {
      for (const acc of accounts) {
        try { await api.reauthAccount(acc.id); } catch { }
      }
      accountsPage(app);
    });
  } catch (err) {
    renderLayout(app, 'Akun Terhubung', `<div class="text-center py-20 text-rose-500">Gagal memuat data: ${err.message}</div>`);
  }
}
