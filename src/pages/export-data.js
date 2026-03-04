import { renderLayout } from '../components/layout.js';

const exportHistory = [
    { name: 'Laporan Postingan Mei.pdf', range: '01/05/2024 - 31/05/2024', format: 'PDF', formatColor: 'bg-rose-100 text-rose-700', status: 'Selesai', statusDot: 'bg-emerald-500', action: 'Unduh' },
    { name: 'Statistik Performa Q1.xlsx', range: '01/01/2024 - 31/03/2024', format: 'XLSX', formatColor: 'bg-emerald-100 text-emerald-700', status: 'Selesai', statusDot: 'bg-emerald-500', action: 'Unduh' },
    { name: 'Log Aktivitas Mingguan.csv', range: '15/05/2024 - 22/05/2024', format: 'CSV', formatColor: 'bg-primary/10 text-primary', status: 'Diproses', statusDot: 'bg-slate-400', action: 'Tunggu' },
];

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevDays = new Date(year, month, 0).getDate();
    const today = new Date();

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    let cells = '';
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
        cells += `<div class="text-center py-2 text-slate-300 text-sm">${prevDays - i}</div>`;
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
        cells += `<div class="text-center py-2 text-sm font-medium cursor-pointer rounded-lg hover:bg-primary/10 transition-colors ${isToday ? 'bg-primary text-white hover:bg-primary' : 'text-slate-700'}">${d}</div>`;
    }
    // Fill remaining (up to 42 cells)
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
        cells += `<div class="text-center py-2 text-slate-300 text-sm">${i}</div>`;
    }

    return `
    <div class="flex items-center justify-between mb-4">
      <button class="cal-nav p-1 hover:bg-slate-100 rounded cursor-pointer" data-dir="-1">
        <span class="material-symbols-outlined text-slate-500">chevron_left</span>
      </button>
      <h5 class="font-bold text-slate-900">${months[month]} ${year}</h5>
      <button class="cal-nav p-1 hover:bg-slate-100 rounded cursor-pointer" data-dir="1">
        <span class="material-symbols-outlined text-slate-500">chevron_right</span>
      </button>
    </div>
    <div class="grid grid-cols-7 gap-1 mb-2">
      ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="text-center text-xs font-bold text-slate-400 py-1">${d}</div>`).join('')}
    </div>
    <div class="grid grid-cols-7 gap-1">
      ${cells}
    </div>
  `;
}

export function exportDataPage(app) {
    const content = `
  <div class="space-y-6">
    <!-- Header -->
    <div class="space-y-1">
      <h3 class="text-3xl font-black text-slate-900 tracking-tight">Ekspor Data</h3>
      <p class="text-slate-500">Pilih jenis laporan, rentang waktu, dan format file untuk diunduh.</p>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Step 1: Pilih Jenis Laporan -->
        <div class="card">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary">description</span>
            <h4 class="font-bold text-slate-900">1. Pilih Jenis Laporan</h4>
          </div>
          <div class="grid grid-cols-3 gap-4">
            <label class="cursor-pointer">
              <input type="radio" name="report-type" value="postingan" class="hidden peer" checked />
              <div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300">
                <span class="material-symbols-outlined text-2xl text-primary mb-2">description</span>
                <p class="font-bold text-sm text-slate-900">Laporan Postingan</p>
                <p class="text-xs text-slate-500 mt-1">Ringkasan performa konten</p>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="report-type" value="performa" class="hidden peer" />
              <div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300">
                <span class="material-symbols-outlined text-2xl text-slate-400 mb-2">bar_chart</span>
                <p class="font-bold text-sm text-slate-900">Statistik Performa</p>
                <p class="text-xs text-slate-500 mt-1">Metrik pertumbuhan akun</p>
              </div>
            </label>
            <label class="cursor-pointer">
              <input type="radio" name="report-type" value="aktivitas" class="hidden peer" />
              <div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300">
                <span class="material-symbols-outlined text-2xl text-slate-400 mb-2">history</span>
                <p class="font-bold text-sm text-slate-900">Log Aktivitas Akun</p>
                <p class="text-xs text-slate-500 mt-1">Riwayat akses dan perubahan</p>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Filter & Platform -->
        <div class="card">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary">tune</span>
            <h4 class="font-bold text-slate-900">2. Filter & Platform</h4>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-3">Platform Sosial Media</label>
              <div class="space-y-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked class="rounded border-slate-300 text-primary focus:ring-primary/30" />
                  <span class="text-sm text-slate-700">Facebook</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked class="rounded border-slate-300 text-primary focus:ring-primary/30" />
                  <span class="text-sm text-slate-700">Instagram</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-3">Format File</label>
              <select class="input-field">
                <option>CSV (.csv)</option>
                <option>Excel (.xlsx)</option>
                <option>PDF (.pdf)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Step 3: Rentang Waktu -->
        <div class="card">
          <div class="flex items-center gap-2 mb-4">
            <span class="material-symbols-outlined text-primary">calendar_today</span>
            <h4 class="font-bold text-slate-900">3. Rentang Waktu</h4>
          </div>
          <div id="calendar-container">
            ${generateCalendar(2024, 4)}
          </div>
        </div>

        <!-- Generate Button -->
        <button class="btn-primary w-full justify-center py-3.5 text-base shadow-lg shadow-primary/25">
          <span class="material-symbols-outlined">download</span>
          Generate & Ekspor
        </button>
      </div>
    </div>

    <!-- Riwayat Ekspor -->
    <div class="space-y-4">
      <h3 class="text-xl font-bold text-slate-900">Riwayat Ekspor Terakhir</h3>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Laporan</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rentang Waktu</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Format</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${exportHistory.map(e => `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-slate-900">${e.name}</td>
              <td class="px-6 py-4 text-sm text-slate-500">${e.range}</td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 text-xs font-bold rounded-lg ${e.formatColor}">${e.format}</span>
              </td>
              <td class="px-6 py-4">
                <span class="flex items-center gap-1.5 text-sm text-slate-700">
                  <span class="size-2 ${e.statusDot} rounded-full"></span>
                  ${e.status}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-sm font-semibold ${e.action === 'Unduh' ? 'text-primary hover:underline' : 'text-slate-400'} cursor-pointer">${e.action}</button>
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

    renderLayout(app, 'Ekspor Data', content);

    // Calendar navigation
    let calYear = 2024, calMonth = 4;
    const calContainer = document.getElementById('calendar-container');

    calContainer?.addEventListener('click', (e) => {
        const navBtn = e.target.closest('.cal-nav');
        if (navBtn) {
            const dir = parseInt(navBtn.dataset.dir);
            calMonth += dir;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            if (calMonth < 0) { calMonth = 11; calYear--; }
            calContainer.innerHTML = generateCalendar(calYear, calMonth);
        }
    });
}
