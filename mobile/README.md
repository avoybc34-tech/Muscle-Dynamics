# Muscle Dynamics offline member-app preview

Read the repository-root README for GitHub upload and build/download instructions. Keep this folder under the repository root; the workflow lives at `../.github/workflows/build.yml`.

The app opens on a sample dashboard, with a permanent preview banner and screen browser. It needs no API, login, database, hosting or PC server. Sample interactions are in memory only and reset on restart. No real financial/personal data should be entered.

Change `App.tsx` and `src/ui.tsx` to revise layouts/styles, or `src/preview.ts` to change clearly labelled example content. Commit changes and rerun the GitHub workflow for a new native build. There are no BAT/CMD launchers.

Developer-only checks use the locked dependencies, `npm run check`, `npm run doctor`, and Expo's Android/iOS JS exports. End users need not install npm locally for the GitHub build path. Build scripts under `scripts/*.sh` run on GitHub's Linux/macOS runners, not on your PC.

Unsigned IPA still requires separate valid signing/provisioning to install. The Android artifact is test-signed, not a production/store release. Review SECURITY.md and root VERIFICATION.md before distribution.
