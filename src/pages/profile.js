import { renderLayout } from '../components/layout.js';
import { getUser } from '../main.js';

export function profilePage(app) {
    const user = getUser();

    const content = `
  <div class="space-y-6">
    <!-- Profile Header Card -->
    <div class="card flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <div class="relative">
        <div class="size-24 rounded-2xl overflow-hidden bg-slate-100">
          <img src="${user?.avatar || 'https://picsum.photos/200'}" class="w-full h-full object-cover" alt="Profile" />
        </div>
        <button class="absolute -bottom-1 -right-1 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary/90 transition-colors">
          <span class="material-symbols-outlined text-base">photo_camera</span>
        </button>
      </div>
      <div class="flex-1">
        <h3 class="text-2xl font-black text-slate-900">${user?.name || 'Andi Pratama'}</h3>
        <p class="text-slate-500">${user?.email || 'andi.pratama@company.com'}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="badge-info uppercase text-xs tracking-wider">Administrator</span>
          <span class="text-xs text-slate-400">Aktif sejak Januari 2023</span>
        </div>
      </div>
      <button class="btn-primary">
        <span class="material-symbols-outlined text-sm">save</span>
        Simpan Perubahan
      </button>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Informasi Pribadi -->
        <div class="card">
          <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-primary">person</span>
            <h4 class="font-bold text-slate-900 text-lg">Informasi Pribadi</h4>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <input type="text" class="input-field" value="${user?.name || 'Andi Pratama'}" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Email Utama</label>
              <input type="email" class="input-field" value="${user?.email || 'andi.pratama@company.com'}" />
            </div>
          </div>
          <div class="mt-5">
            <label class="block text-sm font-bold text-slate-700 mb-2">Bio Singkat</label>
            <textarea class="input-field resize-y" rows="3">${user?.bio || 'Administrator berpengalaman yang mengelola infrastruktur IT dan operasional sistem harian.'}</textarea>
          </div>
        </div>

        <!-- Keamanan Akun -->
        <div class="card">
          <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-primary">lock</span>
            <h4 class="font-bold text-slate-900 text-lg">Keamanan Akun</h4>
          </div>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Kata Sandi Lama</label>
              <input type="password" class="input-field" value="••••••••" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Kata Sandi Baru</label>
                <input type="password" class="input-field" placeholder="Masukkan kata sandi baru" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                <input type="password" class="input-field" placeholder="Ulangi kata sandi baru" />
              </div>
            </div>
            <button class="flex items-center gap-2 text-primary text-sm font-semibold hover:underline cursor-pointer">
              <span class="material-symbols-outlined text-lg">security</span>
              Aktifkan Otentikasi Dua Faktor (2FA)
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Preferensi Notifikasi -->
        <div class="card">
          <div class="flex items-center gap-2 mb-6">
            <span class="material-symbols-outlined text-primary">notifications</span>
            <h4 class="font-bold text-slate-900 text-lg">Preferensi Notifikasi</h4>
          </div>
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-sm text-slate-900">Notifikasi Email</p>
                <p class="text-xs text-slate-500">Terima laporan mingguan</p>
              </div>
              <button class="toggle-switch active" data-toggle="email-notif">
                <span class="toggle-dot"></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-sm text-slate-900">Pemberitahuan Sistem</p>
                <p class="text-xs text-slate-500">Peringatan login baru</p>
              </div>
              <button class="toggle-switch active" data-toggle="system-notif">
                <span class="toggle-dot"></span>
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="font-semibold text-sm text-slate-900">Update Keamanan</p>
                <p class="text-xs text-slate-500">Pembaruan patch penting</p>
              </div>
              <button class="toggle-switch" data-toggle="security-update">
                <span class="toggle-dot"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Area Berbahaya -->
        <div class="bg-rose-50 border border-rose-200 p-6 rounded-2xl">
          <div class="flex items-center gap-2 mb-3">
            <span class="material-symbols-outlined text-rose-500">warning</span>
            <h4 class="font-bold text-rose-700 text-lg">Area Berbahaya</h4>
          </div>
          <p class="text-sm text-rose-600 leading-relaxed mb-4">
            Setelah Anda menghapus akun, semua data akan hilang secara permanen. Mohon berhati-hati.
          </p>
          <button class="w-full py-2.5 rounded-xl border border-rose-300 bg-white text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors cursor-pointer">
            Hapus Akun Saya
          </button>
        </div>
      </div>
    </div>
  </div>`;

    renderLayout(app, 'Detail Profil', content);

    // Toggle switches
    document.querySelectorAll('.toggle-switch').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
        });
    });
}
