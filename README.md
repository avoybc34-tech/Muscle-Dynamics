# Muscle Dynamics — clean GitHub mobile build

**New standalone mobile repository. Not a patch. Do not mix it with the old EAS or backend folders.**

## What one manual workflow builds
| Download | What it really is |
|---|---|
| **Android TEST APK** | Release-mode Android app with bundled JavaScript, signed using the public Expo/Android test key. Installable for testing on supported ARM Android phones; not a production/Play Store signing setup. |
| **iPhone UNSIGNED IPA** | Device-targeted app archive packaged as an IPA **without Apple signing/provisioning**. It is **not normally installable on an iPhone** until separately signed/provisioned through an appropriate service or developer account. Not TestFlight/App Store ready. |

No Expo account, EAS project, Apple account, signing secret or bundle-ID prompt is required for these CI outputs. The initial test identifier is already set to `com.muscledynamics.members`. It is not asserted to be an Apple-registered identifier; choose your own identity/signing setup before any store release.

## Upload and build — no Git installation needed on your PC
1. Extract this ZIP into a **new folder**.
2. In your GitHub account, create a **new empty repository** (private recommended for your source; check your account's Actions allowance/costs).
3. Choose **Add file → Upload files**. Upload the **CONTENTS** of the extracted `muscle-dynamics-github` folder, including `.github`. Do **not** upload the ZIP itself or put another enclosing folder into the repository.
4. Commit the uploaded files to the default branch. At the repository top level you must see `package.json`, `App.tsx`, and `.github/workflows/build.yml` at that exact path.
5. Open **Actions → Build APK and unsigned IPA → Run workflow**. Enable Actions if GitHub asks.
6. Choose **both**, **android** or **ios**. Leave the backend URL blank to enter it in the installed app, or enter your actual public HTTPS API origin (not `/api`, localhost or your MariaDB URL).
7. Tick the explicit **testing-only acknowledgement**, then click **Run workflow**.
8. Wait for the checks and selected jobs. Open the completed run and scroll to **Artifacts**. Download and unzip the Android/iPhone artifact as appropriate. Each includes a signing-status notice and checksum. Logs are uploaded on failures.

The workflow runs **only when you click Run workflow**; uploading/pushing source does not automatically start billable builds. GitHub-hosted runners, macOS availability, account verification, plan quotas/minutes and any costs remain your responsibility. Nothing was uploaded or run in your GitHub account by the assistant.

### Important iPhone limitation
You selected **unsigned IPA**. Downloading it does not grant Apple installation rights. GitHub cannot turn it into a universally installable iPhone app without a separate valid signing/provisioning path. Expo Go remains an alternative for interactive development; it is not this IPA artifact.

### Android installation
Download/unzip the TEST APK artifact and transfer the `.apk` to your Android phone. Android may ask you to permit installation from that specific source. Do not disable general device protections. Use only your own trusted build. This APK targets ARM64/ARMv7 phones, not x86 Android emulators. It includes release JavaScript, so it does not need Metro/Expo Go running.

The key is a **public test/debug key**, not a private production key. Never publish this to Google Play or treat it as a secure distribution identity. If replacing an older test app with an incompatible signature, Android may require uninstalling the old test app first (which removes its local saved session/settings, not server-side membership records).

## Backend is separate
The gym API/MariaDB server is **not inside** the APK/IPA or this repository. Keep your existing backend project. The app retains membership, manual receipt submission/status, classes, progress, support, notifications and account screens, all using that backend.

For actual phones, provide a reachable HTTPS API origin. A database URL or your Windows localhost cannot be used. With a blank default, the first app screen asks for your gym's HTTPS server URL. Actual gym plans, payment accounts and policies remain owner-configured in the backend; no business data or login passwords are bundled.

## What was cleaned
- No EAS files, project IDs, local Expo device history, installed dependencies, receipts, database exports or signing keys.
- A matching Expo SDK 58 / React Native 0.88 / React 19.3 dependency set and lockfile; expo-font and expo-system-ui installed directly.
- Fresh MD app icons and matching test identifiers; no need to type a bundle ID for unsigned CI.
- One manually triggered Actions workflow; private credentials are not requested. Separate explicit TEST APK and UNSIGNED IPA outputs.
- Source/runtime code kept organized in `App.tsx` and `src/`; native projects generated fresh by Expo on each runner.

## Security / production status
**Unresolved upstream mobile dependency advisories remain.** The workflow makes the status visible and requires test-use acknowledgement; it does not claim that a passing build is a production security approval. See **SECURITY.md**. Do not use these builds with real financial/health data until developer review and physical-device testing are complete.

## Developer commands (optional)
Node 22.13+ required; CI pins 22.23.3.
```sh
npm ci
npm run check
npm run doctor
npm start
```
GitHub builds Android on Ubuntu 24.04 with Java 17 and the generated Gradle wrapper; iOS on macOS 26 with its installed Xcode/CocoaPods. See `VERIFICATION.md` for what was actually checked locally versus not yet run on GitHub.
