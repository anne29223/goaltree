QA Checklist for Goal Tree (PWA -> Play Store)

1) Lighthouse PWA audit
- In Chrome DevTools -> Lighthouse, run the PWA audit
- Aim for: Progressive Web App: Installable, Fast and Reliable
- Fix issues: missing icons, manifest, invalid service worker

2) Installability
- In Chrome on Android, visit your HTTPS site, open Chrome menu and "Add to Home screen" should be available
- In desktop Chrome, the install button should appear in the address bar if criteria met

3) Offline behavior
- With devtools offline, navigate the app and confirm critical pages load from cache
- Verify sensible fallback (e.g., index.html fallback for SPA)

4) Service worker
- Confirm sw is registered and controlling the page (Application tab -> Service Workers)
- Ensure updates are handled (skipWaiting/clients.claim usage if you expect fast activation)

5) TWA behavior
- Install the generated AAB on a device (internal test track)
- Verify the app launches full-screen without browser UI and supports back navigation
- Verify deep links and start_url behavior

6) Play Store checks
- Privacy policy link works
- App listing assets (icons, screenshots, feature graphic) are correct sizes and show the app clearly
- Content rating completed

7) Security & permissions
- If using any permissions (e.g., notifications), ensure you request them with clear rationale and document in privacy policy

8) Regression tests
- Test basic flows: create goal, add child goals, mark progress, edit/delete

