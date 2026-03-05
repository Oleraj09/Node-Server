# Get Web Chat Node.js Server

This is the required external Node.js backend for the **Get Web Chat** WordPress plugin. It provides the core functionality for synchronizing your website's live chat directly with your WhatsApp account using WhatsApp Web.

---

## 🚀 Quick Deployment (Recommended)

The easiest way to get your server running is to deploy it to a free or low-cost cloud hosting provider. Select one of the buttons below to create your own server in minutes.

### Deploy to Render
1. Click the button below to deploy this repository directly to Render.
2. Sign up or log into your Render account.
3. Follow the setup prompts to deploy your web service.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy) *(Note to Developer: Update this link with your actual Render deploy template link once the repository is live)*

---

## 💻 Manual Deployment (VPS / Self-hosted)

If you prefer to host this Node server on your own VPS (Virtual Private Server), such as DigitalOcean, AWS, or your Local Machine, follow these steps:

### Requirements
* Node.js (v16 or higher recommended)
* npm (Node Package Manager)
* A server capable of running a headless Chromium browser instance.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/get-web-chat-server.git
   cd get-web-chat-server
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Connect WhatsApp:**
   The very first time you start the server, a QR code will be generated in your terminal console. Open the WhatsApp app on your phone, go to **Linked Devices**, and scan the QR code to authenticate the server.

---

## 🔗 Connecting the Server to Your WordPress Plugin

Once your server is successfully running (either on a service like Render or your own VPS), you need to connect it to your WordPress plugin.

1. Copy the public URL of your Node.js server (e.g., `https://my-chat-server.onrender.com`).
2. Log into your WordPress admin dashboard.
3. Navigate to **Get Web Chat > Settings**.
4. Scroll down to the **Advanced Settings** section.
5. Paste your URL into the **Node.js Server URL** field.
6. Click **Save Changes**.

Your plugin is now fully synchronized with your WhatsApp account!

---

## Troubleshooting

* **Server crashes on start:** The `whatsapp-web.js` library uses a headless Chromium browser. If you are deploying on a minimal Linux VPS, you may need to install the necessary Chrome dependencies manually.
* **Messages aren't syncing:** Ensure the URL pasted in the WordPress plugin settings does not contain a trailing slash (e.g., use `https://server.com` instead of `https://server.com/`).
