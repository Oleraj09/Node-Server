const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios'); // Add axios for HTTP requests

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

const sessions = {}; // Map of sessionId -> remoteId (WhatsApp contact)

client.on('qr', (qr) => {
    console.log('SCAN THIS QR CODE WITH WHATSAPP:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Client is ready!');
});

io.on('connection', (socket) => {
    console.log('A user connected to the bridge');

    let adminPhone = "";
    let wpUrl = "";

    socket.on('init', (data) => {
        adminPhone = data.adminPhone;
        wpUrl = data.wpUrl;
        console.log(`Admin phone set to: ${adminPhone}, WP URL: ${wpUrl}`);
    });

    socket.on('web_message', async (data) => {
        const { sessionId, text, userName, userPhone } = data;
        console.log(`Received message from web [${sessionId}] (${userName || 'Guest'}): ${text}`);

        if (!adminPhone && data.syncMode === 'whatsapp') {
            console.error('Admin phone not set for this session');
            return;
        }

        // Only send to WhatsApp if sync_mode is 'whatsapp'
        const syncMode = data.syncMode || 'whatsapp';

        if (syncMode === 'whatsapp') {
            const targetNumber = adminPhone.includes('@c.us') ? adminPhone : `${adminPhone}@c.us`;

            try {
                const waMessage = `[Live Chat - ${userName || 'Guest'}]\nPhone: ${userPhone || 'N/A'}\n\n${text}`;
                await client.sendMessage(targetNumber, waMessage);
                sessions[sessionId] = socket.id;
                console.log(`Message forwarded to WhatsApp admin`);
            } catch (err) {
                console.error('Failed to send WhatsApp message:', err);
            }
        }

        // Save user message to WordPress DB
        if (wpUrl) {
            const saveUrl = wpUrl.includes('?') ? `${wpUrl}&rest_route=/wls/v1/save-message` : `${wpUrl}/wp-json/wls/v1/save-message`;
            console.log(`Attempting to save message to: ${saveUrl}`);
            try {
                await axios.post(saveUrl, {
                    sessionId: sessionId,
                    userName: userName,
                    userPhone: userPhone,
                    text: text,
                    type: 'user'
                });
                console.log('Message saved successfully to WordPress DB');

                // NEW: Broadcast to dashboard for real-time update
                io.emit('new_web_message', {
                    sessionId: sessionId,
                    userName: userName || 'Guest',
                    userPhone: userPhone || 'N/A',
                    message_text: text,
                    message_type: 'user',
                    created_at: new Date().toISOString()
                });
            } catch (saveErr) {
                console.error('Failed to save user message to WP:', saveErr.message);
                if (saveErr.response) {
                    console.error('Response data:', saveErr.response.data);
                }
            }
        } else {
            console.error('WP URL not set. Cannot save message.');
        }
    });
});

// Sync replies from WhatsApp back to the web
client.on('message_create', async (msg) => {
    if (msg.fromMe) {
        // If the admin replies to a message that looks like [Live Chat - sessionId]
        const match = msg.body.match(/\[Live Chat - (.*?)\]/);
        if (match) {
            const sessionId = match[1];
            const replyText = msg.body.replace(/\[Live Chat - .*?\]/, '').trim();

            io.emit('whatsapp_reply', {
                sessionId: sessionId,
                text: replyText
            });
            console.log(`Forwarded reply to session ${sessionId}`);

            // We need a way to get the wpUrl for the admin reply. 
            // Since this event is global, we'll try to find a way to store/retrieve the wpUrl.
            // For now, let's use a simple global variable from the last 'init' call or assume it's consistent.
            // Ideally, the wpUrl should be a config/env var or stored in a way accessible here.

            // Getting wpUrl from global scope (simplified for this implementation)
            const globalWpUrl = wpUrl || process.env.WP_URL;

            if (globalWpUrl) {
                const saveUrl = globalWpUrl.includes('?') ? `${globalWpUrl}&rest_route=/wls/v1/save-message` : `${globalWpUrl}/wp-json/wls/v1/save-message`;
                try {
                    await axios.post(saveUrl, {
                        sessionId: sessionId,
                        text: replyText,
                        type: 'bot'
                    });
                } catch (saveErr) {
                    console.error('Failed to save admin response to WP:', saveErr.message);
                }
            }
        }
    }
});

const PORT = process.env.PORT || 3000;
const SYNC_MODE = process.env.SYNC_MODE || 'whatsapp';

app.use(express.json());

app.post('/dashboard-reply', (req, res) => {
    const { sessionId, text } = req.body;
    console.log(`Received dashboard reply for session ${sessionId}: ${text}`);

    io.emit('whatsapp_reply', {
        sessionId: sessionId,
        text: text
    });

    res.json({ success: true });
});

server.listen(PORT, () => {
    console.log(`Bridge server listening on port ${PORT}`);
    console.log(`Mode: ${SYNC_MODE.toUpperCase()}`);
});

if (SYNC_MODE === 'whatsapp') {
    client.initialize();
} else {
    console.log('WhatsApp Client NOT initialized (Website-Only Mode).');
}
