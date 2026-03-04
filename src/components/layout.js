import { navigate, getUser } from '../main.js';
import { api } from '../api.js';

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'link', label: 'Akun Terhubung', path: '/accounts' },
  { icon: 'add_box', label: 'Buat Postingan', path: '/create-posting' },
  { icon: 'calendar_month', label: 'Kalender', path: '/dashboard' },
  { icon: 'analytics', label: 'Statistik', path: '/dashboard' },
  { icon: 'download', label: 'Ekspor Data', path: '/export-data' },
  { icon: 'settings', label: 'Pengaturan', path: '/dashboard' },
  { icon: 'person', label: 'Profil', path: '/profile' },
];

export function renderLayout(app, pageTitle, contentHtml) {
  const currentPath = window.location.hash.slice(1) || '/dashboard';
  const user = getUser();

  app.innerHTML = `
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-72 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-2xl font-bold">rocket_launch</span>
          </div>
          <div class="flex flex-col">
            <h1 class="text-slate-900 text-lg font-bold leading-none">Waig Pilot</h1>
            <p class="text-slate-500 text-xs font-medium">Sistem Otomasi Konten</p>
          </div>
        </div>
      </div>

      <nav class="flex-1 px-4 py-2 space-y-1">
        ${navItems.map(item => `
          <a href="#${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''}">
            <span class="material-symbols-outlined">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        `).join('')}
      </nav>

      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3 p-2 rounded-lg bg-slate-50">
          <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
            ${user?.avatar
      ? `<img class="w-full h-full object-cover" src="${user.avatar}" alt="Avatar" />`
      : `<span class="material-symbols-outlined">person</span>`
    }
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 truncate">${user?.name || 'User'}</p>
            <p class="text-xs text-slate-500 truncate">${user?.role || 'User'}</p>
          </div>
          <button id="btn-logout" class="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-rose-500 cursor-pointer" title="Keluar">
            <span class="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Top Header -->
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
        <h2 class="text-xl font-bold text-slate-900">${pageTitle}</h2>
        <div class="flex items-center gap-4">
          <div class="relative">
            <span class="material-symbols-outlined text-slate-500 p-2 hover:bg-slate-100 rounded-full cursor-pointer">notifications</span>
            <span class="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <a href="#/create-posting" class="btn-primary">
            <span class="material-symbols-outlined text-sm">add</span>
            Postingan Baru
          </a>
        </div>
      </header>

      <div class="p-8 max-w-7xl mx-auto page-enter">
        ${contentHtml}
      </div>
    </main>
  </div>`;

  // Logout handler
  document.getElementById('btn-logout')?.addEventListener('click', async () => {
    await api.logout();
    navigate('/login');
  });
}
