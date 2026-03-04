import { renderLayout } from '../components/layout.js';
import { api } from '../api.js';

function genCal(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const today = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  let cells = '';
  for (let i = firstDay - 1; i >= 0; i--) cells += `<div class="text-center py-2 text-slate-300 text-sm">${prevDays - i}</div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    cells += `<div class="text-center py-2 text-sm font-medium cursor-pointer rounded-lg hover:bg-primary/10 transition-colors ${isToday ? 'bg-primary text-white hover:bg-primary' : 'text-slate-700'}">${d}</div>`;
  }
  const rem = (7 - ((firstDay + daysInMonth) % 7)) % 7;
  for (let i = 1; i <= rem; i++) cells += `<div class="text-center py-2 text-slate-300 text-sm">${i}</div>`;
  return `<div class="flex items-center justify-between mb-4"><button class="cal-nav p-1 hover:bg-slate-100 rounded cursor-pointer" data-dir="-1"><span class="material-symbols-outlined text-slate-500">chevron_left</span></button><h5 class="font-bold text-slate-900">${months[month]} ${year}</h5><button class="cal-nav p-1 hover:bg-slate-100 rounded cursor-pointer" data-dir="1"><span class="material-symbols-outlined text-slate-500">chevron_right</span></button></div><div class="grid grid-cols-7 gap-1 mb-2">${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => `<div class="text-center text-xs font-bold text-slate-400 py-1">${d}</div>`).join('')}</div><div class="grid grid-cols-7 gap-1">${cells}</div>`;
}

export async function exportDataPage(app) {
  renderLayout(app, 'Ekspor Data', '<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span></div>');

  let history;
  try { history = await api.getExportHistory(); } catch { history = []; }

  const fmtColor = (f) => { if (f === 'PDF') return 'bg-rose-100 text-rose-700'; if (f === 'XLSX') return 'bg-emerald-100 text-emerald-700'; return 'bg-primary/10 text-primary'; };

  const content = `
  <div class="space-y-6">
    <div class="space-y-1">
      <h3 class="text-3xl font-black text-slate-900 tracking-tight">Ekspor Data</h3>
      <p class="text-slate-500">Pilih jenis laporan, rentang waktu, dan format file untuk diunduh.</p>
    </div>
    <div id="export-msg" class="hidden p-4 rounded-xl text-sm font-medium"></div>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div class="lg:col-span-3 space-y-6">
        <div class="card">
          <div class="flex items-center gap-2 mb-4"><span class="material-symbols-outlined text-primary">description</span><h4 class="font-bold text-slate-900">1. Pilih Jenis Laporan</h4></div>
          <div class="grid grid-cols-3 gap-4">
            <label class="cursor-pointer"><input type="radio" name="report-type" value="postingan" class="hidden peer" checked /><div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300"><span class="material-symbols-outlined text-2xl text-primary mb-2">description</span><p class="font-bold text-sm text-slate-900">Laporan Postingan</p><p class="text-xs text-slate-500 mt-1">Ringkasan performa</p></div></label>
            <label class="cursor-pointer"><input type="radio" name="report-type" value="performa" class="hidden peer" /><div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300"><span class="material-symbols-outlined text-2xl text-slate-400 mb-2">bar_chart</span><p class="font-bold text-sm text-slate-900">Statistik Performa</p><p class="text-xs text-slate-500 mt-1">Metrik pertumbuhan</p></div></label>
            <label class="cursor-pointer"><input type="radio" name="report-type" value="aktivitas" class="hidden peer" /><div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 text-center transition-all hover:border-slate-300"><span class="material-symbols-outlined text-2xl text-slate-400 mb-2">history</span><p class="font-bold text-sm text-slate-900">Log Aktivitas</p><p class="text-xs text-slate-500 mt-1">Riwayat akses</p></div></label>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center gap-2 mb-4"><span class="material-symbols-outlined text-primary">tune</span><h4 class="font-bold text-slate-900">2. Filter & Platform</h4></div>
          <div class="grid grid-cols-2 gap-6">
            <div><label class="block text-sm font-bold text-slate-700 mb-3">Platform</label><div class="space-y-3"><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="rounded border-slate-300 text-primary" /><span class="text-sm text-slate-700">Facebook</span></label><label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="rounded border-slate-300 text-primary" /><span class="text-sm text-slate-700">Instagram</span></label></div></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-3">Format File</label><select id="export-format" class="input-field"><option value="CSV">CSV (.csv)</option><option value="XLSX">Excel (.xlsx)</option><option value="PDF">PDF (.pdf)</option></select></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-2 space-y-6">
        <div class="card"><div class="flex items-center gap-2 mb-4"><span class="material-symbols-outlined text-primary">calendar_today</span><h4 class="font-bold text-slate-900">3. Rentang Waktu</h4></div><div id="calendar-container">${genCal(2024, 4)}</div></div>
        <button id="export-btn" class="btn-primary w-full justify-center py-3.5 text-base shadow-lg shadow-primary/25"><span class="material-symbols-outlined">download</span><span id="export-btn-text">Generate & Ekspor</span></button>
      </div>
    </div>
    <div class="space-y-4">
      <h3 class="text-xl font-bold text-slate-900">Riwayat Ekspor Terakhir</h3>
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead><tr class="bg-slate-50 border-b border-slate-200"><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Laporan</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rentang</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Format</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th><th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th></tr></thead>
          <tbody id="export-history" class="divide-y divide-slate-100">
            ${history.map(e => `<tr class="hover:bg-slate-50"><td class="px-6 py-4 text-sm font-medium text-slate-900">${e.name}</td><td class="px-6 py-4 text-sm text-slate-500">${e.range}</td><td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-bold rounded-lg ${fmtColor(e.format)}">${e.format}</span></td><td class="px-6 py-4"><span class="flex items-center gap-1.5 text-sm text-slate-700"><span class="size-2 ${e.status === 'Selesai' ? 'bg-emerald-500' : 'bg-slate-400'} rounded-full"></span>${e.status}</span></td><td class="px-6 py-4 text-right"><button class="text-sm font-semibold ${e.status === 'Selesai' ? 'text-primary hover:underline' : 'text-slate-400'} cursor-pointer">${e.status === 'Selesai' ? 'Unduh' : 'Tunggu'}</button></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

  renderLayout(app, 'Ekspor Data', content);

  // Calendar nav
  let cY = 2024, cM = 4;
  document.getElementById('calendar-container')?.addEventListener('click', (e) => {
    const b = e.target.closest('.cal-nav');
    if (b) { cM += parseInt(b.dataset.dir); if (cM > 11) { cM = 0; cY++; } if (cM < 0) { cM = 11; cY--; } document.getElementById('calendar-container').innerHTML = genCal(cY, cM); }
  });

  // Export button
  document.getElementById('export-btn')?.addEventListener('click', async () => {
    const reportType = document.querySelector('input[name="report-type"]:checked')?.value;
    const format = document.getElementById('export-format').value;
    const btn = document.getElementById('export-btn');
    const txt = document.getElementById('export-btn-text');
    const msgEl = document.getElementById('export-msg');

    btn.disabled = true; txt.textContent = 'Memproses...';
    try {
      await api.createExport({ report_type: reportType, format, platforms: ['Facebook', 'Instagram'], date_from: new Date(cY, cM, 1).toISOString(), date_to: new Date(cY, cM + 1, 0).toISOString() });
      msgEl.textContent = '✅ Ekspor berhasil dimulai! Status akan berubah menjadi "Selesai" dalam beberapa detik.';
      msgEl.className = 'p-4 rounded-xl text-sm font-medium bg-emerald-50 border border-emerald-200 text-emerald-700';
      msgEl.classList.remove('hidden');
      setTimeout(() => exportDataPage(app), 4000);
    } catch (err) {
      msgEl.textContent = err.message;
      msgEl.className = 'p-4 rounded-xl text-sm font-medium bg-rose-50 border border-rose-200 text-rose-600';
      msgEl.classList.remove('hidden');
    } finally { btn.disabled = false; txt.textContent = 'Generate & Ekspor'; }
  });
}
