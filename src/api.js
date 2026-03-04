// Frontend API client — communicates with /api/* endpoints via fetch

export const api = {
    async _fetch(url, options = {}) {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            credentials: 'same-origin',
            ...options,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
            throw new Error(data?.error || `Request failed: ${res.status}`);
        }
        return data;
    },

    // Auth
    login(email, password) {
        return this._fetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    },
    register(name, email, password) {
        return this._fetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    },
    logout() {
        return this._fetch('/api/auth/logout', { method: 'POST' });
    },
    me() {
        return this._fetch('/api/auth/me');
    },

    // Dashboard
    getStats() {
        return this._fetch('/api/stats');
    },

    // Postings
    getPostings() {
        return this._fetch('/api/postings');
    },
    createPosting(data) {
        return this._fetch('/api/postings', { method: 'POST', body: JSON.stringify(data) });
    },
    updatePosting(id, data) {
        return this._fetch(`/api/postings/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    },
    deletePosting(id) {
        return this._fetch(`/api/postings/${id}`, { method: 'DELETE' });
    },

    // Connected Accounts
    getAccounts() {
        return this._fetch('/api/accounts');
    },
    createAccount(data) {
        return this._fetch('/api/accounts', { method: 'POST', body: JSON.stringify(data) });
    },
    deleteAccount(id) {
        return this._fetch(`/api/accounts/${id}`, { method: 'DELETE' });
    },
    reauthAccount(id) {
        return this._fetch(`/api/accounts/${id}/reauth`, { method: 'POST' });
    },

    // Profile
    getProfile() {
        return this._fetch('/api/profile');
    },
    updateProfile(data) {
        return this._fetch('/api/profile', { method: 'PUT', body: JSON.stringify(data) });
    },
    changePassword(old_password, new_password) {
        return this._fetch('/api/profile/password', { method: 'PUT', body: JSON.stringify({ old_password, new_password }) });
    },

    // Export
    getExportHistory() {
        return this._fetch('/api/exports');
    },
    createExport(data) {
        return this._fetch('/api/exports', { method: 'POST', body: JSON.stringify(data) });
    },

    // Activity Logs
    getActivityLogs() {
        return this._fetch('/api/activity-logs');
    },
};
