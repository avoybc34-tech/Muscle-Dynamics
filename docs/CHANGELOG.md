# Connected upgrade changes

## Initial inspection → version 2.0

The historical `INITIAL-DESIGN-AUDIT.md` describes the **pre-upgrade** offline source only. Its “no source modified/no native tests” wording is limited to that inspection, not this completed implementation phase.

- Replaced the in-memory-only app core with a real MariaDB/Prisma/Fastify API, migrations, auth, personal records and role authorization.
- Split the monolithic preview into native stack/tab navigation, session model, reusable UI and purpose-specific screens. Added native branded splash, actual session-aware launch and isolated auth screens.
- Built connected signup/login, matching-password checks/visibility, private persistence, rotation/revocation/logout, one-time email reset integration and account security/session controls.
- Reworked navy/blue dashboard, workout library/detail/set tracking, classes/bookings, activity/progress, membership/plans/payment history, profile/avatar and settings/help/policy screens.
- Added private payment proof and owner-only actual-funds review, immutable financial snapshots/history, correct paid-through renewal rules, duplicate/conflict handling and audit trail. Paginated payment history and owner/staff record lists avoid a fixed first-page ceiling.
- Added owner plan/account editing, exercise-field forms, class/announcement creation, support replies and restricted staff/member management.
- Added notification preferences/history, permission/token registration, deduplicated backend events, paged renewal reminders, worker leases/retries/receipts, session-validity checks and consumed-response tap routing.
- Fixed actual MariaDB changed-record concurrency failures, stale expiry/renewal race protection, native empty-string child guards and browser sample-proof loading; added regression checks.
- Retained the manual GitHub test APK + unsigned IPA path, optional API/project/FCM settings and honest signing/service/advisory notices. No BAT/CMD launcher or pretend live paid state.
- Preserved the useful earlier demo interactions as clearly labelled samples, separate from live mode. Old offline-only README/security instructions are replaced, not left as current setup advice.

## Remaining release work is configuration/verification, not pretend completion

Hosting, actual business information, mail/push credentials, lawful signing, native builds, physical-device testing, security/advisory mitigation and operational readiness must be completed as documented. This package does not claim production approval.
