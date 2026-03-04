import { db } from './db.js';
import { startScheduler, getMetaOAuthUrl, exchangeMetaCode, getLongLivedToken } from './services.js';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, '..', 'data', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

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
        // Check if the body was already parsed by Vite's middleware
        if (req.body !== undefined) {
            resolve(req.body);
            return;
        }
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try { resolve(JSON.parse(body)); }
            catch { resolve({}); }
        });
    });
}

function getSession(req) {
    const cookie = req.headers.cookie || '';
    const match = cookie.match(/waig_session=([^;]+)/);
    if (!match) return null;
    const session = db.getSession(match[1]);
    if (!session) return null;
    return { token: match[1], ...session };
}

function setSessionCookie(res, token) {
    res.setHeader('Set-Cookie', `waig_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);
}

function clearSessionCookie(res) {
    res.setHeader('Set-Cookie', `waig_session=; Path=/; HttpOnly; Max-Age=0`);
}

function requireAuth(req, res) {
    const session = getSession(req);
    if (!session) {
        error(res, 'Unauthorized', 401);
        return null;
    }
    const user = db.findUserById(session.userId);
    if (!user) {
        error(res, 'User not found', 401);
        return null;
    }
    return { session, user };
}

function safeUser(user) {
    const { password, ...rest } = user;
    return rest;
}

// ===========================
// Route Handler
// ===========================
export async function handleApiRequest(req, res) {
    const { pathname } = parse(req.url, true);
    const method = req.method;

    // ---- Auth ----
    if (pathname === '/api/auth/login' && method === 'POST') {
        const body = await parseBody(req);
        const { email, password } = body;
        if (!email || !password) return error(res, 'Email dan password wajib diisi');

        const user = db.findUserByEmail(email);
        if (!user || user.password !== password) {
            return error(res, 'Email atau password salah', 401);
        }

        const token = db.createSession(user.id);
        setSessionCookie(res, token);
        db.addLog({ user_id: user.id, action: 'LOGIN', description: 'Login berhasil', ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, { user: safeUser(user), token });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
        const body = await parseBody(req);
        const { name, email, password } = body;
        if (!name || !email || !password) return error(res, 'Semua field wajib diisi');

        if (db.findUserByEmail(email)) return error(res, 'Email sudah terdaftar', 409);

        const user = db.createUser({
            name, email, password,
            role: 'User',
            avatar: '',
            bio: '',
        });
        return json(res, { user: safeUser(user) }, 201);
    }

    if (pathname === '/api/auth/logout' && method === 'POST') {
        const session = getSession(req);
        if (session) {
            db.addLog({ user_id: session.userId, action: 'LOGOUT', description: 'Logout berhasil', ip_address: req.socket.remoteAddress || '127.0.0.1' });
            db.deleteSession(session.token);
        }
        clearSessionCookie(res);
        return json(res, { message: 'Berhasil logout' });
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        return json(res, { user: safeUser(auth.user) });
    }

    // ---- Dashboard Stats ----
    if (pathname === '/api/stats' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        return json(res, db.getStats(auth.user.id));
    }

    // ---- Postings CRUD ----
    if (pathname === '/api/postings' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const postings = db.getPostings(auth.user.id);
        // Enrich with account info
        const enriched = postings.map(p => {
            const account = db.getAccountById(p.connected_account_id);
            return { ...p, account_name: account?.name || 'Unknown' };
        });
        return json(res, enriched);
    }

    if (pathname === '/api/postings' && method === 'POST') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const { media_url, caption, scheduled_at, platform, connected_account_id } = body;

        if (!caption || !scheduled_at || !platform) {
            return error(res, 'Caption, jadwal, dan platform wajib diisi');
        }

        // Find a suitable account if not specified
        let accountId = connected_account_id;
        if (!accountId) {
            const accounts = db.getAccounts(auth.user.id);
            const match = accounts.find(a =>
                (platform === 'Facebook' && a.type === 'FB Page') ||
                (platform === 'Instagram' && a.type === 'IG Business')
            );
            accountId = match?.id;
        }

        const posting = db.createPosting({
            user_id: auth.user.id,
            connected_account_id: accountId || null,
            media_url: media_url || '',
            caption,
            scheduled_at,
            platform,
            status: 'Terjadwal',
            error_message: null,
        });

        db.addLog({
            user_id: auth.user.id,
            action: 'CREATE_POSTING',
            description: `Membuat postingan baru: "${caption.slice(0, 40)}..."`,
            ip_address: req.socket.remoteAddress || '127.0.0.1',
        });

        return json(res, posting, 201);
    }

    // Single posting operations
    const postingMatch = pathname.match(/^\/api\/postings\/(\d+)$/);
    if (postingMatch) {
        const id = parseInt(postingMatch[1]);

        if (method === 'GET') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const posting = db.getPostingById(id);
            if (!posting || posting.user_id !== auth.user.id) return error(res, 'Posting tidak ditemukan', 404);
            return json(res, posting);
        }

        if (method === 'PUT') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const posting = db.getPostingById(id);
            if (!posting || posting.user_id !== auth.user.id) return error(res, 'Posting tidak ditemukan', 404);
            const body = await parseBody(req);
            const updated = db.updatePosting(id, body);
            db.addLog({ user_id: auth.user.id, action: 'UPDATE_POSTING', description: `Mengubah postingan #${id}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
            return json(res, updated);
        }

        if (method === 'DELETE') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const posting = db.getPostingById(id);
            if (!posting || posting.user_id !== auth.user.id) return error(res, 'Posting tidak ditemukan', 404);
            db.deletePosting(id);
            db.addLog({ user_id: auth.user.id, action: 'DELETE_POSTING', description: `Menghapus postingan #${id}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
            return json(res, { message: 'Posting dihapus' });
        }
    }

    // ---- Connected Accounts ----
    if (pathname === '/api/accounts' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const accounts = db.getAccounts(auth.user.id);
        // Calculate days until expiry
        const enriched = accounts.map(a => {
            const now = new Date();
            const expiry = new Date(a.token_expiry);
            const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
            return { ...a, days_left: daysLeft, access_token: undefined };
        });
        return json(res, enriched);
    }

    if (pathname === '/api/accounts' && method === 'POST') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const account = db.createAccount({
            user_id: auth.user.id,
            account_id: body.account_id || 'new_' + Date.now(),
            name: body.name,
            type: body.type,
            access_token: body.access_token || '',
            token_expiry: body.token_expiry || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'Aktif',
        });
        db.addLog({ user_id: auth.user.id, action: 'CONNECT_ACCOUNT', description: `Menghubungkan akun: ${account.name}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, account, 201);
    }

    const accountMatch = pathname.match(/^\/api\/accounts\/(\d+)$/);
    if (accountMatch) {
        const id = parseInt(accountMatch[1]);

        if (method === 'PUT') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            const body = await parseBody(req);
            const updated = db.updateAccount(id, body);
            if (!updated) return error(res, 'Akun tidak ditemukan', 404);
            return json(res, updated);
        }

        if (method === 'DELETE') {
            const auth = requireAuth(req, res);
            if (!auth) return;
            db.deleteAccount(id);
            db.addLog({ user_id: auth.user.id, action: 'DISCONNECT_ACCOUNT', description: `Memutus akun #${id}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
            return json(res, { message: 'Akun dihapus' });
        }
    }

    // Re-auth / refresh token for an account
    const reauthMatch = pathname.match(/^\/api\/accounts\/(\d+)\/reauth$/);
    if (reauthMatch && method === 'POST') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const id = parseInt(reauthMatch[1]);
        const account = db.getAccountById(id);
        if (!account) return error(res, 'Akun tidak ditemukan', 404);

        // Simulate token refresh
        const newExpiry = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
        const updated = db.updateAccount(id, {
            access_token: 'EAA_refreshed_' + Math.random().toString(36).slice(2),
            token_expiry: newExpiry,
            status: 'Aktif',
        });

        db.addLog({ user_id: auth.user.id, action: 'REFRESH_TOKEN', description: `Memperbarui token ${account.name}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, { ...updated, access_token: undefined });
    }

    // Meta OAuth redirect
    if (pathname === '/api/meta/oauth' && method === 'GET') {
        const redirectUri = `${req.headers.origin || 'http://localhost:3000'}/api/meta/callback`;
        const authUrl = getMetaOAuthUrl(redirectUri);
        res.statusCode = 302;
        res.setHeader('Location', authUrl);
        return res.end();
    }

    // Meta OAuth callback
    if (pathname === '/api/meta/callback' && method === 'GET') {
        const { query } = parse(req.url, true);
        const code = query.code;
        if (!code) return error(res, 'Missing code parameter');

        const redirectUri = `${req.headers.origin || 'http://localhost:3000'}/api/meta/callback`;
        const tokenData = await exchangeMetaCode(code, redirectUri);
        const longLived = await getLongLivedToken(tokenData.access_token);

        // Redirect back to frontend with success
        res.statusCode = 302;
        res.setHeader('Location', '/#/accounts?oauth=success');
        return res.end();
    }

    // ---- Profile ----
    if (pathname === '/api/profile' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        return json(res, safeUser(auth.user));
    }

    if (pathname === '/api/profile' && method === 'PUT') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const allowed = ['name', 'email', 'bio', 'avatar'];
        const updates = {};
        for (const key of allowed) {
            if (body[key] !== undefined) updates[key] = body[key];
        }
        const updated = db.updateUser(auth.user.id, updates);
        db.addLog({ user_id: auth.user.id, action: 'UPDATE_PROFILE', description: 'Memperbarui profil', ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, safeUser(updated));
    }

    if (pathname === '/api/profile/password' && method === 'PUT') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const { old_password, new_password } = body;
        if (!old_password || !new_password) return error(res, 'Password lama dan baru wajib diisi');
        if (auth.user.password !== old_password) return error(res, 'Password lama salah', 401);
        db.updateUser(auth.user.id, { password: new_password });
        db.addLog({ user_id: auth.user.id, action: 'CHANGE_PASSWORD', description: 'Mengubah kata sandi', ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, { message: 'Password berhasil diubah' });
    }

    // ---- Export Data ----
    if (pathname === '/api/exports' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        return json(res, db.getExportHistory(auth.user.id));
    }

    if (pathname === '/api/exports' && method === 'POST') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        const body = await parseBody(req);
        const { report_type, platforms, format, date_from, date_to } = body;

        const formatDate = (d) => d ? new Date(d).toLocaleDateString('id-ID') : 'N/A';
        const typeNames = { postingan: 'Postingan', performa: 'Statistik Performa', aktivitas: 'Log Aktivitas' };

        const exp = db.createExport({
            user_id: auth.user.id,
            name: `Laporan ${typeNames[report_type] || report_type}.${(format || 'csv').toLowerCase()}`,
            range: `${formatDate(date_from)} - ${formatDate(date_to)}`,
            format: (format || 'CSV').toUpperCase(),
            status: 'Diproses',
        });

        // Simulate processing (mark as complete after 3 seconds)
        setTimeout(() => {
            db.updateExport(exp.id, { status: 'Selesai' });
            console.log(`[Export] Report #${exp.id} selesai diproses`);
        }, 3000);

        db.addLog({ user_id: auth.user.id, action: 'EXPORT_DATA', description: `Memulai ekspor: ${exp.name}`, ip_address: req.socket.remoteAddress || '127.0.0.1' });
        return json(res, exp, 201);
    }

    // ---- Activity Logs ----
    if (pathname === '/api/activity-logs' && method === 'GET') {
        const auth = requireAuth(req, res);
        if (!auth) return;
        return json(res, db.getLogs(auth.user.id));
    }

    // ---- Not found ----
    return error(res, 'API endpoint tidak ditemukan', 404);
}

// ===========================
// Vite Plugin
// ===========================
export function apiServerPlugin() {
    return {
        name: 'waig-pilot-api',
        configureServer(server) {
            // Start the scheduler
            startScheduler();

            // Add API middleware BEFORE Vite's internal middleware
            server.middlewares.use(async (req, res, next) => {
                if (req.url?.startsWith('/api/')) {
                    try {
                        await handleApiRequest(req, res);
                    } catch (err) {
                        console.error('[API Error]', err);
                        error(res, 'Internal server error', 500);
                    }
                } else {
                    next();
                }
            });
        },
    };
}
