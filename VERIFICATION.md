# Offline design preview — verification, 24 October 2026

## What changed

This replaces the PC/API testing kit for the current app-design task. Only mobile source and its GitHub APK/unsigned-IPA workflow are included. There are NO BAT/CMD files, website, backend, database, tunnel or local server setup files.

The native app opens directly to an offline sample dashboard. Every screen has a persistent sample-data banner. The screen browser exposes welcome/login/signup, member tabs, plans/payment states, notifications, support and preview reset. No remote login, request transport, password change, personal-data persistence, receipt/gallery picker or payment processing is connected. Sample mutations are in memory and reset on restart. A bundled receipt image is explicitly marked NOT A PAYMENT.

## Checks completed

- Node 22.23.3; TypeScript passed.
- **14/14 tests passed**, including preview sample state, checkout/proof/pending simulation, booking/cancellation, in-memory progress/support/profile updates, blocked real password changes, absence of runtime network calls and no API workflow input.
- Expo dependency compatibility passed after updating the existing SDK 58 patch line to Expo ~58.0.19, expo-font ~58.0.10 and expo-status-bar ~58.0.4. Framework major versions remain SDK 58 / React Native 0.88 / React 19.3.
- Expo Doctor: **20/20 checks passed**.
- Android and iOS Hermes JavaScript exports passed with bundled sample receipt/artwork.
- Android and iOS native prebuild --no-install passed. Generated Android release test-signing configuration was checked; the iOS target/workspace remains MuscleDynamics. Generated native projects are NOT shipped.
- GitHub workflow actionlint 1.7.12 passed; the actionlint download checksum was verified before execution. Native scripts passed bash syntax checks. YAML structure checks confirm manual dispatch, three jobs, mobile working directory/lockfile and correct artifact/log paths.
- Official actions/upload-artifact v6 descriptor checked: node24 runtime. Official macOS 26 runner documentation checked for Xcode and cached Node 22.23.3 support. References: https://raw.githubusercontent.com/actions/upload-artifact/v6/action.yml and https://raw.githubusercontent.com/actions/runner-images/main/images/macos/macos-26-arm64-Readme.md . These checks do not guarantee provider images remain unchanged.
- Dependency audit: **5 high / 0 moderate / 0 critical** reported package-chain findings at preparation time. See mobile/SECURITY.md. The GitHub checks job publishes current security findings rather than hiding them. No unsafe forced dependency downgrade was used.
- Release package checked for manifest hashes, expected workflow/app files, and absence of private env files, old versions, dependencies, generated outputs, actual signing keys and BAT/CMD launchers.

## Not performed / important limits

- No access to your GitHub account, repository upload, Actions execution, native Gradle/Xcode compilation or deployment was performed. The ZIP contains SOURCE and workflows, not built APK/IPA binaries.
- Native compilation still needs a successful real GitHub run. Prebuilds, TypeScript and JS exports are not substitutes for that run. No physical-device UI or full native navigation testing is claimed here.
- APK uses a public test key; not production/Play Store signing. Unsigned device IPA needs separate valid signing/provisioning before normal installation. This does not bypass Apple rules and is not a TestFlight/App Store package.
- App design changes require editing source and rebuilding the standalone artifact. No automatic remote update channel is configured.
- A future live backend requires separately implemented/reintegrated authentication, secure transport, business validation and data storage. This mock is not an API or financial system, and cannot be made live simply by entering a server URL.
