import { db } from './db.js';
import { startScheduler, getMetaOAuthUrl, exchangeMetaCode, getLongLivedToken } from './services.js';
import { parse } from 'url';

// ===========================
// Helpers
// ===========================
function json(res, data, status = 200) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

function error(res, message, status = 400) {
    json(res, { error: message }, status);
}

function parseBody(req) {
    return new Promise((resolve) => {
        if (req.body !== undefined) { resolve(req.body); return; }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
    });
}

async function getSession(req) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/waig_session=([^;]+)/);
    if (!match) return null;
    const session = await db.getSession(match[1]);
    if (!session) return null;
    return { token: match[1], userId: session.user_id };
}

function setSessionCookie(res, token) {
    res.setHeader('Set-Cookie', `waig_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
}

function clearSessionCookie(res) {
    res.setHeader('Set-Cookie', `waig_session=; Path=/; HttpOnly; Max-Age=0`);
}

async function requireAuth(req, res) {
    const session = await getSession(req);
    if (!session) { error(res, 'Unauthorized', 401); return null; }
    const user = await db.findUserById(session.userId);
    if (!user) { error(res, 'User not found', 401); return null; }
    if (!user.is_active) { error(res, 'Akun dinonaktifkan', 403); return null; }
    return { session, user };
}

async function requireAdmin(req, res) {
    const auth = await requireAuth(req, res);
    if (!auth) return null;
    if (auth.user.role !== 'admin') { error(res, 'Akses ditolak. Hanya admin.', 403); return null; }
    return auth;
}

function safeUser(user) {
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
}

// ===========================
// Route Handler
// ===========================
export async function handleApiRequest(req, res) {
    const { pathname } = parse(req.url, true);
    const method = req.method;
    const ip = req.socket.remoteAddress || '127.0.0.1';

    // ========== AUTH ==========
    if (pathname === '/api/auth/login' && method === 'POST') {
        const { email, password } = await parseBody(req);
        if (!email || !password) return error(res, 'Email dan password wajib diisi');
        const user = await db.findUserByEmail(email);
        if (!user || user.password !== password) return error(res, 'Email atau password salah', 401);
        if (!user.is_active) return error(res, 'Akun Anda dinonaktifkan. Hubungi admin.', 403);
        const token = await db.createSession(user.id);
        setSessionCookie(res, token);
        await db.addLog({ user_id: user.id, action: 'LOGIN', description: 'Login berhasil', ip_address: ip });
        return json(res, { user: safeUser(user), token });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
        // Admin-only registration
        const auth = await requireAdmin(req, res);
        if (!auth) return;
        const { name, email, password, role = 'user' } = await parseBody(req);
        if (!name || !email || !password) return error(res, 'Nama, email, dan password wajib diisi');
        const existing = await db.findUserByEmail(email);
        if (existing) return error(res, 'Email sudah terdaftar', 409);
        const user = await db.createUser({ name, email, password, role });
        await db.addLog({ user_id: auth.user.id, action: 'CREATE_USER', description: `Admin membuat user: ${name} (${email})`, ip_address: ip });
        return json(res, { user: safeUser(user) }, 201);
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
        const session = await getSession(req);
        if (session) { await db.addLog({ user_id: session.userId, action: 'LOGOUT', description: 'Logout', ip_address: ip }); await db.deleteSession(session.token); }
        clearSessionCookie(res);
        return json(res, { message: 'Berhasil logout' });
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, { user: safeUser(auth.user) });
    }

    // ========== DASHBOARD STATS ==========
    if (pathname === '/api/stats' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, await db.getStats(auth.user.id));
    }

    // ========== POSTINGS CRUD ==========
    if (pathname === '/api/postings' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, await db.getPostings(auth.user.id));
    }

    if (pathname === '/api/postings' && method === 'POST') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const { media_url, caption, scheduled_at, platform, connected_account_id } = await parseBody(req);
        if (!caption || !scheduled_at || !platform) return error(res, 'Caption, jadwal, dan platform wajib diisi');
        let accountId = connected_account_id;
        if (!accountId) {
            const accounts = await db.getAccounts(auth.user.id);
            const match = accounts.find(a => (platform === 'Facebook' && a.type === 'FB Page') || (platform === 'Instagram' && a.type === 'IG Business'));
            accountId = match?.id;
        }
        const posting = await db.createPosting({ user_id: auth.user.id, connected_account_id: accountId, media_url, caption, scheduled_at, platform });
        await db.addLog({ user_id: auth.user.id, action: 'CREATE_POSTING', description: `Membuat postingan: "${caption.slice(0, 40)}..."`, ip_address: ip });
        return json(res, posting, 201);
    }

    const postMatch = pathname.match(/^\/api\/postings\/(\d+)$/);
    if (postMatch) {
        const id = parseInt(postMatch[1]);
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const posting = await db.getPostingById(id);
        if (!posting) return error(res, 'Posting tidak ditemukan', 404);
        // Admin can access any posting; regular users only their own
        if (auth.user.role !== 'admin' && posting.user_id !== auth.user.id) return error(res, 'Akses ditolak', 403);
        if (method === 'GET') return json(res, posting);
        if (method === 'PUT') { const body = await parseBody(req); return json(res, await db.updatePosting(id, body)); }
        if (method === 'DELETE') { await db.deletePosting(id); return json(res, { message: 'Posting dihapus' }); }
    }

    // ========== CONNECTED ACCOUNTS ==========
    if (pathname === '/api/accounts' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, await db.getAccounts(auth.user.id));
    }

    if (pathname === '/api/accounts' && method === 'POST') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const account = await db.createAccount({
            user_id: auth.user.id, account_id: body.account_id || 'new_' + Date.now(), name: body.name, type: body.type,
            access_token: body.access_token || '', token_expiry: body.token_expiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), status: 'Aktif',
        });
        await db.addLog({ user_id: auth.user.id, action: 'CONNECT_ACCOUNT', description: `Menghubungkan: ${account.name}`, ip_address: ip });
        return json(res, account, 201);
    }

    const accMatch = pathname.match(/^\/api\/accounts\/(\d+)$/);
    if (accMatch) {
        const id = parseInt(accMatch[1]);
        if (method === 'PUT') { const auth = await requireAuth(req, res); if (!auth) return; return json(res, await db.updateAccount(id, await parseBody(req))); }
        if (method === 'DELETE') { const auth = await requireAuth(req, res); if (!auth) return; await db.deleteAccount(id); return json(res, { message: 'Akun dihapus' }); }
    }

    const reauthMatch = pathname.match(/^\/api\/accounts\/(\d+)\/reauth$/);
    if (reauthMatch && method === 'POST') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const id = parseInt(reauthMatch[1]);
        const account = await db.getAccountById(id);
        if (!account) return error(res, 'Akun tidak ditemukan', 404);
        const newExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
        const updated = await db.updateAccount(id, { access_token: 'EAA_refreshed_' + Math.random().toString(36).slice(2), token_expiry: newExpiry, status: 'Aktif' });
        await db.addLog({ user_id: auth.user.id, action: 'REFRESH_TOKEN', description: `Memperbarui token ${account.name}`, ip_address: ip });
        return json(res, updated);
    }

    // ========== META OAUTH ==========
    if (pathname === '/api/meta/oauth' && method === 'GET') {
        const redirectUri = `${req.headers.origin || 'http://localhost:3000'}/api/meta/callback`;
        res.statusCode = 302; res.setHeader('Location', getMetaOAuthUrl(redirectUri)); return res.end();
    }
    if (pathname === '/api/meta/callback' && method === 'GET') {
        const { query } = parse(req.url, true);
        if (!query.code) return error(res, 'Missing code');
        const redirectUri = `${req.headers.origin || 'http://localhost:3000'}/api/meta/callback`;
        await exchangeMetaCode(query.code, redirectUri);
        res.statusCode = 302; res.setHeader('Location', '/#/accounts?oauth=success'); return res.end();
    }

    // ========== PROFILE ==========
    if (pathname === '/api/profile' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, safeUser(auth.user));
    }
    if (pathname === '/api/profile' && method === 'PUT') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const updated = await db.updateUser(auth.user.id, { name: body.name, email: body.email, bio: body.bio });
        await db.addLog({ user_id: auth.user.id, action: 'UPDATE_PROFILE', description: 'Memperbarui profil', ip_address: ip });
        return json(res, safeUser(updated));
    }
    if (pathname === '/api/profile/password' && method === 'PUT') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const { old_password, new_password } = await parseBody(req);
        if (!old_password || !new_password) return error(res, 'Password lama dan baru wajib diisi');
        if (auth.user.password !== old_password) return error(res, 'Password lama salah', 401);
        await db.updateUser(auth.user.id, { password: new_password });
        await db.addLog({ user_id: auth.user.id, action: 'CHANGE_PASSWORD', description: 'Mengubah kata sandi', ip_address: ip });
        return json(res, { message: 'Password berhasil diubah' });
    }

    // ========== EXPORT DATA ==========
    if (pathname === '/api/exports' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, await db.getExportHistory(auth.user.id));
    }
    if (pathname === '/api/exports' && method === 'POST') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        const { report_type, format, date_from, date_to } = await parseBody(req);
        const typeNames = { postingan: 'Postingan', performa: 'Statistik Performa', aktivitas: 'Log Aktivitas' };
        const fmtDate = (d) => d ? new Date(d).toLocaleDateString('id-ID') : 'N/A';
        const exp = await db.createExport({
            user_id: auth.user.id,
            name: `Laporan ${typeNames[report_type] || report_type}.${(format || 'csv').toLowerCase()}`,
            range_text: `${fmtDate(date_from)} - ${fmtDate(date_to)}`,
            format: (format || 'CSV').toUpperCase(), status: 'Diproses',
        });
        setTimeout(async () => { await db.updateExport(exp.id, { status: 'Selesai' }); }, 3000);
        return json(res, exp, 201);
    }

    // ========== ACTIVITY LOGS ==========
    if (pathname === '/api/activity-logs' && method === 'GET') {
        const auth = await requireAuth(req, res);
        if (!auth) return;
        return json(res, await db.getLogs(auth.user.id));
    }

    // ========== ADMIN ENDPOINTS ==========
    if (pathname === '/api/admin/users' && method === 'GET') {
        const auth = await requireAdmin(req, res);
        if (!auth) return;
        const users = await db.getAllUsers();
        return json(res, users.map(safeUser));
    }

    if (pathname === '/api/admin/users' && method === 'POST') {
        // Same as register but explicit admin endpoint
        const auth = await requireAdmin(req, res);
        if (!auth) return;
        const { name, email, password, role = 'user' } = await parseBody(req);
        if (!name || !email || !password) return error(res, 'Nama, email, dan password wajib diisi');
        const existing = await db.findUserByEmail(email);
        if (existing) return error(res, 'Email sudah terdaftar', 409);
        const user = await db.createUser({ name, email, password, role });
        await db.addLog({ user_id: auth.user.id, action: 'CREATE_USER', description: `Membuat user: ${name}`, ip_address: ip });
        return json(res, { user: safeUser(user) }, 201);
    }

    const adminUserMatch = pathname.match(/^\/api\/admin\/users\/(\d+)$/);
    if (adminUserMatch) {
        const id = parseInt(adminUserMatch[1]);
        const auth = await requireAdmin(req, res);
        if (!auth) return;

        if (method === 'GET') {
            const user = await db.findUserById(id);
            if (!user) return error(res, 'User tidak ditemukan', 404);
            const postings = await db.getPostings(id);
            const accounts = await db.getAccounts(id);
            const stats = await db.getStats(id);
            return json(res, { user: safeUser(user), postings, accounts, stats });
        }
        if (method === 'PUT') {
            const body = await parseBody(req);
            const updated = await db.updateUser(id, body);
            if (!updated) return error(res, 'User tidak ditemukan', 404);
            await db.addLog({ user_id: auth.user.id, action: 'UPDATE_USER', description: `Admin mengubah user #${id}`, ip_address: ip });
            return json(res, safeUser(updated));
        }
        if (method === 'DELETE') {
            if (id === auth.user.id) return error(res, 'Tidak bisa menghapus diri sendiri', 400);
            await db.updateUser(id, { is_active: 0 });
            await db.addLog({ user_id: auth.user.id, action: 'DEACTIVATE_USER', description: `Admin menonaktifkan user #${id}`, ip_address: ip });
            return json(res, { message: 'User dinonaktifkan' });
        }
    }

    if (pathname === '/api/admin/stats' && method === 'GET') {
        const auth = await requireAdmin(req, res);
        if (!auth) return;
        return json(res, await db.getGlobalStats());
    }

    return error(res, 'API endpoint tidak ditemukan', 404);
}

// ===========================
// Vite Plugin
// ===========================
export function apiServerPlugin() {
    return {
        name: 'waig-pilot-api',
        configureServer(server) {
            startScheduler();
            server.middlewares.use(async (req, res, next) => {
                if (req.url?.startsWith('/api/')) {
                    try { await handleApiRequest(req, res); } catch (err) { console.error('[API Error]', err); error(res, 'Internal server error', 500); }
                } else { next(); }
            });
        },
    };
}
