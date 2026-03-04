import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

const defaultData = {
    users: [
        {
            id: 1,
            name: 'Budi Santoso',
            email: 'admin@waigpilot.io',
            password: 'admin123',
            role: 'Admin Pro',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALU4Q28EP7AJxictBV8yF-8wlW4_IaczsEyB_5l10Ug2vOVeXCNROxPcBUFsluKNMJxa_WxnwlaVZcezsWRs_4AKXXbdH52pD7Wx-VtuZ2UCRBFRgkTwGgx-oByf6NN2FMvMItFIwhSHxdJxNp026OxUcLTN-Lq7k9cfh6DoM-s1_1-G_RYe6s9BpcpXM2fQUPK8eV7Ugz6ad9cTyxjj2j9RH8krJ5Lzj0qiEfZnMjkV58UxZn-nMZZIVZPV817u7LXQWTeXX4cUk',
            bio: 'Administrator berpengalaman yang mengelola infrastruktur IT dan operasional sistem harian.',
            created_at: '2023-01-15T00:00:00Z',
        },
    ],
    sessions: {},
    connected_accounts: [
        {
            id: 1,
            user_id: 1,
            account_id: '88294102931',
            name: 'Travel Nusantara ID',
            type: 'FB Page',
            access_token: 'EAAxxxxxxx_mock_token_1',
            token_expiry: '2024-05-12T00:00:00Z',
            status: 'Aktif',
        },
        {
            id: 2,
            user_id: 1,
            account_id: '10293184920',
            name: '@nusantara_travel',
            type: 'IG Business',
            access_token: 'EAAxxxxxxx_mock_token_2_expired',
            token_expiry: '2024-03-28T00:00:00Z',
            status: 'Perlu Re-auth',
        },
        {
            id: 3,
            user_id: 1,
            account_id: '77210592183',
            name: 'Kuliner Hits Bandung',
            type: 'FB Page',
            access_token: 'EAAxxxxxxx_mock_token_3',
            token_expiry: '2024-06-20T00:00:00Z',
            status: 'Aktif',
        },
    ],
    postings: [
        {
            id: 1,
            user_id: 1,
            connected_account_id: 2,
            media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAngcQixmb76Uw6ZbABSX8ga0OMGFhJoH8EDN9P8BNnG2K640tgGXusiAv7A3lWBkBfhqzgEtY0laz05THZIm9nCW6EEw219EHJjHtu2pxKQjexMy89z_5XHEarXlS7iElymJIGYBaxUiyo7nW-rjGQA2ix8dadQmt6pI20xOOa-0nENrhG7k6Ii-lqQHQWUkFGusLa8W3oHGDH168DCq2dWIKXWYMQJbnI6IIB94QJRHwNSkwd6CPfoNCx4OCFavgcJn0iVPbowo',
            caption: 'Promo Diskon Akhir Tahun untuk Semua Produk!',
            scheduled_at: '2023-10-25T10:00:00+07:00',
            platform: 'Instagram',
            status: 'Terjadwal',
            error_message: null,
            created_at: '2023-10-20T08:00:00Z',
        },
        {
            id: 2,
            user_id: 1,
            connected_account_id: 1,
            media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKEknqKI32U_TOBwzPFFOt8eYZBPsAhjn75sx1SOnA9SDfLqTncSTyf1hpsRrozevKw9U7jg3mlh77m7Xs_ywUakP9rJyNiRKcRSCCtXfqaJR80WUpddl2EES0kK2JTYzt-dyjbXgGP1u-jCl6tlfJjps1O3bho3l0j_rWC27asn80OOLSg81qQujLduPvyY5Xu_J4qduIwLY3LAGXLvz6y3QdT-UbngbUok5yRlXknBxmhkUnVyo0JB7SheFL1yl5-D9Hjqqxnig',
            caption: 'Tips Mengelola Konten agar Tetap Konsisten...',
            scheduled_at: '2023-10-24T14:30:00+07:00',
            platform: 'Facebook',
            status: 'Sukses',
            error_message: null,
            created_at: '2023-10-19T12:00:00Z',
        },
        {
            id: 3,
            user_id: 1,
            connected_account_id: 2,
            media_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAb887G5a4OMS3sJYc1gxkKUIvm39r0Qif74s3h15agrDQ5-BndhjLk4hy3xZzJ24biESY-JlAleTdOPUUZVNOZE6EOATMqgB62OQQFWTega-SqDFJ79zY4WBxrEmdFCNecs4X0nV1gTljKLBxiwOfUopm5yWVxYE3JJ2_sl4xfilE_a15Axovgq2lh0sR0_lNZwVG769WYw2a3U2vdMMvxkEOa2ToGhUGK_pOhZ80DieKMJf1EIUy5HJJ91bRATvYNrPg_DRIC5xw',
            caption: 'Pengumuman Pemenang Giveaway Mingguan!',
            scheduled_at: '2023-10-23T09:00:00+07:00',
            platform: 'Instagram',
            status: 'Gagal',
            error_message: 'Token kedaluwarsa, perlu re-autentikasi akun @nusantara_travel',
            created_at: '2023-10-18T15:00:00Z',
        },
    ],
    activity_logs: [
        { id: 1, user_id: 1, action: 'LOGIN', description: 'Login berhasil', ip_address: '127.0.0.1', created_at: '2024-05-22T08:00:00Z' },
        { id: 2, user_id: 1, action: 'CREATE_POSTING', description: 'Membuat postingan baru: Promo Diskon...', ip_address: '127.0.0.1', created_at: '2024-05-22T09:00:00Z' },
        { id: 3, user_id: 1, action: 'REFRESH_TOKEN', description: 'Memperbarui token Travel Nusantara ID', ip_address: '127.0.0.1', created_at: '2024-05-21T10:00:00Z' },
    ],
    export_history: [
        { id: 1, user_id: 1, name: 'Laporan Postingan Mei.pdf', range: '01/05/2024 - 31/05/2024', format: 'PDF', status: 'Selesai', created_at: '2024-05-31T23:00:00Z' },
        { id: 2, user_id: 1, name: 'Statistik Performa Q1.xlsx', range: '01/01/2024 - 31/03/2024', format: 'XLSX', status: 'Selesai', created_at: '2024-04-01T08:00:00Z' },
        { id: 3, user_id: 1, name: 'Log Aktivitas Mingguan.csv', range: '15/05/2024 - 22/05/2024', format: 'CSV', status: 'Diproses', created_at: '2024-05-22T14:00:00Z' },
    ],
    _counters: { users: 1, connected_accounts: 3, postings: 3, activity_logs: 3, export_history: 3 },
};

