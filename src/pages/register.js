import { navigate } from '../main.js';

export function registerPage(app) {
    app.innerHTML = `
  <div class="min-h-screen bg-white">
    <!-- Top Bar -->
    <header class="h-14 border-b border-slate-200 flex items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <div class="size-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-lg">sync</span>
        </div>
        <span class="font-bold text-slate-900">Meta Automation</span>
      </div>
      <button onclick="location.hash='#/login'" class="size-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 cursor-pointer">
        <span class="material-symbols-outlined text-slate-500">help_outline</span>
      </button>
    </header>

    <!-- Content -->
    <div class="flex items-center justify-center py-12 px-4 bg-gradient-to-b from-white to-background-light min-h-[calc(100vh-3.5rem)]">
      <div class="w-full max-w-lg">
        <div class="card p-8" style="border-radius: 20px;">
          <h2 class="text-2xl font-black text-center text-slate-900 mb-2">Daftar Akun Baru</h2>
          <p class="text-slate-500 text-center text-sm mb-8">Silakan lengkapi formulir di bawah ini untuk memulai otomatisasi Anda.</p>

          <form id="register-form" class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label>
              <div class="input-group">
                <span class="input-icon"><span class="material-symbols-outlined text-xl">person</span></span>
                <input type="text" placeholder="Masukkan nama lengkap Anda" required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <div class="input-group">
                <span class="input-icon"><span class="material-symbols-outlined text-xl">mail</span></span>
                <input type="email" placeholder="contoh@email.com" required />
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <div class="input-group">
                <span class="input-icon"><span class="material-symbols-outlined text-xl">lock</span></span>
                <input type="password" id="reg-password" placeholder="Masukkan password" required />
                <button type="button" class="toggle-pw px-3 text-slate-400 hover:text-slate-600 cursor-pointer" data-target="reg-password">
                  <span class="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Konfirmasi Password</label>
              <div class="input-group">
                <span class="input-icon"><span class="material-symbols-outlined text-xl">lock_reset</span></span>
                <input type="password" id="reg-confirm" placeholder="Ulangi password" required />
                <button type="button" class="toggle-pw px-3 text-slate-400 hover:text-slate-600 cursor-pointer" data-target="reg-confirm">
                  <span class="material-symbols-outlined text-xl">visibility</span>
                </button>
              </div>
            </div>

            <button type="submit" class="btn-primary w-full justify-center py-3 text-base">
              Daftar Sekarang
            </button>
          </form>

          <hr class="my-6 border-slate-200" />

          <p class="text-center text-sm text-slate-500">
            Sudah punya akun? <a href="#/login" class="text-primary font-bold hover:underline">Masuk di sini</a>
          </p>
        </div>

        <p class="text-center text-xs text-slate-400 mt-6">© 2024 Meta Automation. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </div>`;

    // Register form
    document.getElementById('register-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registrasi berhasil! Silakan login.');
        navigate('/login');
    });

    // Password toggles
    document.querySelectorAll('.toggle-pw').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            const icon = btn.querySelector('.material-symbols-outlined');
            if (target.type === 'password') {
                target.type = 'text';
                icon.textContent = 'visibility_off';
            } else {
                target.type = 'password';
                icon.textContent = 'visibility';
            }
        });
    });
}
