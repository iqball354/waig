import './style.css';

// Simple hash-based router
const routes = {};
let currentCleanup = null;

export function route(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = '#' + path;
}

export function isAuthenticated() {
    return sessionStorage.getItem('waig_auth') === 'true';
}

export function setAuth(val) {
    if (val) {
        sessionStorage.setItem('waig_auth', 'true');
        sessionStorage.setItem('waig_user', JSON.stringify({
            name: 'Budi Santoso',
            email: 'budi.santoso@waigpilot.io',
            role: 'Admin Pro',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALU4Q28EP7AJxictBV8yF-8wlW4_IaczsEyB_5l10Ug2vOVeXCNROxPcBUFsluKNMJxa_WxnwlaVZcezsWRs_4AKXXbdH52pD7Wx-VtuZ2UCRBFRgkTwGgx-oByf6NN2FMvMItFIwhSHxdJxNp026OxUcLTN-Lq7k9cfh6DoM-s1_1-G_RYe6s9BpcpXM2fQUPK8eV7Ugz6ad9cTyxjj2j9RH8krJ5Lzj0qiEfZnMjkV58UxZn-nMZZIVZPV817u7LXQWTeXX4cUk',
            bio: 'Administrator berpengalaman yang mengelola infrastruktur IT dan operasional sistem harian.',
        }));
    } else {
        sessionStorage.removeItem('waig_auth');
        sessionStorage.removeItem('waig_user');
    }
}

export function getUser() {
    try { return JSON.parse(sessionStorage.getItem('waig_user')); }
    catch { return null; }
}

async function handleRoute() {
    const hash = window.location.hash.slice(1) || '/login';
    const app = document.getElementById('app');

    // Auth guard
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    if (!publicRoutes.includes(hash) && !isAuthenticated()) {
        navigate('/login');
        return;
    }
    if (hash === '/login' && isAuthenticated()) {
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
import { registerPage } from './pages/register.js';
import { forgotPasswordPage } from './pages/forgot-password.js';
import { dashboardPage } from './pages/dashboard.js';
import { createPostingPage } from './pages/create-posting.js';
import { accountsPage } from './pages/accounts.js';
import { profilePage } from './pages/profile.js';
import { exportDataPage } from './pages/export-data.js';

route('/login', loginPage);
route('/register', registerPage);
route('/forgot-password', forgotPasswordPage);
route('/dashboard', dashboardPage);
route('/create-posting', createPostingPage);
route('/accounts', accountsPage);
route('/profile', profilePage);
route('/export-data', exportDataPage);

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', handleRoute);
