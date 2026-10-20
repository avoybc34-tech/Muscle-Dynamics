# Android & iPhone — Expo Go first

The member app uses the same API/database as the website. It includes login/signup, membership/plans, manual payment account/receipt submission/history, protected receipt viewing, classes, progress, in-app updates, support, profile and password changes. Owner/staff operations open the admin **website**, not a second native admin app.

## Test with Expo Go
1. Install a compatible **Expo Go** version on your Android phone/iPhone. This source targets Expo SDK 58. If your device’s available Expo Go does not support it, use the matching supported client/development build; do not downgrade random packages independently.
2. From the `mobile` folder:
   ```sh
   npm ci
   npm run typecheck
   npm start
   ```
3. Keep computer and phone on a reachable network. Scan the Metro QR in Expo Go (iPhone may use Camera). Firewall/corporate Wi-Fi can block local discovery; consult Expo networking/tunnel instructions if needed. Expo Go/Metro are development tools, not a production hosting replacement.
4. In **Connect to your gym**, enter your deployed HTTPS backend origin. Do not enter its `/api`, `/admin.html` or your database URL. Local development HTTP is allowed only in development mode; use your computer’s LAN IP, not `localhost` on the phone. Production/release builds require HTTPS.
5. Sign in with an account from your own backend. Registration is blocked until the owner publishes required details/policies. Test using a separate staging database/accounts; do not send real money to test fixtures.
6. Select a configured plan/account, inspect instructions, transfer outside the app only when intended, choose JPG/PNG/WebP receipt up to 5 MB, add sender/transaction details and submit. No automatic payment success occurs. Unsupported photo formats must be converted first.
7. Have the owner independently verify actual funds and approve/reject from the website. Pull to refresh the app or return it to the foreground to fetch status/notifications.

Native auth tokens use SecureStore, not plain AsyncStorage. Private receipts are requested with bearer authorization. Notifications are **in-app records**, not APNs/FCM push, SMS, email or background alerts. Reopen/refresh to see changes.

## Physical-device acceptance checklist (not performed here)
- Test iPhone and Android account creation, terms links, login/logout, keyboard layout and password change.
- Receipt picker, denied permissions, JPG/PNG/WebP upload/retry, upload size limit and protected image display.
- Pending state grants no access; approval/rejection appear correctly after refresh; renewals extend correctly.
- Booking/cancel/full class, progress chart/logs, support reply, offline/error/reconnect and expired sessions.
- Long names/plan text, large text settings, small screens, safe areas/tablet orientation and accessibility labels.

## Later signed builds
Expo export only validates/generates JS assets. It does **not** create an APK/IPA, register devices, sign a binary or publish to a store.

Before EAS:
1. Resolve/review advisories in `VERIFICATION.md`; rerun both audits and tests.
2. Replace `com.yourgym.muscledynamics` in `mobile/app.json` with your owned unique iOS bundle identifier/Android package.
3. Add your licensed icon/splash, actual privacy/terms/support URLs and store metadata. Decide version/build numbering. Remove placeholder EAS project ID by linking your own project:
   ```sh
   npx eas-cli@latest login
   npx eas-cli@latest init
   ```
4. Configure public `EXPO_PUBLIC_API_URL` in the relevant EAS environment/profile or connect manually in app. Never place database/password/signing secrets in `EXPO_PUBLIC_` variables.
5. Ensure an Expo/EAS account, cloud build availability/billing and required platform developer access. Do not send credentials to the assistant or commit signing material.

### Android internal APK
```sh
npm run build:android
```
Uses EAS `preview` internal distribution with APK. Manage your own Android signing key and backups. Google Play release requires a store profile/build, Play Console access and current policy/data-safety requirements.

### iPhone internal signed IPA
Paid Apple Developer membership/signing access is normally required for this EAS physical-device distribution. Register test iPhone(s) with EAS before an ad-hoc/internal build:
```sh
npx eas-cli@latest device:create
npm run build:ios
```
On Windows, `BUILD-IPHONE.bat` runs the same guarded script. The script refuses the placeholder bundle ID/unlinked project. EAS cloud can build iOS from Windows; local iOS builds require macOS/Xcode. An ad-hoc IPA is limited to provisioned devices, not universally installable on any iPhone.

### TestFlight
```sh
npm run build:ios -- --testflight
```
Requires your App Store Connect app, signing/team setup and Apple approval as applicable. Submission is a separate deliberate step, e.g. `npx eas-cli@latest submit --platform ios --profile production`; it was not executed. TestFlight is not a raw unsigned IPA download.

### Store-policy work still required
Current source handles data/account-deletion requests through gym Support, not an automatic deletion flow. Review current Apple/Google account-deletion/privacy requirements, retention exceptions for financial records, physical-service payment rules and age/health-related disclosures. Implement any required in-app/web deletion workflow before store submission. This source is not represented as app-store approved.
