# Historical initial audit — before the connected upgrade

**Historical snapshot only. See CHANGELOG.md and VERIFICATION.md for the implemented version and current evidence.**

Date: 24 October 2026
Scope: static inspection of the source currently present in the workspace. No app source modified, dependencies reinstalled, native build or live service test performed during this inspection.

## What exists and can be preserved

- Expo SDK 58 / React Native 0.88 / TypeScript mobile source.
- Muscle Dynamics branding, navy/blue styling, reusable buttons, fields, password visibility toggle, safe-area layout, empty states and basic busy indicators.
- Member dashboard, membership/plan/payment layouts, progress forms, classes, support and profile layouts.
- In-memory preview interactions and explicit sample-data notices, useful as an isolated design/demo mode only.
- Manual GitHub Actions workflow with source checks, Android test-signed APK and unsigned device IPA jobs, artifacts, logs and checksums.

## Critical gaps found

| Area | Current implementation | Required improvement |
| --- | --- | --- |
| Launch | Provider initializes a sample user and home screen; loading is always false | Native branded launch screen, actual session hydration/validation, bounded loading and auth routing |
| Authentication | signIn ignores credentials and navigates; logout clears only React state | Real registration/login, server-side password hashing, validation, confirm-password, secure persistent sessions, revocation and expired-session handling |
| Password recovery | Informational UI; no actual delivery/reset | Verified reset flow with expiring single-use tokens, rate limiting and configured mail delivery |
| Navigation | One large App.tsx, screen string, screen switcher and notification icon | Native stack/tab navigation, clear authenticated/unauthenticated boundaries, back handling, deep links and consistent five-tab structure |
| UI architecture | Shared styles exist, but many screens and flows are in one file | Componentized screen modules, premium design system, accessibility, keyboard handling, responsive spacing and restrained animations |
| Membership/payments | Sample plans and sample approved/pending/rejected records; local simulation | Database-backed owner-managed PKR plans, private proof storage, owner actual-funds verification, transactional activation/renewal, immutable financial history |
| Workouts | Progress entries and sample classes; no real exercise-plan model or workout engine | Exercise library, plans/schedules, workout detail/session tracking, completed activities and per-user persistence |
| Notifications | In-memory history only | Permission flow, device-token registration, backend event/outbox worker, scheduled reminders, push delivery/receipt handling, preferences and tap routing |
| Profile | Sample user; changes disappear on restart; bundled sample receipt is not profile media | Authenticated profile API, validated avatar storage, separate edit/security/settings flows |
| Settings | No dedicated complete settings hierarchy | Working account, notification, security/privacy, support/policies and app-information screens; omit unsupported controls |
| Backend | None in current project | Restore earlier source if supplied, otherwise implement/reintegrate a MariaDB backend, migrations, authorization, validation, private storage and operational tasks |
| Production builds | Public test Android key; IPA signing disabled | Proper owned identities and signing configuration; signed installable builds for actual device/push validation |
| Testing | Preview/build checks exist | Backend integration/authorization tests, auth/session tests, payment concurrency tests, navigation/device tests, real notification delivery tests and release checks |

## Source availability

The current workspace contains only the offline app-preview project and its archive. The earlier connected backend was removed during the requested cleanup. It is not available to inspect or reuse here unless its source is supplied again. Do not claim that the existing preview is connected or that the earlier backend was audited in this pass.

## Rules to preserve unless changed by the owner

- Muscle Dynamics identity and navy/blue direction.
- MariaDB for the connected backend.
- PKR memberships with manual bank/Easypaisa/JazzCash/cash verification; never approve solely because a receipt exists.
- Actual owner-entered contacts, plans/prices, payment accounts and policies; no fabricated live records.
- Same-plan active renewals extend expiry; expired membership restarts on approval; active plan changes require owner review. No automatic refunds, recurring billing or prorating.
- Separate real mode from clearly labelled preview mode. Do not fall back to sample paid memberships after live API errors.
- GitHub mobile builds remain available; no Windows BAT/CMD setup requirement.

## External prerequisites and truthful release gates

Real password-reset delivery needs a configured mail service. Push needs a chosen provider/project, signed application credentials, backend connectivity and device permission. Device tokens are delivery addresses, not proof of authentication. Preferences and event routing must also be enforced on the server.

An unsigned IPA is not normally installable and cannot be used to prove iPhone push delivery. The current test APK is not production signing. Credentials must be configured privately in hosting/GitHub/provider secret stores, never pasted into chat or committed.

Complete source and automated integration tests can be built before deployment, but production readiness must not be claimed until hosted APIs, configured mail/push, signed native builds, physical devices, backups and release/security testing pass.

## Proposed delivery sequence

1. Confirm available backend source and release/signing/service-configuration path.
2. Preserve reusable app components; introduce modular stack/tab navigation, design tokens, splash/auth/session foundation and explicit demo/live separation.
3. Implement/reintegrate MariaDB APIs, per-user access controls, secure profiles/sessions/reset flows and owner-controlled membership/payment review.
4. Add workout plans/activity, dedicated settings, real push registration/preferences/event delivery and reminder worker.
5. Test real database and network error paths; verify mobile source/native build workflows; perform signed-device, provider and end-to-end acceptance tests before any production-ready claim.
