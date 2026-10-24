# Build test APK and unsigned IPA using GitHub

No BAT/CMD launcher or local Windows npm installation is required for this path.

1. Extract the ZIP. Upload the **contents** of `muscle-dynamics-pro/` to your private GitHub repository, including `.github/`. The workflow must be at repository root: `.github/workflows/build.yml`.
2. Open **Actions → Build Muscle Dynamics APK and unsigned IPA → Run workflow**.
3. Choose `android`, `ios` or `both`.
4. Optionally supply your actual HTTPS API origin (`backend_url`) and real Expo/EAS project UUID (`expo_project_id`). Leave them blank if configuring later. Never put passwords/tokens in these inputs.
5. Read and enable the **test-build acknowledgement**. These are not production releases.
6. Run the workflow. Checks include TypeScript, mobile tests, Expo Doctor, exports, an audit report, and a fresh MariaDB backend integration-test job. Native jobs depend on both check jobs.
7. If the run succeeds, download the Android/iOS artifacts. They include notices, checksums and available build logs. If it fails, inspect the failed job; do not treat a source/export pass as a built binary.

## Android

The workflow assembles a release-mode APK with bundled JavaScript, verifies APK signing and packages `Muscle-Dynamics-ANDROID-TEST.apk`. It uses a **public test key**, not a private production signing identity. Enable installation only for trusted test artifacts. An existing install signed with a different certificate may require uninstalling it; this deletes that app's local session.

For push, the optional `GOOGLE_SERVICES_JSON_BASE64` repository secret must belong to package `com.muscledynamics.members`. FCM v1 provider credentials must also be configured separately with Expo. Do not commit the JSON or private service-account keys.

## iOS

The macOS job builds a device-targeted Release archive with code signing disabled, verifies embedded JS, and packages `Muscle-Dynamics-UNSIGNED.ipa`.

**Unsigned is not normally installable on an iPhone.** Apple signing/provisioning and an authorized installation/distribution path are separate requirements. This is not TestFlight/App Store distribution and does not prove APNs delivery. No Apple signing identity is included.

## Important limits

This workspace executed source checks, exports, native project generation and structural workflow lint. **It did not run GitHub Actions, Gradle assembly, CocoaPods/Xcode archive or physical-device installation.** Native build success remains an execution gate. Runner/provider versions and dependency advisories should be rechecked when you run it. The audit is intentionally reported rather than “fixed” by a forced incompatible Expo downgrade.
