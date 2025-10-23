<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1wKt3gulLE_I1JwYpsuPO02ByBxoptqxM

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Building, icons, and publishing

1. Generate platform icons (creates `public/icons/icon-192.png`, `icon-512.png`, and `icon-maskable.png`):

   `npm run generate-icons`

2. Build for production:

   `npm run build`

3. Initialize a Trusted Web Activity (TWA) project with Bubblewrap:

   `npm run bubblewrap:init` (prints the `npx @bubblewrap/cli init` command)

   or to run it and allow Bubblewrap to download SDKs/JDK:

   `npm run bubblewrap:init -- --auto`

4. CI/CD: A GitHub Actions workflow is provided to deploy to Netlify. Set `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` in repository secrets.

