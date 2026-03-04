import { renderLayout } from '../components/layout.js';
import { api } from '../api.js';

function getStatusClass(status) {
  if (status === 'Sukses') return 'badge-success';
  if (status === 'Gagal') return 'badge-danger';
  return 'badge-warning';
}

function formatDate(iso) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} WIB`;
}

export async function dashboardPage(app) {
  // Show loading first
  renderLayout(app, 'Dashboard', '<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span></div>');

  try {
    const [stats, postings] = await Promise.all([api.getStats(), api.getPostings()]);

    const content = `
    <div class="space-y-8">
      <div class="space-y-1">
        <h3 class="text-3xl font-black text-slate-900 tracking-tight">Ringkasan Statistik</h3>
        <p class="text-slate-500">Pantau performa postingan Anda di semua platform hari ini.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-primary/10 rounded-xl text-primary"><span class="material-symbols-outlined">stacked_bar_chart</span></div>
            <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">+12.5% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Total Postingan</p>
          <p class="text-3xl font-black text-slate-900 mt-1">${stats.totalPostings.toLocaleString()}</p>
        </div>
        <div class="card hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-amber-100 rounded-xl text-amber-600"><span class="material-symbols-outlined">schedule</span></div>
            <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">+5% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Terjadwal</p>
          <p class="text-3xl font-black text-slate-900 mt-1">${stats.scheduled}</p>
        </div>
        <div class="card hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 bg-emerald-100 rounded-xl text-emerald-600"><span class="material-symbols-outlined">check_circle</span></div>
            <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">+10.2% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span></span>
          </div>
          <p class="text-slate-500 text-sm font-medium">Sukses Terbit</p>
          <p class="text-3xl font-black text-slate-900 mt-1">${stats.success.toLocaleString()}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-900">Postingan Terbaru</h3>
          <button class="text-primary text-sm font-semibold hover:underline cursor-pointer">Lihat Semua</button>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Media</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Caption</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jadwal</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${postings.length === 0 ? `
                <tr><td colspan="6" class="px-6 py-12 text-center text-slate-400">Belum ada postingan. <a href="#/create-posting" class="text-primary font-semibold">Buat sekarang →</a></td></tr>
                ` : postings.map(p => `
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="size-12 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                      ${p.media_url ? `<img class="w-full h-full object-cover" src="${p.media_url}" alt="" />` : '<span class="material-symbols-outlined text-slate-300">image</span>'}
                    </div>
                  </td>
                  <td class="px-6 py-4"><p class="text-sm font-medium text-slate-900 max-w-xs truncate">${p.caption}</p></td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <p class="text-xs text-slate-500">${formatDate(p.scheduled_at)}</p>
                    <p class="text-xs font-bold text-slate-700">${formatTime(p.scheduled_at)}</p>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                      <span class="material-symbols-outlined text-${p.platform === 'Instagram' ? 'blue-600' : 'primary'} text-lg">${p.platform === 'Instagram' ? 'photo_camera' : 'social_leaderboard'}</span>
                      <span class="text-xs font-semibold text-slate-700">${p.platform}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap"><span class="${getStatusClass(p.status)}">${p.status}</span></td>
                  <td class="px-6 py-4 whitespace-nowrap text-right">
                    <div class="flex justify-end gap-2">
                      <button class="text-primary hover:text-blue-700 cursor-pointer"><span class="material-symbols-outlined">edit</span></button>
                      <button class="delete-posting text-rose-500 hover:text-rose-700 cursor-pointer" data-id="${p.id}"><span class="material-symbols-outlined">delete</span></button>
                    </div>
                  </td>
                </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>`;

    renderLayout(app, 'Dashboard', content);

    // Delete handlers
    document.querySelectorAll('.delete-posting').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Hapus postingan ini?')) return;
        await api.deletePosting(btn.dataset.id);
        dashboardPage(app); // Reload
      });
    });
  } catch (err) {
    renderLayout(app, 'Dashboard', `<div class="text-center py-20 text-rose-500">Gagal memuat data: ${err.message}</div>`);
  }
}
