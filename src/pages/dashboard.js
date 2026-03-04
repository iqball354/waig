import { renderLayout } from '../components/layout.js';

const postings = [
    {
        id: 1,
        media: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAngcQixmb76Uw6ZbABSX8ga0OMGFhJoH8EDN9P8BNnG2K640tgGXusiAv7A3lWBkBfhqzgEtY0laz05THZIm9nCW6EEw219EHJjHtu2pxKQjexMy89z_5XHEarXlS7iElymJIGYBaxUiyo7nW-rjGQA2ix8dadQmt6pI20xOOa-0nENrhG7k6Ii-lqQHQWUkFGusLa8W3oHGDH168DCq2dWIKXWYMQJbnI6IIB94QJRHwNSkwd6CPfoNCx4OCFavgcJn0iVPbowo',
        caption: 'Promo Diskon Akhir Tahun untuk Semua Produk!',
        date: '25 Okt 2023',
        time: '10:00 WIB',
        platform: 'Instagram',
        platformIcon: 'photo_camera',
        status: 'Terjadwal',
    },
    {
        id: 2,
        media: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKEknqKI32U_TOBwzPFFOt8eYZBPsAhjn75sx1SOnA9SDfLqTncSTyf1hpsRrozevKw9U7jg3mlh77m7Xs_ywUakP9rJyNiRKcRSCCtXfqaJR80WUpddl2EES0kK2JTYzt-dyjbXgGP1u-jCl6tlfJjps1O3bho3l0j_rWC27asn80OOLSg81qQujLduPvyY5Xu_J4qduIwLY3LAGXLvz6y3QdT-UbngbUok5yRlXknBxmhkUnVyo0JB7SheFL1yl5-D9Hjqqxnig',
        caption: 'Tips Mengelola Konten agar Tetap Konsisten...',
        date: '24 Okt 2023',
        time: '14:30 WIB',
        platform: 'Facebook',
        platformIcon: 'social_leaderboard',
        status: 'Sukses',
    },
    {
        id: 3,
        media: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb887G5a4OMS3sJYc1gxkKUIvm39r0Qif74s3h15agrDQ5-BndhjLk4hy3xZzJ24biESY-JlAleTdOPUUZVNOZE6EOATMqgB62OQQFWTega-SqDFJ79zY4WBxrEmdFCNecs4X0nV1gTljKLBxiwOfUopm5yWVxYE3JJ2_sl4xfilE_a15Axovgq2lh0sR0_lNZwVG769WYw2a3U2vdMMvxkEOa2ToGhUGK_pOhZ80DieKMJf1EIUy5HJJ91bRATvYNrPg_DRIC5xw',
        caption: 'Pengumuman Pemenang Giveaway Mingguan!',
        date: '23 Okt 2023',
        time: '09:00 WIB',
        platform: 'Instagram',
        platformIcon: 'photo_camera',
        status: 'Gagal',
    },
];

function getStatusClass(status) {
    if (status === 'Sukses') return 'badge-success';
    if (status === 'Gagal') return 'badge-danger';
    return 'badge-warning';
}

export function dashboardPage(app) {
    const content = `
  <div class="space-y-8">
    <!-- Header Text -->
    <div class="space-y-1">
      <h3 class="text-3xl font-black text-slate-900 tracking-tight">Ringkasan Statistik</h3>
      <p class="text-slate-500">Pantau performa postingan Anda di semua platform hari ini.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total Postingan -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-primary/10 rounded-xl text-primary">
            <span class="material-symbols-outlined">stacked_bar_chart</span>
          </div>
          <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
            +12.5% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span>
          </span>
        </div>
        <p class="text-slate-500 text-sm font-medium">Total Postingan</p>
        <p class="text-3xl font-black text-slate-900 mt-1">1,284</p>
      </div>

      <!-- Terjadwal -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-amber-100 rounded-xl text-amber-600">
            <span class="material-symbols-outlined">schedule</span>
          </div>
          <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
            +5% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span>
          </span>
        </div>
        <p class="text-slate-500 text-sm font-medium">Terjadwal</p>
        <p class="text-3xl font-black text-slate-900 mt-1">42</p>
      </div>

      <!-- Sukses Terbit -->
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-4">
          <div class="p-3 bg-emerald-100 rounded-xl text-emerald-600">
            <span class="material-symbols-outlined">check_circle</span>
          </div>
          <span class="text-emerald-500 text-sm font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-lg">
            +10.2% <span class="material-symbols-outlined text-xs ml-0.5">trending_up</span>
          </span>
        </div>
        <p class="text-slate-500 text-sm font-medium">Sukses Terbit</p>
        <p class="text-3xl font-black text-slate-900 mt-1">1,230</p>
      </div>
    </div>

    <!-- Postingan Terbaru -->
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
              ${postings.map(p => `
              <tr class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="size-12 rounded-lg bg-slate-100 overflow-hidden">
                    <img class="w-full h-full object-cover" src="${p.media}" alt="Post thumbnail" />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm font-medium text-slate-900 max-w-xs truncate">${p.caption}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <p class="text-xs text-slate-500">${p.date}</p>
                  <p class="text-xs font-bold text-slate-700">${p.time}</p>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg w-fit">
                    <span class="material-symbols-outlined text-${p.platform === 'Instagram' ? 'blue-600' : 'primary'} text-lg">${p.platformIcon}</span>
                    <span class="text-xs font-semibold text-slate-700">${p.platform}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="${getStatusClass(p.status)}">${p.status}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end gap-2">
                    <button class="text-primary hover:text-blue-700 cursor-pointer"><span class="material-symbols-outlined">edit</span></button>
                    <button class="text-rose-500 hover:text-rose-700 cursor-pointer"><span class="material-symbols-outlined">delete</span></button>
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
}
