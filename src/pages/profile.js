import { renderLayout } from '../components/layout.js';
import { getUser } from '../main.js';
import { api } from '../api.js';

export async function profilePage(app) {
  renderLayout(app, 'Detail Profil', '<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span></div>');

  let user;
  try {
    user = await api.getProfile();
  } catch (err) {
    renderLayout(app, 'Detail Profil', `<div class="text-center py-20 text-rose-500">Gagal memuat: ${err.message}</div>`);
    return;
  }

  const createdDate = user.created_at ? new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Januari 2023';

  const content = `
  <div class="space-y-6">
    <div id="profile-message" class="hidden p-4 rounded-xl text-sm font-medium"></div>
    <div class="card flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div class="relative">
        <div class="size-24 rounded-2xl overflow-hidden bg-slate-100">
          <img src="${user.avatar || ''}" class="w-full h-full object-cover" alt="Profile" />
        </div>
        <button class="absolute -bottom-1 -right-1 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer"><span class="material-symbols-outlined text-base">photo_camera</span></button>
      </div>
      <div class="flex-1">
        <h3 class="text-2xl font-black text-slate-900">${user.name}</h3>
        <p class="text-slate-500">${user.email}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="badge-info uppercase text-xs tracking-wider">${user.role}</span>
          <span class="text-xs text-slate-400">Aktif sejak ${createdDate}</span>
        </div>
      </div>
      <button id="save-profile" class="btn-primary"><span class="material-symbols-outlined text-sm">save</span>Simpan Perubahan</button>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="card">
          <div class="flex items-center gap-2 mb-6"><span class="material-symbols-outlined text-primary">person</span><h4 class="font-bold text-slate-900 text-lg">Informasi Pribadi</h4></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label><input id="profile-name" class="input-field" value="${user.name}" /></div>
            <div><label class="block text-sm font-bold text-slate-700 mb-2">Email Utama</label><input id="profile-email" class="input-field" value="${user.email}" /></div>
          </div>
          <div class="mt-5"><label class="block text-sm font-bold text-slate-700 mb-2">Bio Singkat</label><textarea id="profile-bio" class="input-field resize-y" rows="3">${user.bio || ''}</textarea></div>
        </div>
        <div class="card">
          <div class="flex items-center gap-2 mb-6"><span class="material-symbols-outlined text-primary">lock</span><h4 class="font-bold text-slate-900 text-lg">Keamanan Akun</h4></div>
          <div class="space-y-5">
            <div><label class="block text-sm font-bold text-slate-700 mb-2">Kata Sandi Lama</label><input type="password" id="old-pw" class="input-field" placeholder="Masukkan kata sandi lama" /></div>
            <div class="grid grid-cols-2 gap-5">
              <div><label class="block text-sm font-bold text-slate-700 mb-2">Kata Sandi Baru</label><input type="password" id="new-pw" class="input-field" placeholder="Kata sandi baru" /></div>
              <div><label class="block text-sm font-bold text-slate-700 mb-2">Konfirmasi</label><input type="password" id="conf-pw" class="input-field" placeholder="Ulangi" /></div>
            </div>
            <button id="change-pw-btn" class="flex items-center gap-2 text-primary text-sm font-semibold hover:underline cursor-pointer"><span class="material-symbols-outlined text-lg">security</span>Ubah Password</button>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <div class="card">
          <div class="flex items-center gap-2 mb-6"><span class="material-symbols-outlined text-primary">notifications</span><h4 class="font-bold text-slate-900 text-lg">Preferensi Notifikasi</h4></div>
          <div class="space-y-5">
            <div class="flex items-center justify-between"><div><p class="font-semibold text-sm text-slate-900">Notifikasi Email</p><p class="text-xs text-slate-500">Terima laporan mingguan</p></div><button class="toggle-switch active"><span class="toggle-dot"></span></button></div>
            <div class="flex items-center justify-between"><div><p class="font-semibold text-sm text-slate-900">Pemberitahuan Sistem</p><p class="text-xs text-slate-500">Peringatan login baru</p></div><button class="toggle-switch active"><span class="toggle-dot"></span></button></div>
            <div class="flex items-center justify-between"><div><p class="font-semibold text-sm text-slate-900">Update Keamanan</p><p class="text-xs text-slate-500">Pembaruan patch</p></div><button class="toggle-switch"><span class="toggle-dot"></span></button></div>
          </div>
        </div>
        <div class="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
          <div class="flex items-center gap-2 mb-3"><span class="material-symbols-outlined text-rose-500">warning</span><h4 class="font-bold text-rose-700 text-lg">Area Berbahaya</h4></div>
          <p class="text-sm text-rose-600 mb-4">Setelah dihapus, semua data akan hilang permanen.</p>
          <button class="w-full py-2.5 rounded-xl border border-rose-300 bg-white text-rose-600 font-bold text-sm hover:bg-rose-100 cursor-pointer">Hapus Akun Saya</button>
        </div>
      </div>
    </div>
  </div>`;

  renderLayout(app, 'Detail Profil', content);

  const msgEl = document.getElementById('profile-message');
  function showMsg(text, ok) {
    msgEl.textContent = text;
    msgEl.className = `p-4 rounded-xl text-sm font-medium ${ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-600'}`;
    msgEl.classList.remove('hidden');
  }

  document.getElementById('save-profile')?.addEventListener('click', async () => {
    try {
      await api.updateProfile({ name: document.getElementById('profile-name').value, email: document.getElementById('profile-email').value, bio: document.getElementById('profile-bio').value });
      showMsg('✅ Profil berhasil disimpan!', true);
    } catch (e) { showMsg(e.message, false); }
  });

  document.getElementById('change-pw-btn')?.addEventListener('click', async () => {
    const o = document.getElementById('old-pw').value, n = document.getElementById('new-pw').value, c = document.getElementById('conf-pw').value;
    if (!o || !n) return alert('Isi password lama dan baru');
    if (n !== c) return alert('Konfirmasi tidak cocok');
    try { await api.changePassword(o, n); showMsg('✅ Password berhasil diubah!', true); } catch (e) { alert(e.message); }
  });

  document.querySelectorAll('.toggle-switch').forEach(b => b.addEventListener('click', () => b.classList.toggle('active')));
}
