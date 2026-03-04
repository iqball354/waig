import { renderLayout } from '../components/layout.js';

export function createPostingPage(app) {
    const content = `
  <div class="space-y-6">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-sm">
      <a href="#/dashboard" class="text-primary hover:underline">Dashboard</a>
      <span class="material-symbols-outlined text-slate-400 text-base">chevron_right</span>
      <span class="text-slate-500 font-semibold">Buat Postingan Baru</span>
    </div>

    <!-- Header -->
    <div class="space-y-1">
      <h3 class="text-3xl font-black text-slate-900 tracking-tight">Buat Postingan Baru</h3>
      <p class="text-slate-500">Kelola konten dan jadwalkan postingan ke berbagai platform media sosial Anda.</p>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- Left Column: Form -->
      <div class="lg:col-span-3 space-y-6">
        <!-- Pilih Platform -->
        <div class="card">
          <h4 class="font-bold text-slate-900 mb-4">Pilih Platform</h4>
          <div class="grid grid-cols-2 gap-4">
            <label class="platform-card relative cursor-pointer">
              <input type="checkbox" name="platform" value="facebook" class="hidden peer" checked />
              <div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 flex items-center justify-center gap-3 transition-all">
                <span class="material-symbols-outlined text-primary text-2xl">social_leaderboard</span>
                <span class="font-semibold text-slate-700">Facebook</span>
              </div>
            </label>
            <label class="platform-card relative cursor-pointer">
              <input type="checkbox" name="platform" value="instagram" class="hidden peer" checked />
              <div class="border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary/5 rounded-xl p-4 flex items-center justify-center gap-3 transition-all">
                <span class="material-symbols-outlined text-blue-600 text-2xl">photo_camera</span>
                <span class="font-semibold text-slate-700">Instagram</span>
              </div>
            </label>
          </div>
        </div>

        <!-- Unggah Media -->
        <div class="card">
          <h4 class="font-bold text-slate-900 mb-4">Unggah Media</h4>
          <div id="drop-zone" class="border-2 border-dashed border-slate-300 hover:border-primary rounded-xl p-12 text-center cursor-pointer transition-colors">
            <div id="upload-placeholder">
              <span class="material-symbols-outlined text-5xl text-primary/60 mb-3">cloud_upload</span>
              <p class="text-slate-600 font-medium">Klik untuk unggah atau seret file ke sini</p>
              <p class="text-sm text-slate-400 mt-1">Mendukung format JPG, PNG, atau MP4 (Maks. 50MB)</p>
            </div>
            <div id="upload-preview" class="hidden">
              <img id="preview-img" class="max-h-48 mx-auto rounded-lg" />
              <p id="preview-name" class="text-sm text-slate-600 mt-2 font-medium"></p>
              <button id="remove-upload" class="text-rose-500 text-sm font-semibold mt-2 hover:underline cursor-pointer">Hapus</button>
            </div>
            <input type="file" id="file-input" accept="image/jpeg,image/png,video/mp4" class="hidden" />
          </div>
        </div>

        <!-- Caption -->
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-900">Caption Postingan</h4>
            <div class="flex items-center gap-2 text-slate-400">
              <button class="hover:text-primary cursor-pointer p-1" title="Emoji"><span class="material-symbols-outlined text-xl">mood</span></button>
              <button class="hover:text-primary cursor-pointer p-1" title="Hashtag"><span class="material-symbols-outlined text-xl">tag</span></button>
              <button class="hover:text-primary cursor-pointer p-1" title="Lokasi"><span class="material-symbols-outlined text-xl">location_on</span></button>
            </div>
          </div>
          <textarea id="caption-input" class="input-field resize-y" rows="5" placeholder="Tuliskan caption menarik di sini..." maxlength="2200"></textarea>
          <p class="text-xs text-slate-400 text-right mt-2"><span id="char-count">0</span> / 2200 karakter</p>
        </div>

        <!-- Jadwal Publikasi -->
        <div class="card">
          <h4 class="font-bold text-slate-900 mb-4">Jadwal Publikasi</h4>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Tanggal</label>
              <input type="date" class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-700 mb-2">Waktu (WIB)</label>
              <input type="time" class="input-field" />
            </div>
          </div>
          <button class="btn-primary w-full justify-center mt-6 py-3">
            <span class="material-symbols-outlined">schedule_send</span>
            Jadwalkan Postingan
          </button>
        </div>
      </div>

      <!-- Right Column: Preview -->
      <div class="lg:col-span-2">
        <div class="card sticky top-24">
          <div class="flex items-center justify-between mb-4">
            <h4 class="font-bold text-slate-900">Pratinjau Postingan</h4>
            <div class="flex bg-slate-100 rounded-lg p-0.5">
              <button id="preview-fb" class="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-primary shadow-sm transition-all cursor-pointer">Facebook</button>
              <button id="preview-ig" class="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-700 transition-all cursor-pointer">Instagram</button>
            </div>
          </div>

          <!-- Facebook Preview -->
          <div id="fb-preview" class="border border-slate-200 rounded-xl overflow-hidden">
            <div class="p-4">
              <div class="flex items-center gap-3">
                <div class="size-10 rounded-full bg-primary/20 overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuALU4Q28EP7AJxictBV8yF-8wlW4_IaczsEyB_5l10Ug2vOVeXCNROxPcBUFsluKNMJxa_WxnwlaVZcezsWRs_4AKXXbdH52pD7Wx-VtuZ2UCRBFRgkTwGgx-oByf6NN2FMvMItFIwhSHxdJxNp026OxUcLTN-Lq7k9cfh6DoM-s1_1-G_RYe6s9BpcpXM2fQUPK8eV7Ugz6ad9cTyxjj2j9RH8krJ5Lzj0qiEfZnMjkV58UxZn-nMZZIVZPV817u7LXQWTeXX4cUk" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-bold text-sm text-slate-900">Brand Anda</p>
                  <p class="text-xs text-slate-400">Baru saja · <span class="material-symbols-outlined text-xs">public</span></p>
                </div>
                <span class="material-symbols-outlined text-slate-400">more_horiz</span>
              </div>
              <p id="preview-caption" class="text-sm text-slate-700 mt-3 leading-relaxed">
                Pratinjau caption Anda akan tampil di sini saat Anda mulai mengetik. Coba tambahkan teks untuk melihat hasilnya...
              </p>
            </div>
            <div id="preview-media-container" class="bg-slate-100 aspect-video flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-slate-300">image</span>
            </div>
            <div class="p-3 border-t border-slate-100">
              <div class="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                <span>👍 0</span>
                <span>0 Komentar · 0 Kali dibagikan</span>
              </div>
              <div class="grid grid-cols-3 gap-2">
                <button class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-100 text-sm text-slate-500 font-medium cursor-pointer">
                  <span class="material-symbols-outlined text-lg">thumb_up</span> Suka
                </button>
                <button class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-100 text-sm text-slate-500 font-medium cursor-pointer">
                  <span class="material-symbols-outlined text-lg">chat_bubble</span> Komentar
                </button>
                <button class="flex items-center justify-center gap-1.5 py-1.5 rounded-lg hover:bg-slate-100 text-sm text-slate-500 font-medium cursor-pointer">
                  <span class="material-symbols-outlined text-lg">share</span> Bagikan
                </button>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="mt-4 flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-xl p-3">
            <span class="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
            <p class="text-xs text-primary/80 leading-relaxed italic">Tampilan mungkin sedikit berbeda pada aplikasi mobile sebenarnya.</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;

    renderLayout(app, 'Buat Postingan Baru', content);

    // Caption character count + live preview
    const captionInput = document.getElementById('caption-input');
    const charCount = document.getElementById('char-count');
    const previewCaption = document.getElementById('preview-caption');

    captionInput?.addEventListener('input', () => {
        charCount.textContent = captionInput.value.length;
        previewCaption.textContent = captionInput.value || 'Pratinjau caption Anda akan tampil di sini saat Anda mulai mengetik. Coba tambahkan teks untuk melihat hasilnya...';
    });

    // File upload
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const placeholder = document.getElementById('upload-placeholder');
    const preview = document.getElementById('upload-preview');
    const previewImg = document.getElementById('preview-img');
    const previewName = document.getElementById('preview-name');
    const previewMediaContainer = document.getElementById('preview-media-container');

    dropZone?.addEventListener('click', () => fileInput.click());
    dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('border-primary', 'bg-primary/5'); });
    dropZone?.addEventListener('dragleave', () => { dropZone.classList.remove('border-primary', 'bg-primary/5'); });
    dropZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('border-primary', 'bg-primary/5');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput?.addEventListener('change', () => { if (fileInput.files.length) handleFile(fileInput.files[0]); });

    function handleFile(file) {
        if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            previewImg.src = url;
            previewName.textContent = file.name;
            placeholder.classList.add('hidden');
            preview.classList.remove('hidden');
            previewMediaContainer.innerHTML = `<img src="${url}" class="w-full h-full object-cover" />`;
        }
    }

    document.getElementById('remove-upload')?.addEventListener('click', (e) => {
        e.stopPropagation();
        placeholder.classList.remove('hidden');
        preview.classList.add('hidden');
        fileInput.value = '';
        previewMediaContainer.innerHTML = '<span class="material-symbols-outlined text-4xl text-slate-300">image</span>';
    });

    // Preview tab toggle
    const fbBtn = document.getElementById('preview-fb');
    const igBtn = document.getElementById('preview-ig');
    fbBtn?.addEventListener('click', () => {
        fbBtn.classList.add('bg-white', 'text-primary', 'shadow-sm');
        fbBtn.classList.remove('text-slate-500');
        igBtn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
        igBtn.classList.add('text-slate-500');
    });
    igBtn?.addEventListener('click', () => {
        igBtn.classList.add('bg-white', 'text-primary', 'shadow-sm');
        igBtn.classList.remove('text-slate-500');
        fbBtn.classList.remove('bg-white', 'text-primary', 'shadow-sm');
        fbBtn.classList.add('text-slate-500');
    });
}
