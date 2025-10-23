Publishing Goal Tree to Google Play (step-by-step)

Before you start:
- You'll need a Google Play Developer account ($25 one-time fee).
- Have your signed AAB ready (see docs/TWA_INSTRUCTIONS.md for Bubblewrap/Android Studio steps).
- Prepare store listing assets: high-res icon (512x512 png), feature graphic (1024x500), screenshots (phone/tablet), promo video (optional), privacy policy URL.

1) Create the app in Play Console
- Sign in to Play Console -> All apps -> Create app
- Enter app name, default language, app or game -> App, Free/paid
- Agree to Developer Program Policies

2) App access & privacy
- Provide contact email and optionally website/phone
- Add privacy policy URL (required if app handles personal data)

3) App content & rating
- Complete Content Rating questionnaire
- Complete Target Audience and Families if applicable

4) Prepare Release
- Go to Release > Production (or Internal testing for quick internal rollout)
- Create a new release
- Upload the signed AAB
- Enter release notes

PowerShell tip to upload via Play Developer API (optional/advanced):
- Use Google API client or fastlane supply; most teams upload via console UI.

5) Store listing
- Add short and full description, visuals, screenshots
- Upload 512x512 icon and feature graphic

6) Pricing & Distribution
- Choose countries and whether the app is paid/free

7) Final checks & roll out
- Save and review
- For internal testing: create internal testing track, add testers (emails), and start rollout
- For production: review and submit for review

Common issues & checks
- Ensure the AAB is signed, uses correct package name (matching Bubblewrap or Android project)
- Manifest hosted on HTTPS and icons accessible
- App privacy & data handling documented

