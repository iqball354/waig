import './style.css';
import { api } from './api.js';

// Simple hash-based router
const routes = {};
let currentCleanup = null;
let cachedUser = null;

export function route(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = '#' + path;
}

export async function isAuthenticated() {
    try {
        const data = await api.me();
        cachedUser = data.user;
        return true;
    } catch {
        cachedUser = null;
        return false;
    }
}

export function getUser() {
    return cachedUser;
}

export function setUser(user) {
    cachedUser = user;
}

async function handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const app = document.getElementById('app');

    // Auth guard
    const publicRoutes = ['/login', '/forgot-password'];
    const authed = await isAuthenticated();

    if (!publicRoutes.includes(hash) && !authed) {
        navigate('/login');
        return;
    }
    if (hash === '/login' && authed) {
        navigate('/dashboard');
        return;
    }

    // Cleanup previous page
    if (currentCleanup && typeof currentCleanup === 'function') {
        currentCleanup();
        currentCleanup = null;
    }

    const handler = routes[hash];
    if (handler) {
        const result = await handler(app);
        if (typeof result === 'function') {
            currentCleanup = result;
        }
    } else {
        navigate('/dashboard');
    }
}

// Register pages
import { loginPage } from './pages/login.js';
import { forgotPasswordPage } from './pages/forgot-password.js';
import { dashboardPage } from './pages/dashboard.js';
import { createPostingPage } from './pages/create-posting.js';
import { accountsPage } from './pages/accounts.js';
import { profilePage } from './pages/profile.js';
import { exportDataPage } from './pages/export-data.js';
import { adminUsersPage } from './pages/admin-users.js';

route('/login', loginPage);
route('/forgot-password', forgotPasswordPage);
route('/dashboard', dashboardPage);
route('/create-posting', createPostingPage);
route('/accounts', accountsPage);
route('/profile', profilePage);
route('/export-data', exportDataPage);
route('/admin/users', adminUsersPage);

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
