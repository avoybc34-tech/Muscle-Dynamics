# Muscle Dynamics mobile — build in your browser

This folder is part of the **full web + app repository**. Do not upload this folder alone. The build workflow lives in the repository-root `.github/workflows/build.yml`, and the shared website/database deploys from the repository root on Render.

1. Deploy the full website/database using the root README and finish owner setup. Copy the public **HTTPS web service URL**, e.g. `https://YOUR-SERVICE.onrender.com`. Use the origin only, no `/api`, paths or passwords.
2. Open the repository's **Actions** tab. Enable workflows if GitHub asks. Choose **Build APK and unsigned IPA → Run workflow**. The workflow must be present on the default branch for the Run button to appear.
3. Choose `both`, `android`, or `ios`. Enter that HTTPS web URL in `backend_url`, or leave blank and use the app's Connect screen after installation. Check the explicit test-build acknowledgement. No Apple Developer login, EAS project, Expo login, DB password or signing secret is requested.
4. Wait for checks and the selected native build jobs. Open the completed run → **Artifacts**. Download `Muscle-Dynamics-Android-TEST-APK` or `Muscle-Dynamics-iPhone-UNSIGNED-IPA` and unzip the downloaded artifact. `SHA256SUMS.txt` accompanies the native file; build logs and security reports are separate artifacts. Artifacts expire after 7 days: download them promptly.
5. Android: install the TEST APK on a compatible device, granting install permission only for your trusted download source. It bundles JS and does not require Metro/your PC. It uses a publicly known test key and is **not production signing**. If an older differently signed app uses this package ID, back up any needed data before uninstalling it to resolve a signature conflict.
6. iPhone: this is a device IPA but **UNSIGNED**. It will not normally install or launch without separate valid signing/provisioning. It is not App Store/TestFlight-ready. This workflow does not circumvent Apple's signing rules.
7. Sign in/register using the same website account. A blank backend can be set using **Connect** in the app. Use your Render web URL, never a MariaDB URL, localhost, or a private Render DB hostname. Public app configuration contains only the web origin—not DB credentials.

GitHub-hosted runner usage, especially macOS/private-repository minutes, may have charges/limits under your account plan. Review GitHub billing before running builds. No cloud build has been executed for you. If a job fails, download the specific build logs; don't expose member data, passwords, tokens or signing keys.

The initial generic package IDs are `com.muscledynamics.members`. Ownership/availability of those IDs is not asserted. Review/change them and configure actual production signing before distribution. Changing an app's backend changes the account/data source; the app does not copy data between servers.

## Security and verification

Read `SECURITY.md` and root `VERIFICATION.md`. The app dependency audit has unresolved upstream findings; these builds are explicitly for testing. Do not run `npm audit fix --force` or bypass dependency constraints as a blind fix. Root website and mobile use separate lockfiles so the mobile development toolchain is not installed by Render.

## Developer-only internals

SDK 58 / React Native 0.88. Source checks, Expo Doctor, Android/iOS JS exports and build workflow lint are checked in the supplied environment. Native projects are generated in the GitHub jobs. Android uses Java 17; iOS uses a macOS runner with Xcode. Native compilation still needs the real Actions run to verify runner/toolchain compatibility.
