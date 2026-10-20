# Muscle Dynamics — fixed mobile files + one-click iPhone build

## Apply this update
1. Close Metro/Expo and any running build. Back up your existing `mobile` folder.
2. Extract this ZIP. Copy **everything INSIDE its `mobile` folder** into your existing `Muscle Dynamics\mobile` folder. Choose Replace for matching files. Do not create `mobile\mobile`.
3. Do not delete or replace your existing `app.json`, `eas.json` or `.env`. This update ZIP intentionally does not contain those files, so your bundle identifier, EAS project ID, profiles and backend URL are preserved.
4. Double-click **BUILD-IPHONE.bat** inside your existing mobile folder.

No manual npm commands or Git installation are required by this launcher. Node.js 22.13+ (22 LTS recommended) and an internet connection are required. Run from an extracted folder, not inside the ZIP. File paths containing spaces are supported.

## What the launcher does
- Uses Expo SDK 58, React 19.3.0 and React Native 0.88.0 together, from the supplied matching package.json/lockfile. Adds expo-font as a direct native dependency for icons.
- Installs exact locked dependencies with npm ci, replacing incompatible generated dependencies. It never runs npm audit fix --force or --legacy-peer-deps.
- Uses EAS_NO_VCS=1 and an absolute EAS_PROJECT_ROOT pointing at this mobile folder. It does not need Git, initialise a repository in Downloads, or upload the gym backend folder.
- Uses mobile `.gitignore` and `.easignore` rules. Local .env files, credentials/signing files, device history, caches and backups are excluded from the source upload. EAS uses `.easignore` in preference to `.gitignore`.
- Backs up app.json/eas.json before merging. Preserves your non-placeholder bundle ID, existing EAS project ID, public URL/profile variables and custom profiles. Adds expo-font's config plugin and a compatible Node version to the preview/TestFlight profiles. It does not read/change `.env`.
- Moves disposable `.expo` device/server cache into excluded `.build-backups`. This also permits Doctor's common-setup check to pass when Git is unavailable, without pretending Git is installed or deleting app source.
- Runs Expo dependency checks, TypeScript, all Expo Doctor checks, an iOS JS/assets export, and npm audit. Errors stop the launcher with the window left open.
- Uses pinned EAS CLI 25.2.0, offers Expo sign-in/project linking only if needed, offers device registration, and starts an internal iOS cloud build with the old EAS cache cleared.

## First-run questions you must answer yourself
“One-click” means one launcher to perform checks and start a guided build, not unattended Apple signing.
- Supply your own unique bundle identifier only if it is still the placeholder.
- Sign into your Expo account in Expo's prompts. Existing linked projects are preserved.
- For a signed internal IPA, use your own paid Apple Developer team/signing access and register the test iPhone before the build. The optional device:create step provides a link to open on that phone. If already registered, answer n.
- Answer Apple/EAS signing prompts. EAS account/build availability and any costs remain your responsibility. Never send passwords, OTPs, Apple keys or certificates to the assistant.
- After a successful CLOUD build, use its EAS result page to download/install the IPA. An internal IPA is restricted to registered/provisioned devices.

## Your backend URL
Your existing `.env` is preserved but is intentionally NOT uploaded with the build. For a default server URL in the binary, configure EXPO_PUBLIC_API_URL in your EAS environment/profile (public HTTPS URL only, never a database/password). Otherwise the app's Connect screen lets you enter the gym's HTTPS backend after installing. localhost/MariaDB/HeidiSQL are not mobile backend origins. No MariaDB or API server is embedded in an IPA.

## Check without creating a paid build
Double-click CHECK-MOBILE.bat. It installs and validates but does not sign in, upload, register a device or start a cloud build. It may back up/merge app/eas configuration as described above.

## Important unresolved security status
15 high-severity package-chain findings remain in upstream Metro/braces and Expo signing/node-forge dependencies at the time of this update. The launcher prints the current audit. Internal preview building requires explicit acknowledgement that it is for device testing only; passing Doctor does not mean production security approval. This launcher blocks its TestFlight/store route while high/critical findings remain. Ask your developer to resolve/review the advisories before public distribution. No automatic downgrade is applied.

## Verified for this update
- Expo Doctor: **20/20 checks passed**, also with Git deliberately unavailable and a pre-existing `.expo` cache.
- Native TypeScript: passed.
- iOS and Android JavaScript/asset exports: passed (not native signed binaries).
- Expo native configuration introspection (including expo-font plugin): passed.
- EAS 25.2.0 actual no-VCS archive-copy code: includes mobile source and excludes caches/backups/local environment files.
- 4 launcher preparation tests: config preservation, paths with spaces, local-cache backup/.env preservation, incompatible-version guard and dynamic-config guard.

Checks were executed in the Linux workspace, not on your Windows PC. Windows batch/PowerShell UI execution, Apple signing, full native cloud compilation, physical iPhone installation and a real IPA remain unverified here. No Expo/Apple account was accessed and no cloud build was started by the assistant.

## Troubleshooting
- If you see React Native 0.72.17 again, the update was copied into the wrong folder, or package.json/lockfile was subsequently modified. Reapply BOTH files from this ZIP.
- If app.config.js/ts/mjs exists, the launcher stops rather than replacing your custom dynamic config. Have your developer merge it.
- If npm ci fails on permissions/locked files, close Expo and editors using node_modules, then retry. Use a normal extracted writable folder.
- If a build fails in EAS after the local checks, send the first actual build error section (not passwords or secrets). Local checks cannot guarantee Apple signing/native compilation succeeds.
- Never copy .env, signing keys, `.build-backups` or node_modules into a public repository.