class Database {
    constructor() {
        this.data = null;
        this.load();
    }

    load() {
        try {
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            if (fs.existsSync(DB_PATH)) {
                this.data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
            } else {
                this.data = JSON.parse(JSON.stringify(defaultData));
                this.save();
            }
        } catch {
            this.data = JSON.parse(JSON.stringify(defaultData));
            this.save();
        }
    }

    save() {
        const dir = path.dirname(DB_PATH);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2));
    }

    nextId(table) {
        this.data._counters[table] = (this.data._counters[table] || 0) + 1;
        return this.data._counters[table];
    }

    // --- Users ---
    findUserByEmail(email) {
        return this.data.users.find(u => u.email === email);
    }
    findUserById(id) {
        return this.data.users.find(u => u.id === id);
    }
    createUser(user) {
        user.id = this.nextId('users');
        user.created_at = new Date().toISOString();
        this.data.users.push(user);
        this.save();
        return user;
    }
    updateUser(id, updates) {
        const idx = this.data.users.findIndex(u => u.id === id);
        if (idx === -1) return null;
        this.data.users[idx] = { ...this.data.users[idx], ...updates };
        this.save();
        return this.data.users[idx];
    }

    // --- Sessions ---
    createSession(userId) {
        const token = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        this.data.sessions[token] = { userId, created_at: new Date().toISOString() };
        this.save();
        return token;
    }
    getSession(token) {
        return this.data.sessions[token] || null;
    }
    deleteSession(token) {
        delete this.data.sessions[token];
        this.save();
    }

    // --- Postings ---
    getPostings(userId) {
        return this.data.postings
            .filter(p => p.user_id === userId)
            .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at));
    }
    getPostingById(id) {
        return this.data.postings.find(p => p.id === id);
    }
    getDuePostings() {
        const now = new Date();
        return this.data.postings.filter(p =>
            p.status === 'Terjadwal' && new Date(p.scheduled_at) <= now
        );
    }
    createPosting(posting) {
        posting.id = this.nextId('postings');
        posting.created_at = new Date().toISOString();
        this.data.postings.push(posting);
        this.save();
        return posting;
    }
    updatePosting(id, updates) {
        const idx = this.data.postings.findIndex(p => p.id === id);
        if (idx === -1) return null;
        this.data.postings[idx] = { ...this.data.postings[idx], ...updates };
        this.save();
        return this.data.postings[idx];
    }
    deletePosting(id) {
        this.data.postings = this.data.postings.filter(p => p.id !== id);
        this.save();
    }

    // --- Connected Accounts ---
    getAccounts(userId) {
        return this.data.connected_accounts.filter(a => a.user_id === userId);
    }
    getAccountById(id) {
        return this.data.connected_accounts.find(a => a.id === id);
    }
    createAccount(account) {
        account.id = this.nextId('connected_accounts');
        this.data.connected_accounts.push(account);
        this.save();
        return account;
    }
    updateAccount(id, updates) {
        const idx = this.data.connected_accounts.findIndex(a => a.id === id);
        if (idx === -1) return null;
        this.data.connected_accounts[idx] = { ...this.data.connected_accounts[idx], ...updates };
        this.save();
        return this.data.connected_accounts[idx];
    }
    deleteAccount(id) {
        this.data.connected_accounts = this.data.connected_accounts.filter(a => a.id !== id);
        this.save();
    }

    // --- Activity Logs ---
    getLogs(userId) {
        return this.data.activity_logs
            .filter(l => l.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    addLog(log) {
        log.id = this.nextId('activity_logs');
        log.created_at = new Date().toISOString();
        this.data.activity_logs.push(log);
        this.save();
        return log;
    }

    // --- Export History ---
    getExportHistory(userId) {
        return this.data.export_history
            .filter(e => e.user_id === userId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    createExport(exp) {
        exp.id = this.nextId('export_history');
        exp.created_at = new Date().toISOString();
        this.data.export_history.push(exp);
        this.save();
        return exp;
    }
    updateExport(id, updates) {
        const idx = this.data.export_history.findIndex(e => e.id === id);
        if (idx === -1) return null;
        this.data.export_history[idx] = { ...this.data.export_history[idx], ...updates };
        this.save();
        return this.data.export_history[idx];
    }

    // --- Stats ---
    getStats(userId) {
        const posts = this.data.postings.filter(p => p.user_id === userId);
        return {
            totalPostings: posts.length,
            scheduled: posts.filter(p => p.status === 'Terjadwal').length,
            success: posts.filter(p => p.status === 'Sukses').length,
            failed: posts.filter(p => p.status === 'Gagal').length,
        };
    }
}

export const db = new Database();
