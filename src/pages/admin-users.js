import { renderLayout } from '../components/layout.js';
import { api } from '../api.js';

export async function adminUsersPage(app) {
    renderLayout(app, 'Kelola User', '<div class="flex items-center justify-center py-20"><span class="material-symbols-outlined text-4xl text-slate-300 animate-spin">progress_activity</span></div>');

    let users, globalStats;
    try {
        [users, globalStats] = await Promise.all([
            api._fetch('/api/admin/users'),
            api._fetch('/api/admin/stats'),
        ]);
    } catch (err) {
        renderLayout(app, 'Kelola User', `<div class="text-center py-20 text-rose-500">${err.message}</div>`);
        return;
    }

    const content = `
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
      <div>
        <h3 class="text-3xl font-black text-slate-900 tracking-tight">Kelola User</h3>
        <p class="text-slate-500">Kelola semua pengguna platform Waig Pilot.</p>
      </div>
      <button id="add-user-btn" class="btn-primary"><span class="material-symbols-outlined text-sm">person_add</span>Tambah User Baru</button>
    </div>

    <!-- Global Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="card text-center"><p class="text-2xl font-black text-primary">${globalStats.total_users || 0}</p><p class="text-xs text-slate-500 font-semibold">Total User</p></div>
      <div class="card text-center"><p class="text-2xl font-black text-emerald-600">${globalStats.active_users || 0}</p><p class="text-xs text-slate-500 font-semibold">User Aktif</p></div>
      <div class="card text-center"><p class="text-2xl font-black text-blue-600">${globalStats.total_postings || 0}</p><p class="text-xs text-slate-500 font-semibold">Total Postingan</p></div>
      <div class="card text-center"><p class="text-2xl font-black text-amber-600">${globalStats.total_accounts || 0}</p><p class="text-xs text-slate-500 font-semibold">Akun Terhubung</p></div>
    </div>

    <!-- Add User Modal -->
    <div id="add-user-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 mx-4">
        <div class="flex items-center justify-between mb-6">
          <h4 class="text-xl font-bold text-slate-900">Tambah User Baru</h4>
          <button id="close-modal" class="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="modal-error" class="hidden mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium"></div>
        <form id="add-user-form" class="space-y-4">
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Nama Lengkap</label><input id="new-name" class="input-field" placeholder="Nama user" required /></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Email</label><input type="email" id="new-email" class="input-field" placeholder="email@domain.com" required /></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Password</label><input type="password" id="new-password" class="input-field" placeholder="Password awal" required /></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Role</label>
            <select id="new-role" class="input-field"><option value="user">User (Pelanggan)</option><option value="admin">Admin</option></select>
          </div>
          <button type="submit" class="btn-primary w-full justify-center py-3"><span class="material-symbols-outlined text-sm">person_add</span><span id="add-user-text">Buat User</span></button>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div id="edit-user-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 mx-4">
        <div class="flex items-center justify-between mb-6">
          <h4 class="text-xl font-bold text-slate-900">Edit User</h4>
          <button id="close-edit-modal" class="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer"><span class="material-symbols-outlined">close</span></button>
        </div>
        <div id="edit-error" class="hidden mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium"></div>
        <form id="edit-user-form" class="space-y-4">
          <input type="hidden" id="edit-id" />
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Nama</label><input id="edit-name" class="input-field" required /></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Email</label><input type="email" id="edit-email" class="input-field" required /></div>
          <div><label class="block text-sm font-bold text-slate-700 mb-2">Role</label>
            <select id="edit-role" class="input-field"><option value="user">User</option><option value="admin">Admin</option></select>
          </div>
          <div class="flex items-center gap-3"><label class="text-sm font-bold text-slate-700">Status Aktif</label><button type="button" id="edit-active-toggle" class="toggle-switch active"><span class="toggle-dot"></span></button></div>
          <button type="submit" class="btn-primary w-full justify-center py-3"><span class="material-symbols-outlined text-sm">save</span>Simpan</button>
        </form>
      </div>
    </div>

    <div id="user-msg" class="hidden p-4 rounded-xl text-sm font-medium"></div>

    <!-- Users Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead><tr class="bg-slate-50 border-b border-slate-200">
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Postingan</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Akun</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Terdaftar</th>
            <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Aksi</th>
          </tr></thead>
          <tbody class="divide-y divide-slate-100">
            ${users.length === 0 ? '<tr><td colspan="7" class="px-6 py-12 text-center text-slate-400">Belum ada user.</td></tr>' : users.map(u => `
            <tr class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
                    ${u.avatar ? `<img src="${u.avatar}" class="w-full h-full object-cover" />` : `<span class="material-symbols-outlined">person</span>`}
                  </div>
                  <div><p class="font-bold text-sm text-slate-900">${u.name}</p><p class="text-xs text-slate-500">${u.email}</p></div>
                </div>
              </td>
              <td class="px-6 py-4"><span class="px-2.5 py-1 text-xs font-bold rounded-lg ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}">${u.role === 'admin' ? 'Admin' : 'User'}</span></td>
              <td class="px-6 py-4"><span class="flex items-center gap-1.5 text-sm"><span class="size-2 ${u.is_active ? 'bg-emerald-500' : 'bg-slate-400'} rounded-full"></span>${u.is_active ? 'Aktif' : 'Nonaktif'}</span></td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-700">${u.posting_count || 0}</td>
              <td class="px-6 py-4 text-sm font-semibold text-slate-700">${u.account_count || 0}</td>
              <td class="px-6 py-4 text-xs text-slate-500">${new Date(u.created_at).toLocaleDateString('id-ID')}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <button class="edit-user-btn p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary cursor-pointer" data-id="${u.id}" data-name="${u.name}" data-email="${u.email}" data-role="${u.role}" data-active="${u.is_active}"><span class="material-symbols-outlined text-lg">edit</span></button>
                  ${u.role !== 'admin' ? `<button class="deactivate-btn p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 cursor-pointer" data-id="${u.id}" data-name="${u.name}"><span class="material-symbols-outlined text-lg">${u.is_active ? 'person_off' : 'person'}</span></button>` : ''}
                </div>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;

    renderLayout(app, 'Kelola User', content);

    const modal = document.getElementById('add-user-modal');
    const editModal = document.getElementById('edit-user-modal');
    const msgEl = document.getElementById('user-msg');

    function showMsg(text, ok) {
        msgEl.textContent = text;
        msgEl.className = `p-4 rounded-xl text-sm font-medium ${ok ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-600'}`;
        msgEl.classList.remove('hidden');
    }

    document.getElementById('add-user-btn')?.addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('close-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('close-edit-modal')?.addEventListener('click', () => editModal.classList.add('hidden'));

    // Add user form
    document.getElementById('add-user-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errEl = document.getElementById('modal-error');
        try {
            await api._fetch('/api/admin/users', {
                method: 'POST', body: JSON.stringify({
                    name: document.getElementById('new-name').value,
                    email: document.getElementById('new-email').value,
                    password: document.getElementById('new-password').value,
                    role: document.getElementById('new-role').value,
                })
            });
            modal.classList.add('hidden');
            showMsg('✅ User berhasil dibuat!', true);
            setTimeout(() => adminUsersPage(app), 1000);
        } catch (err) {
            errEl.textContent = err.message;
            errEl.classList.remove('hidden');
        }
    });

    // Edit buttons
    document.querySelectorAll('.edit-user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('edit-id').value = btn.dataset.id;
            document.getElementById('edit-name').value = btn.dataset.name;
            document.getElementById('edit-email').value = btn.dataset.email;
            document.getElementById('edit-role').value = btn.dataset.role;
            const toggleBtn = document.getElementById('edit-active-toggle');
            if (btn.dataset.active === '1') toggleBtn.classList.add('active'); else toggleBtn.classList.remove('active');
            editModal.classList.remove('hidden');
        });
    });

    document.getElementById('edit-active-toggle')?.addEventListener('click', function () { this.classList.toggle('active'); });

    // Edit form submit
    document.getElementById('edit-user-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        try {
            await api._fetch(`/api/admin/users/${id}`, {
                method: 'PUT', body: JSON.stringify({
                    name: document.getElementById('edit-name').value,
                    email: document.getElementById('edit-email').value,
                    role: document.getElementById('edit-role').value,
                    is_active: document.getElementById('edit-active-toggle').classList.contains('active') ? 1 : 0,
                })
            });
            editModal.classList.add('hidden');
            showMsg('✅ User berhasil diperbarui!', true);
            setTimeout(() => adminUsersPage(app), 1000);
        } catch (err) {
            document.getElementById('edit-error').textContent = err.message;
            document.getElementById('edit-error').classList.remove('hidden');
        }
    });

    // Deactivate buttons
    document.querySelectorAll('.deactivate-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm(`Nonaktifkan user "${btn.dataset.name}"?`)) return;
            try {
                await api._fetch(`/api/admin/users/${btn.dataset.id}`, { method: 'DELETE' });
                showMsg(`User "${btn.dataset.name}" dinonaktifkan.`, true);
                setTimeout(() => adminUsersPage(app), 1000);
            } catch (err) { showMsg(err.message, false); }
        });
    });
}
