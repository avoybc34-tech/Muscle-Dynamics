# Verification — clean GitHub build project

Prepared 20 October 2026. This is a new standalone mobile source repository. The older website/MariaDB project and previously delivered ZIPs were not deleted or modified by this cleanup.

## Checks actually executed
- Matching lockfile regenerated and `npm ci` completed.
- `npm run typecheck` passed.
- **10 / 10** build/configuration tests passed: backend input handling, acknowledgement, explicit Android test signing, matching identifiers, framework versions, workflow safety, unsigned iOS flags and ignored private/native files.
- `npx expo install --check`: dependencies aligned.
- **Expo Doctor 20 / 20** checks passed.
- **iOS and Android JavaScript/asset exports** passed. These exports are NOT signed native binaries.
- **Android Expo prebuild** passed. Generated template inspected: release signing uses `signingConfigs.debug`; debug keystore is present; Gradle wrapper is 9.4.1. Native output excluded from source ZIP.
- **iOS Expo prebuild** passed on Linux with `--no-install`; generated target/project is `MuscleDynamics` and Podfile is generated. CocoaPods/Xcode compilation cannot be tested on this Linux workspace. Generated output excluded from source ZIP.
- Workflow parsed as YAML and **actionlint 1.7.12** passed; workflow has three jobs and manual inputs.
- Both build shell scripts passed `bash -n` syntax checking.
- Current dependency audit saved locally: **15 high**, 0 moderate, 0 critical package-chain findings. This is NOT a clean security audit. See SECURITY.md.

## Not executed / not claimed
- No repository created or upload/commit/push in your GitHub account.
- No GitHub-hosted job executed, no GitHub billable runner started by the assistant.
- No complete Android native compilation or physical-device APK install performed here.
- No macOS CocoaPods install/Xcode archive, generated IPA, Apple signing, provisioning, iPhone installation, TestFlight or store upload performed here.
- No Expo/EAS account, Apple account, signing key, database password or hosted backend access used.
- No security certification, production acceptance, legal review or backend deployment.

The workflow is prepared and locally checked, not represented as a successfully completed remote native build. If the runner/native toolchain reports a new failure, download its logs artifact and share the first actual error section (without secrets).

## Native outputs and honest labels
- Android job invokes **assembleRelease**, verifies embedded JS and checks APK signatures with the Android SDK's apksigner. Its key is the public template test/debug key, NOT a production key. Output is for ARM64/ARMv7 Android phones.
- iOS job targets `generic/platform=iOS`, disables signing explicitly, checks the release JS bundle and refuses an unexpected embedded provisioning profile. It ZIP-packages Payload as an **UNSIGNED** device IPA, not a simulator build. That IPA is not normally installable until separately signed/provisioned.
- No Apple/Expo signing secrets are requested by this workflow. A valid separate signing route is still required for iPhone installation.
- Every run requires explicit acknowledgement of test-only status and unresolved advisories. No automatic downgrade, force peer resolution or store publication occurs.

## External toolchain references checked
- GitHub runner image: https://github.com/actions/runner-images/blob/main/images/macos/macos-26-arm64-Readme.md (listed Xcode 26.6, CocoaPods 1.17 and Node 22.23.3 at inspection).
- Ubuntu runner image: https://github.com/actions/runner-images/blob/main/images/ubuntu/Ubuntu2404-Readme.md (Android SDK tooling and Java installations).
- Official action descriptors: actions/checkout v5, actions/setup-node v5, actions/setup-java v5, actions/upload-artifact v6. Descriptors were fetched and inspected; selected actions run on Node 24. App build Node is separately pinned to 22.23.3.
- RN/Expo native templates were read from the installed locked dependencies; do not assume an arbitrary older SDK has identical signing/build behavior.

Runner images/tool availability and GitHub plans can change. Costs, quotas, account verification, repository privacy, signing and release review remain the owner's responsibility.
