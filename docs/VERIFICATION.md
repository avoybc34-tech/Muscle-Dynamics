# Verification report

**Source version 2.0 · 24 October 2026 · local workspace execution.** No hosted/live gym system or native binary is certified by this report.

## Executed after final application changes

| Verification | Actual result | Evidence |
|---|---|---|
| Fresh disposable MariaDB 11.8.6 migration + backend suite on Node 22.23.3 | **23 tests passed; 0 failed/skipped** | `verification/backend-tests.txt` |
| Mobile TypeScript + automated suite + Expo dependency alignment | **15 tests passed; 0 failed/skipped**, type/alignment pass | `verification/mobile-check.txt` |
| Expo Doctor | **20/20 passed** | `verification/expo-doctor.txt` |
| Android + iOS JavaScript/assets export | Passed | `verification/platform-export.txt` |
| Native Android prebuild, no dependency install | Passed | `verification/android-prebuild.txt` |
| Native iOS prebuild, no CocoaPods install | Passed | `verification/ios-prebuild.txt` |
| GitHub workflow structural lint, actionlint 1.7.12 | Passed, shellcheck disabled | `verification/workflow-lint.txt` |
| Backend npm audit | **0 reported vulnerabilities** | `verification/backend-audit.json` |
| Mobile npm audit | **5 high reported package entries** | `verification/mobile-audit.json` |
| Browser demo navigation at 390×844 | Passed, zero page/console errors | `verification/browser-flows.txt` |
| Five main tabs at 320, 390 and 768 px widths | Passed; no horizontal page overflow, zero page/console errors | `verification/browser-responsive.txt` |

## Backend coverage

Real temporary MariaDB tests exercise gated first owner/registration, real password auth, per-user/role boundaries, private proof access, payment draft/proof/pending states, owner actual-funds requirement, renewal/plan rules, duplicate verified references, concurrent duplicate approval, class-capacity contention, restricted staff, rejection without paid-through changes, unconfigured-email failure, isolated payment/admin cursor pages, refresh rotation, single-use reset/session invalidation, device registration, reminder deduplication, mocked provider tickets and actual logout revocation.

Domain tests cover renewal calculations and validation. Additional worker tests exercise **501-member reminder pagination/idempotency** and the stale-expiry compare-and-set condition. SMTP and Expo provider calls are injected/mocked where named; they are not evidence of delivery to a mailbox/device.

## Mobile and browser coverage

Automated checks exercise isolated demo behavior, workout/payment state handling, API origin/auth-failure behavior, native auth/tab structure, React Native child-guard regressions and build-script/configuration invariants. They are not native UI automation.

Playwright executed the real React Native web **labelled demo**: workout detail → reps/weight entry → completion; plan → request → bundled sample proof → pending state; profile → settings → notification preferences; exit demo → separate login. Screenshots in `screenshots/` and `DESIGN-PREVIEW.html` are actual browser captures, **not native-device screenshots**. No real upload or payment occurred during that demo checkout.

Browser QA caught and fixed both a bundled-receipt loading issue and empty-string conditional children under native Views; final runs checked console errors as well as page exceptions. Main-tab responsive checks visited all five tabs at three widths. This is narrower than a full accessibility/device matrix.

## Not executed / not claimed

- Actual GitHub Actions jobs, Gradle APK assembly or CocoaPods/Xcode IPA archive.
- Installation on Android/iPhone, native launch animation/safe areas/keyboard/accessibility, SecureStore persistence on hardware or store-distribution signing.
- Docker/Compose runtime, public TLS/reverse proxy, hosted MariaDB, restore/failover/load testing or external penetration testing.
- Real SMTP email arrival, FCM/APNs/Expo delivery/receipts, killed-app notification behavior or permission handling on devices.
- Real bank/Easypaisa/JazzCash/cash verification. Automated financial tests use deliberately simulated fixtures.

Native project generation is **not** native compilation. A JavaScript export is **not** a verified installable app. Unconfigured integrations are implemented source plus explicit setup gates, not live functionality already deployed.

## Reproduce safely

Use Node 22.23.3 (or a compatible supported Node 22 version). Install each folder's locked dependencies. Mobile: `npm run check`, `npm run doctor`, then the export/prebuild commands in the workflow. Backend: provision an **empty disposable database whose name ends `_test`**, set `TEST_DATABASE_URL` privately (or `DATABASE_URL` to that test DB), apply migrations and run `npm test` from `backend/`.

The integration suite intentionally refuses a non-`_test` database or nonempty User table. It is not a migration/reset tool for live data. Never drop a production database to reproduce this report. Browser QA scripts under `verification/` require Playwright/Chromium installed separately; they are evidence/reproduction aids, not app runtime dependencies.
