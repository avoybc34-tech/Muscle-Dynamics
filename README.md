# Muscle Dynamics — OFFLINE APP DESIGN + GitHub APK / unsigned IPA

**No API. No database. No hosting setup. No BAT/CMD files. No PC server.**

This is a clean, app-only design preview. The installed app opens directly on a sample member dashboard. A persistent **OFFLINE PREVIEW / SAMPLE DATA** banner and **Browse all screens** control let you review the designs without a real login.

## Build through GitHub — browser only

1. Extract this ZIP. Create a new private GitHub repository. Upload the **contents** of `muscle-dynamics-design-preview/`, not the enclosing folder or the ZIP itself. At repository root you must see `mobile/` and `.github/workflows/build.yml`.
2. Confirm the workflow file exists. Windows can hide `.github`. If upload skipped it, use **Add file → Create new file**, name it `.github/workflows/build.yml`, and paste the complete included workflow. Commit it to your default branch. GitHub may require workflow permission for the uploading account.
3. Open **Actions → Build offline APK and unsigned IPA → Run workflow**. Choose Android, iOS, or both. Check the test-build acknowledgement. **No backend URL or secrets are requested.** If needed enable Actions for the repository.
4. Wait for source checks and native build jobs. Open the successful run and scroll to **Artifacts**:
   - `Muscle-Dynamics-Android-TEST-APK`: download/unzip and install the `.apk` on a compatible Android device. Release JS is bundled; no Metro, Expo login or API is needed. Uses a public test signing key, not production signing.
   - `Muscle-Dynamics-iPhone-UNSIGNED-IPA`: download/unzip the device `.ipa`. **Unsigned IPA is NOT normally installable until separately signed/provisioned.** This is not a TestFlight/App Store build. This workflow does not bypass Apple signing.
   - Separate build logs and a security audit report are uploaded. Files expire after 7 days; download promptly. Each native file includes a SHA256 checksum and signing notice.

GitHub runner/minute limits and charges depend on your account, especially macOS/private repositories. Review billing before starting builds. No repository or Actions jobs have been run on your account by this chat. This ZIP is buildable source/workflow, NOT precompiled native binaries. The checks here do not guarantee a future native job succeeds on a changing hosted runner.

## What you can review offline

Dashboard; welcome/login/signup layouts; membership; sample PKR plans; payment history with approved/pending/rejected sample states; sample checkout/receipt/pending flow; progress; classes and local sample booking/cancellation; notifications; support; profile; reset preview.

Use **Browse all screens** at the top to jump to layouts. Main member tabs remain available. To see checkout, open Plans and choose a sample plan. The receipt button uses an included picture labelled **SAMPLE / NOT A PAYMENT**, never your photo library. All prices, names, records and activity are examples, not real business claims.

- The sample member is present automatically. Login/signup buttons navigate locally; no account is created or authenticated. Do not enter real passwords or personal information.
- No money is transferred, membership activated for real, receipt uploaded, support message sent, password changed or financial verification performed.
- Changes stay only in app memory. Restart the app or use Reset preview to restore samples. No personal data is persisted or sent to a backend.
- Sharing a sample request record, if tapped, opens the operating system's share sheet. Sharing only happens if you choose it; sample labels are retained. Build tooling itself needs internet to download dependencies. Expo development mode may use developer tooling networks; offline runtime refers to the bundled native preview.

## Change the design, then rebuild

- `mobile/App.tsx`: screen layouts and visible wording.
- `mobile/src/ui.tsx`: navy/blue colours, styles, buttons and spacing.
- `mobile/src/preview.ts`: clearly labelled sample screen data and local interactions.
- `mobile/src/GymProvider.tsx`: offline screen/state provider.
- `mobile/assets/`: icons and bundled sample receipt.

Edit/commit files in GitHub, then rerun the manual workflow and install/download the new artifact. Installed standalone APKs do not update live from GitHub automatically. On Android an app with the same ID but a different signing key may require a deliberate uninstall before installing this test build; this can remove its local data.

## Future backend

This release deliberately contains NO website/backend/database/tunnel files. Live authentication, actual gym settings, secure API credentials/session handling and real payment/member operations must be separately integrated and tested later. There is no fake promise that the preview is a functioning financial system. Keep real data out of these preview builds.

## Checked and limitations

Read `VERIFICATION.md` and `mobile/SECURITY.md`. Current patch-level Expo compatibility was corrected; TypeScript, 14 tests, Expo Doctor, native project generation and Android/iOS JS exports are checked. **Native cloud compilation, iPhone signing and physical-device testing have NOT run here.** Five high upstream audit findings remain at preparation time; no security certification or store readiness is claimed.
