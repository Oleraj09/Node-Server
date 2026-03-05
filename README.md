# Get Web Chat Node.js Server

This is the required external Node.js backend for the **Get Web Chat** WordPress plugin. It provides the core functionality for synchronizing your website's live chat directly with your WhatsApp account using WhatsApp Web.

---

## 🚀 Cloud Hosting Recommendations

Running this server requires a platform capable of handling headless Chromium instances (Puppeteer). While 100% free forever hosting is becoming rare, the following platforms offer generous free tiers or low-cost options that support Docker:

### 1. Railway.app (Recommended Free Tier)
Railway provides a generous free tier of $5/month (around 500 hours) which supports Docker out of the box.
* Sign up at [Railway.app](https://railway.app/).
* Connect your GitHub and select this repository.
* Railway will automatically detect the `Dockerfile` and build it.

### 2. Render (Paid Plan Required)
*Because this app requires Docker to run Chromium, Render requires a paid "Starter" database plan to deploy it.*
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Oleraj09/Node-Server)

### 3. Oracle Cloud (Always Free)
Oracle offers an exceptionally powerful "Always Free" tier (up to 4 ARM CPUs and 24GB RAM). If you are comfortable using SSH, you can launch a free instance, SSH in, and follow the Manual Deployment steps below.

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
   git clone https://github.com/Oleraj09/Node-Server.git
   cd Node-Server
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
