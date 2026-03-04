export function forgotPasswordPage(app) {
    app.innerHTML = `
  <div class="min-h-screen bg-white">
    <!-- Top Bar -->
    <header class="h-14 border-b border-slate-200 flex items-center justify-between px-6">
      <div class="flex items-center gap-2">
        <div class="size-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
          <span class="material-symbols-outlined text-lg">lock</span>
        </div>
        <span class="font-bold text-slate-900">Aplikasi</span>
      </div>
      <a href="#/login" class="size-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50">
        <span class="material-symbols-outlined text-slate-500">arrow_back</span>
      </a>
    </header>

    <!-- Content -->
    <div class="flex items-center justify-center py-16 px-4 bg-gradient-to-b from-white to-background-light min-h-[calc(100vh-3.5rem)]">
      <div class="w-full max-w-md">
        <div class="card p-8" style="border-radius: 20px;">
          <div class="text-center mb-6">
            <div class="inline-flex items-center justify-center size-16 bg-primary/10 text-primary rounded-full mb-4">
              <span class="material-symbols-outlined text-3xl">grid_view</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 mb-2">Lupa Kata Sandi?</h2>
            <p class="text-slate-500 text-sm leading-relaxed">
              Jangan khawatir, ini terjadi pada siapa saja. Masukkan email Anda untuk mendapatkan tautan pemulihan.
            </p>
          </div>

          <form id="forgot-form" class="mt-6">
            <div class="mb-6">
              <label class="block text-sm font-bold text-slate-700 mb-2">Alamat Email</label>
              <div class="input-group">
                <span class="input-icon"><span class="material-symbols-outlined text-xl">mail</span></span>
                <input type="email" placeholder="nama@email.com" required />
              </div>
            </div>

            <button type="submit" class="btn-primary w-full justify-center py-3 text-base">
              Kirim Tautan Pemulihan
              <span class="material-symbols-outlined text-xl">send</span>
            </button>
          </form>

          <div class="mt-6 text-center space-y-2">
            <p class="text-sm text-slate-500">
              Ingat kata sandi Anda? <a href="#/login" class="text-primary font-bold hover:underline">Masuk di sini</a>
            </p>
            <a href="#" class="text-sm text-slate-400 hover:text-primary underline">Butuh bantuan lainnya?</a>
          </div>
        </div>

        <p class="text-center text-xs text-slate-400 mt-6">© 2024 Aplikasi. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  </div>`;

    document.getElementById('forgot-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Tautan pemulihan telah dikirim ke email Anda!');
    });
}
