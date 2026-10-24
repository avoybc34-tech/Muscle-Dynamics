# Muscle Dynamics mobile · 2.1

Connected Expo / React Native app with native auth stacks and Home, Workouts, Membership, Activity and Profile tabs. Start with the [repository README](../README.md) and [setup guide](../docs/SETUP.md).

Live mode requires the configured MariaDB API; it does not manufacture a sample paid member after errors. The explicit design demo is isolated and labelled. Native refresh credentials use SecureStore; the browser QA-only demo does not implement production web auth.

GitHub browser-based test APK/unsigned IPA instructions: [GITHUB-BUILDS](../docs/GITHUB-BUILDS.md). No Windows launchers are supplied. No compiled binary is included here.

Developer checks: `npm ci --include=dev`, `npm run check`, `npm run doctor`. Native compilation/device gates and the unresolved mobile audit findings are documented in [VERIFICATION](../docs/VERIFICATION.md) and [SECURITY](../docs/SECURITY.md).

The approved visual direction is implemented with bundled Manrope fonts and a decorative monochrome gym image. Owner/staff workspace and first-owner setup are included, following the latest scope. Only appropriate authenticated roles see management controls.
