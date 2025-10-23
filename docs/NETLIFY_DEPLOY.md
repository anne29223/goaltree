# Deploying to Netlify for Android TWA

1. Create a Netlify account and site (https://app.netlify.com/)
2. Connect your GitHub repo or drag-and-drop the `dist/` folder for manual deploy
3. Set build command: `npm run build` and publish directory: `dist`
4. After deploy, copy your site URL (e.g., `https://goaltree.netlify.app`)
5. Update `twa-manifest.json`:
   - "manifest_url": "https://goaltree.netlify.app/manifest.json"
   - "host": "goaltree.netlify.app"
6. Run Bubblewrap:
   - `npm run bubblewrap:init -- --auto`
   - This will generate the Android project and prompt for JDK/SDK if needed
7. Build the Android App Bundle (AAB):
   - In the generated project, run `.\gradlew.bat bundleRelease` (Windows) or `./gradlew bundleRelease` (Mac/Linux)
   - The AAB will be in `app/build/outputs/bundle/release/app-release.aab`
8. Upload the AAB to Google Play Console
   - Follow `docs/PLAY_PUBLISH.md` for Play Store steps

## Notes
- You can automate deploys with the provided GitHub Actions workflow (`.github/workflows/deploy.yml`) by setting `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` as repo secrets.
- For manual deploy, just drag `dist/` into Netlify UI.
- Make sure your manifest and icons are accessible at the Netlify URL before running Bubblewrap.
