# 🚀 Installation & Deployment Guide
**Lumina Image Studio** — A NightOwl Creation | Property of Just Me Media

This guide explains how to deploy this application to your own URL and allow others to use it.

---

## 📋 Prerequisites
1. **Google AI Studio API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/).
2. **Web Hosting**: A platform for static web hosting (Vercel, Netlify, or GitHub Pages).
3. **Domain Name**: (Optional) Your own custom URL (e.g., `studio.yourname.com`).

---

## 🛠️ Deployment Methods

### Option 1: Quick Cloud Deployment (Recommended)
The easiest way to run this is using a modern frontend cloud platform.

1. **Upload Files**: Upload the contents of this directory to a GitHub repository.
2. **Connect to Hosting**: 
   - Sign in to **Vercel** or **Netlify**.
   - Create a "New Project" and select your repository.
3. **Configure Environment Variables**:
   - In your hosting dashboard, go to **Settings > Environment Variables**.
   - Add a new variable:
     - **Key**: `API_KEY`
     - **Value**: `your_google_gemini_api_key_here`
4. **Deploy**: Click "Deploy". Your app will be live at a public URL!

### Option 2: Manual Installation on a Web Server
If you are adding this to an existing website:

1. **Upload via FTP**: Upload all `.html`, `.ts`, `.tsx`, and `.json` files to your server directory (e.g., `/public_html/studio`).
2. **Modules Note**: This app uses `esm.sh` and browser-native ES6 modules. Ensure your server serves `.tsx` files with the correct MIME type (`application/javascript` or `text/typescript`) if your server doesn't automatically handle it, or use a simple bundler like **Vite**.

---

## 🧩 Embedding into an Existing Page
To add Lumina as a feature inside your current website, use an `iframe`:

```html
<div style="width: 100%; height: 800px; border-radius: 20px; overflow: hidden; border: 1px solid #1e293b;">
  <iframe 
    src="https://your-studio-url.com" 
    style="width: 100%; height: 100%; border: none;"
    title="Lumina Image Studio"
    allow="camera; microphone; clipboard-read; clipboard-write; geolocation"
  ></iframe>
</div>
```

---

## 🔐 Security & User Access

- **Public Access**: When running from your URL, anyone with the link can generate images using your API key. 
- **Cost Management**: Monitor your usage in the Google Cloud Console. To prevent others from "draining" your credits, consider adding a basic login wall (like Firebase Auth or Supabase) before the app loads.
- **Pro Features**: The "Upgrade to Pro" button in the app is pre-configured to handle Google's standard API selection dialog for paid-tier features.

---

## 🎨 Branding Customization
To personalize the app for your specific URL:
1. **Header**: Edit `components/Header.tsx` to change the logo or title.
2. **Footer**: Edit `App.tsx` to update the ownership/copyright text.
3. **Metadata**: Update `metadata.json` so the app looks professional when saved to a mobile home screen.

---

**Support**: For technical inquiries, contact the development lead **NightOwl** via **Just Me Media**.
