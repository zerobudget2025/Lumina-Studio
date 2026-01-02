# 🚀 Deployment & Operation Guide
**Lumina Image Studio v3.0 Stable** — A NightOwl Creation

This guide covers the deployment of the Lumina Creative Suite and the configuration of the Pro-tier Gemini 3 Pro engine.

---

## 📋 Standard Deployment

### 1. Environment Setup
- **Global API Key**: The application requires an `API_KEY` from [Google AI Studio](https://aistudio.google.com/).
- **Static Hosting**: Compatible with Vercel, Netlify, or GitHub Pages. No backend build step required.

### 2. Quick-Start (Vercel/Netlify)
1. Push the project files to a GitHub repository.
2. Link the repository to your hosting provider.
3. Define the **Environment Variable**:
   - `API_KEY`: [Your Gemini API Key]
4. Deploy. The application uses native ES6 modules; no bundler is strictly necessary if your server serves `.tsx` as modules.

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