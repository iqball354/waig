import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'waigpilot',
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
});

// Test connection on startup
pool.getConnection()
    .then(conn => { console.log('[DB] MySQL connected to waigpilot'); conn.release(); })
    .catch(err => console.error('[DB] MySQL connection error:', err.message));

export const db = {
    // --- Users ---
    async findUserByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    },
    async findUserById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    },
    async getAllUsers() {
        const [rows] = await pool.execute(`
      SELECT u.*, 
        (SELECT COUNT(*) FROM postings WHERE user_id = u.id) AS posting_count,
        (SELECT COUNT(*) FROM connected_accounts WHERE user_id = u.id) AS account_count
      FROM users u ORDER BY u.created_at DESC
    `);
        return rows;
    },
    async createUser({ name, email, password, role = 'user', bio = '', avatar = '' }) {
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role, bio, avatar) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, role, bio, avatar]
        );
        return this.findUserById(result.insertId);
    },
    async updateUser(id, updates) {
        const allowed = ['name', 'email', 'password', 'role', 'is_active', 'bio', 'avatar'];
        const fields = [], values = [];
        for (const [k, v] of Object.entries(updates)) {
            if (allowed.includes(k) && v !== undefined) { fields.push(`${k} = ?`); values.push(v); }
        }
        if (fields.length === 0) return this.findUserById(id);
        values.push(id);
        await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.findUserById(id);
    },
    async deleteUser(id) {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    },

    // --- Sessions ---
    async createSession(userId) {
        const token = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
        await pool.execute('INSERT INTO sessions (token, user_id) VALUES (?, ?)', [token, userId]);
        return token;
    },
    async getSession(token) {
        const [rows] = await pool.execute('SELECT * FROM sessions WHERE token = ?', [token]);
        return rows[0] || null;
    },
    async deleteSession(token) {
        await pool.execute('DELETE FROM sessions WHERE token = ?', [token]);
    },

    // --- Postings ---
    async getPostings(userId) {
        const [rows] = await pool.execute(
            `SELECT p.*, ca.name AS account_name FROM postings p 
       LEFT JOIN connected_accounts ca ON p.connected_account_id = ca.id
       WHERE p.user_id = ? ORDER BY p.scheduled_at DESC`, [userId]
        );
        return rows;
    },
    async getAllPostings() {
        const [rows] = await pool.execute(
            `SELECT p.*, ca.name AS account_name, u.name AS user_name FROM postings p 
       LEFT JOIN connected_accounts ca ON p.connected_account_id = ca.id
       LEFT JOIN users u ON p.user_id = u.id
       ORDER BY p.scheduled_at DESC`
        );
        return rows;
    },
    async getPostingById(id) {
        const [rows] = await pool.execute('SELECT * FROM postings WHERE id = ?', [id]);
        return rows[0] || null;
    },
    async getDuePostings() {
        const [rows] = await pool.execute(
            `SELECT p.*, ca.access_token, ca.name AS account_name, ca.account_id AS meta_account_id, ca.type AS account_type, ca.status AS account_status
       FROM postings p LEFT JOIN connected_accounts ca ON p.connected_account_id = ca.id
       WHERE p.status = 'Terjadwal' AND p.scheduled_at <= NOW()`
        );
        return rows;
    },
    async createPosting({ user_id, connected_account_id, media_url, caption, scheduled_at, platform }) {
        const [result] = await pool.execute(
            'INSERT INTO postings (user_id, connected_account_id, media_url, caption, scheduled_at, platform, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, connected_account_id || null, media_url || '', caption, scheduled_at, platform, 'Terjadwal']
        );
        return this.getPostingById(result.insertId);
    },
    async updatePosting(id, updates) {
        const allowed = ['media_url', 'caption', 'scheduled_at', 'platform', 'status', 'error_message', 'connected_account_id'];
        const fields = [], values = [];
        for (const [k, v] of Object.entries(updates)) {
            if (allowed.includes(k) && v !== undefined) { fields.push(`${k} = ?`); values.push(v); }
        }
        if (fields.length === 0) return this.getPostingById(id);
        values.push(id);
        await pool.execute(`UPDATE postings SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.getPostingById(id);
    },
    async deletePosting(id) {
        await pool.execute('DELETE FROM postings WHERE id = ?', [id]);
    },

    // --- Connected Accounts ---
    async getAccounts(userId) {
        const [rows] = await pool.execute(
            `SELECT id, user_id, account_id, name, type, token_expiry, status, created_at,
       DATEDIFF(token_expiry, NOW()) AS days_left
       FROM connected_accounts WHERE user_id = ? ORDER BY created_at DESC`, [userId]
        );
        return rows;
    },
    async getAccountById(id) {
        const [rows] = await pool.execute('SELECT * FROM connected_accounts WHERE id = ?', [id]);
        return rows[0] || null;
    },
    async createAccount({ user_id, account_id, name, type, access_token, token_expiry, status = 'Aktif' }) {
        const [result] = await pool.execute(
            'INSERT INTO connected_accounts (user_id, account_id, name, type, access_token, token_expiry, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, account_id, name, type, access_token, token_expiry, status]
        );
        return this.getAccountById(result.insertId);
    },
    async updateAccount(id, updates) {
        const allowed = ['name', 'access_token', 'token_expiry', 'status'];
        const fields = [], values = [];
        for (const [k, v] of Object.entries(updates)) {
            if (allowed.includes(k) && v !== undefined) { fields.push(`${k} = ?`); values.push(v); }
        }
        if (fields.length === 0) return this.getAccountById(id);
        values.push(id);
        await pool.execute(`UPDATE connected_accounts SET ${fields.join(', ')} WHERE id = ?`, values);
        return this.getAccountById(id);
    },
    async deleteAccount(id) {
        await pool.execute('DELETE FROM connected_accounts WHERE id = ?', [id]);
    },

    // --- Activity Logs ---
    async getLogs(userId) {
        const [rows] = await pool.execute('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 100', [userId]);
        return rows;
    },
    async getAllLogs() {
        const [rows] = await pool.execute(
            `SELECT al.*, u.name AS user_name FROM activity_logs al 
       LEFT JOIN users u ON al.user_id = u.id ORDER BY al.created_at DESC LIMIT 200`
        );
        return rows;
    },
    async addLog({ user_id, action, description, ip_address = '127.0.0.1' }) {
        await pool.execute(
            'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES (?, ?, ?, ?)',
            [user_id, action, description, ip_address]
        );
    },

    // --- Export History ---
    async getExportHistory(userId) {
        const [rows] = await pool.execute('SELECT * FROM export_history WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },
    async createExport({ user_id, name, range_text, format, status = 'Diproses' }) {
        const [result] = await pool.execute(
            'INSERT INTO export_history (user_id, name, range_text, format, status) VALUES (?, ?, ?, ?, ?)',
            [user_id, name, range_text, format, status]
        );
        const [rows] = await pool.execute('SELECT * FROM export_history WHERE id = ?', [result.insertId]);
        return rows[0];
    },
    async updateExport(id, updates) {
        if (updates.status) {
            await pool.execute('UPDATE export_history SET status = ? WHERE id = ?', [updates.status, id]);
        }
    },

    // --- Stats ---
    async getStats(userId) {
        const [rows] = await pool.execute(`
      SELECT 
        COUNT(*) AS totalPostings,
        SUM(status = 'Terjadwal') AS scheduled,
        SUM(status = 'Sukses') AS success,
        SUM(status = 'Gagal') AS failed
      FROM postings WHERE user_id = ?
    `, [userId]);
        const r = rows[0];
        return {
            totalPostings: Number(r.totalPostings) || 0,
            scheduled: Number(r.scheduled) || 0,
            success: Number(r.success) || 0,
            failed: Number(r.failed) || 0,
        };
    },
    async getGlobalStats() {
        const [rows] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role != 'admin') AS total_users,
        (SELECT COUNT(*) FROM users WHERE is_active = 1 AND role != 'admin') AS active_users,
        (SELECT COUNT(*) FROM postings) AS total_postings,
        (SELECT COUNT(*) FROM connected_accounts) AS total_accounts
    `);
        return rows[0];
    },
};
