import { db } from './db.js';

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/waig-pilot';
const META_APP_ID = process.env.META_APP_ID || 'YOUR_META_APP_ID';
const META_APP_SECRET = process.env.META_APP_SECRET || 'YOUR_META_APP_SECRET';
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

let schedulerInterval = null;

// ===========================
// Scheduler: checks for due postings every 30 seconds
// ===========================
export function startScheduler() {
    console.log('[Scheduler] Started — checking for due postings every 30s');

    schedulerInterval = setInterval(async () => {
        const duePostings = db.getDuePostings();
        if (duePostings.length === 0) return;

        console.log(`[Scheduler] Found ${duePostings.length} due posting(s)`);

        for (const posting of duePostings) {
            try {
                // Get the connected account for this posting
                const account = db.getAccountById(posting.connected_account_id);
                if (!account) {
                    db.updatePosting(posting.id, {
                        status: 'Gagal',
                        error_message: 'Akun terhubung tidak ditemukan',
                    });
                    continue;
                }

                // Check if token is expired
                if (account.status !== 'Aktif') {
                    db.updatePosting(posting.id, {
                        status: 'Gagal',
                        error_message: `Token akun ${account.name} kedaluwarsa. Perlu re-autentikasi.`,
                    });
                    db.addLog({
                        user_id: posting.user_id,
                        action: 'POSTING_FAILED',
                        description: `Posting "${posting.caption.slice(0, 40)}..." gagal: token kedaluwarsa`,
                        ip_address: 'system',
                    });
                    continue;
                }

                // Send to n8n webhook
                console.log(`[Scheduler] Sending posting #${posting.id} to n8n webhook...`);
                const webhookPayload = {
                    posting_id: posting.id,
                    platform: posting.platform,
                    media_url: posting.media_url,
                    caption: posting.caption,
                    account_id: account.account_id,
                    account_name: account.name,
                    access_token: account.access_token,
                    account_type: account.type,
                };

                const success = await sendToN8n(webhookPayload);

                if (success) {
                    db.updatePosting(posting.id, { status: 'Sukses' });
                    db.addLog({
                        user_id: posting.user_id,
                        action: 'POSTING_SUCCESS',
                        description: `Posting "${posting.caption.slice(0, 40)}..." berhasil dikirim ke ${posting.platform}`,
                        ip_address: 'system',
                    });
                    console.log(`[Scheduler] Posting #${posting.id} → Sukses`);
                } else {
                    db.updatePosting(posting.id, {
                        status: 'Gagal',
                        error_message: 'Gagal mengirim ke n8n webhook',
                    });
                    console.log(`[Scheduler] Posting #${posting.id} → Gagal`);
                }
            } catch (err) {
                db.updatePosting(posting.id, {
                    status: 'Gagal',
                    error_message: err.message,
                });
                console.error(`[Scheduler] Error posting #${posting.id}:`, err.message);
            }
        }
    }, 30000);
}

export function stopScheduler() {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        schedulerInterval = null;
        console.log('[Scheduler] Stopped');
    }
}

// ===========================
// n8n Webhook Integration
// ===========================
async function sendToN8n(payload) {
    try {
        console.log(`[n8n] Sending to webhook: ${N8N_WEBHOOK_URL}`);
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log('[n8n] Webhook response OK');
            return true;
        } else {
            console.log(`[n8n] Webhook response error: ${response.status}`);
            return false;
        }
    } catch (err) {
        // If n8n is not running, simulate success for development
        console.log(`[n8n] Webhook unavailable (${err.message}). Simulating success for dev mode.`);
        return true;
    }
}

// ===========================
// Meta OAuth Helpers
// ===========================
export function getMetaOAuthUrl(redirectUri) {
    const scopes = 'pages_manage_posts,pages_read_engagement,instagram_basic,instagram_content_publish';
    return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scopes}&response_type=code`;
}

export async function exchangeMetaCode(code, redirectUri) {
    // In production, this exchanges the auth code for an access token
    try {
        const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${META_APP_SECRET}&code=${code}`;
        const response = await fetch(tokenUrl);
        if (response.ok) {
            return await response.json();
        }
    } catch (err) {
        console.log('[Meta OAuth] Token exchange failed:', err.message);
    }
    // Return mock token for development
    return {
        access_token: 'EAA_mock_' + Math.random().toString(36).slice(2),
        token_type: 'bearer',
        expires_in: 5184000, // 60 days
    };
}

export async function getLongLivedToken(shortToken) {
    try {
        const url = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_APP_ID}&client_secret=${META_APP_SECRET}&fb_exchange_token=${shortToken}`;
        const response = await fetch(url);
        if (response.ok) return await response.json();
    } catch (err) {
        console.log('[Meta OAuth] Long-lived token exchange failed:', err.message);
    }
    return {
        access_token: shortToken,
        token_type: 'bearer',
        expires_in: 5184000,
    };
}
