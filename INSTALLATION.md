# 🚀 Deployment & Operation Guide
**Lumina Image Studio v3.0 Stable** — A NightOwl Creation

This guide covers the deployment of the Lumina Creative Suite and the configuration of the Pro-tier Gemini 3 Pro engine.

---

## 📋 Vercel + GitHub Deployment (Recommended)

This is the fastest way to get a shareable URL.

### 1. Create a Repository
1. Initialize a new GitHub repository.
2. Push all files (including `package.json`, `vite.config.ts`, and the source code).

### 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your Lumina GitHub repository.
4. **Environment Variables (CRITICAL)**:
   - During the import step, find the **"Environment Variables"** section.
   - Add a new entry:
     - **Key**: `API_KEY`
     - **Value**: [Your Gemini API Key from Google AI Studio]
   - *Note: You do not need to push a `.env` file to GitHub. Vercel handles this securely in their dashboard.*
5. Click **"Deploy"**.

### 3. Local Development
1. Clone the repository.
2. Locate `env.template.txt` in the root directory.
3. Rename `env.template.txt` to `.env`.
4. Open `.env` and replace `your_api_key_here` with your actual key.
5. Run `npm install` and `npm run dev`.

---

## 💎 Pro-Tier Configuration (Gemini 3 Pro)

Lumina v3.0 introduces support for the **Gemini 3 Pro** image model. This requires specific user-side authentication:

- **Key Selection**: Pro features trigger the `window.aistudio.openSelectKey()` dialog.
- **Billing**: Users must select an API key associated with a **paid GCP project**. Refer them to [ai.google.dev/gemini-api/docs/billing](https://ai.google.dev/gemini-api/docs/billing).
- **Permissions**: Ensure your domain is authorized in your Google Cloud Console if you encounter "Requested entity not found" errors.

---

## 🎹 Keyboard Shortcuts
Lumina is designed for power users. The following shortcuts are active in v3.0:
- `Cmd + Enter` (Mac) / `Ctrl + Enter` (Windows): Trigger Generation.
- `ESC`: Clear current error/modal (Coming in v3.1).

---

## 🎨 Branding Customization
- **Logo**: Edit `components/Header.tsx` and `components/ImageDisplay.tsx` to modify the SVG "Aethelred" Mark.
- **Identity**: Update `metadata.json` to change the PWA name and icons for your specific instance.

---

**Technical Support**: Contact **NightOwl** via the **Just Me Media** development portal for enterprise integration or custom license inquiries.
