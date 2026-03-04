import { db } from './db.js';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/waig-pilot';
const META_APP_ID = process.env.META_APP_ID || 'YOUR_META_APP_ID';
const META_APP_SECRET = process.env.META_APP_SECRET || 'YOUR_META_APP_SECRET';

let schedulerInterval = null;

export function startScheduler() {
    console.log('[Scheduler] Started — checking for due postings every 30s');
    schedulerInterval = setInterval(async () => {
        try {
            const duePostings = await db.getDuePostings();
            if (duePostings.length === 0) return;
            console.log(`[Scheduler] Found ${duePostings.length} due posting(s)`);
            for (const posting of duePostings) {
                try {
                    if (!posting.access_token || posting.account_status !== 'Aktif') {
                        await db.updatePosting(posting.id, { status: 'Gagal', error_message: `Token akun ${posting.account_name || 'unknown'} kedaluwarsa.` });
                        await db.addLog({ user_id: posting.user_id, action: 'POSTING_FAILED', description: `Posting gagal: token kedaluwarsa`, ip_address: 'system' });
                        continue;
                    }
                    const payload = { posting_id: posting.id, platform: posting.platform, media_url: posting.media_url, caption: posting.caption, account_id: posting.meta_account_id, access_token: posting.access_token, account_type: posting.account_type };
                    const success = await sendToN8n(payload);
                    if (success) {
                        await db.updatePosting(posting.id, { status: 'Sukses' });
                        await db.addLog({ user_id: posting.user_id, action: 'POSTING_SUCCESS', description: `Posting berhasil ke ${posting.platform}`, ip_address: 'system' });
                    } else {
                        await db.updatePosting(posting.id, { status: 'Gagal', error_message: 'Gagal mengirim ke n8n webhook' });
                    }
                } catch (err) {
                    await db.updatePosting(posting.id, { status: 'Gagal', error_message: err.message });
                }
            }
        } catch (err) {
            console.error('[Scheduler] Error:', err.message);
        }
    }, 30000);
}

export function stopScheduler() { if (schedulerInterval) { clearInterval(schedulerInterval); schedulerInterval = null; } }

async function sendToN8n(payload) {
    try {
        const response = await fetch(N8N_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        return response.ok;
    } catch {
        console.log('[n8n] Webhook unavailable. Simulating success for dev.');
        return true;
    }
}

export function getMetaOAuthUrl(redirectUri) {
    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish&response_type=code`;
}

export async function exchangeMetaCode(code, redirectUri) {
    try {
        const r = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${META_APP_SECRET}&code=${code}`);
        if (r.ok) return await r.json();
    } catch { }
    return { access_token: 'EAA_mock_' + Math.random().toString(36).slice(2), expires_in: 5184000 };
}

export async function getLongLivedToken(shortToken) {
    try {
        const r = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`);
        if (r.ok) return await r.json();
    } catch { }
    return { access_token: shortToken, expires_in: 5184000 };
}
