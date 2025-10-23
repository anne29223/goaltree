TWA (Trusted Web Activity) instructions for Goal Tree

This document explains how to wrap this PWA in an Android app using Bubblewrap and build a signed AAB for Play Store.

Prerequisites (Windows PowerShell):
- Java JDK 11+ installed and JAVA_HOME set
- Android SDK and Android Studio (or command-line sdkmanager + gradle)
- Node.js and npm installed
- OpenSSL (optional for key generation) or use keytool from JDK

1) Ensure your site is hosted on HTTPS and `https://yourdomain/manifest.json` is reachable.

2) Install Bubblewrap (globally or npx):

  npm install -g @bubblewrap/cli

3) Prepare a `twa-manifest.json` (sample below). Save it locally.

Sample `twa-manifest.json`:

{
  "name": "Goal Tree",
  "short_name": "GoalTree",
  "start_url": "/",
  "display": "standalone",
  "scope": "/",
  "theme_color": "#0ea5e9",
  "background_color": "#0f172a",
  "orientation": "portrait-primary",
  "manifest_url": "https://yourdomain/manifest.json",
  "host": "yourdomain",
  "packageId": "com.jjmtechllc.goaltree",
  "launcherName": "Goal Tree",
  "versionCode": 1
}

4) Generate the Android project with Bubblewrap (PowerShell-friendly):

  bubblewrap init --manifest=https://yourdomain/manifest.json --host=yourdomain --packageId=com.jjmtechllc.goaltree

Follow interactive prompts (or pass flags). This will create an Android project folder.

5) Build a debug AAB locally (inside generated project):

  cd into the generated android project (usually `twa-project`)
  ./gradlew buildBundle

On Windows PowerShell, use Gradle wrapper `gradlew.bat`:

  .\gradlew.bat buildBundle

6) Generate a signing key (if you don't have one):

  keytool -genkeypair -v -keystore release-keystore.jks -alias goaltree-key -keyalg RSA -keysize 2048 -validity 10000

7) Sign the bundle and produce a final AAB for upload. Configure `signingConfigs` in `app/build.gradle` or use the Play Console to manage signing.

8) Upload the signed AAB to Google Play Console, fill in store listing, content rating, privacy policy, and roll out to internal testing.

Notes & Tips:
- Use `bubblewrap build` to run common tasks. See Bubblewrap docs for more flags.
- If you prefer GUI: open the generated Android project in Android Studio and build a signed bundle via Build > Generate Signed Bundle / APK.
- Keep your manifest icons available on your hosted site; Play uses the icon in the PWA manifest for badge and splash.

