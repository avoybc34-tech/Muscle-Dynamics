# Verification & honest release status

MariaDB edition 1.1.0 — checked 20 October 2026 on MariaDB 11.8.6. This replaces the earlier PostgreSQL setup. These are development checks, not a production penetration test, legal opinion, bank reconciliation or store approval.

## Passed
| Check | Result |
|---|---|
| Next.js production build | Pass; frontend entries + dynamic shared API compile |
| Prisma generate and committed MariaDB migrations | Pass |
| Source parsing / required entry points | Pass (`npm run check`) |
| Automated tests | **29 / 29 pass** against real MariaDB plus domain tests |
| Native TypeScript | Pass (`npm run typecheck --prefix mobile`) |
| Expo SDK 58 configuration | Read successfully |
| Android and iOS JS/asset exports | Both pass; **not native binaries** |
| Web/backend npm audit | **0 reported vulnerabilities** after targeted dependency fixes |
| xcode UUID override smoke check | Pass (UUID generation) |
| Browser member/admin checks | Chromium member login/dashboard/plans/payment draft/account details/logout and owner login/dashboard on isolated MariaDB |
| HeidiSQL-compatible SQL import | Full file executed on MariaDB; migration deploy reports no pending migrations; schema diff reports no difference |

Integration coverage includes: first-owner bootstrap restrictions; registration setup gate; PKR plan/account setup; private image validation/reencoding/access; draft→pending without gym access; mandatory owner/funds approval; concurrent duplicate approval creates exactly one subscription; same-plan expiry extension; expired restart and owner plan change; rejection reason/notification; restricted staff finances/receipt denial; one Pakistan-day check-in; concurrent class capacity/roster; class cancellation notification; private progress; support reply notification; approved-only report/CSV; audit access; origin protection; logout revocation; owner cash confirmation and CASH-account requirement.

MariaDB browser walkthrough used a disposable `muscle_dynamics_test_browser_…` database with explicitly labelled fixtures. Member sign-in/dashboard, plans and receiving account JSON rendered correctly, a draft was created, logout worked, and owner sign-in/dashboard rendered. No actual transfer was made. Full receipt/approval/rejection/renewal flows were rechecked by the automated MariaDB API tests. Unauthenticated `/api/me` responses are intentionally 401; no application JavaScript exceptions were observed. Test databases were removed afterwards; the application database contains no owner, plan prices or payment accounts.

The new tests also check case-insensitive member search, long Unicode/emoji support content (`utf8mb4` + TEXT fields), and the standalone SQL import. The SQL was executed against the MariaDB server through the CLI and Prisma, not through the Windows HeidiSQL GUI. The SQL uses the same committed InnoDB migration plus its exact SHA-256 migration baseline, and contains no business records/passwords. Import once into a fresh database; this is not an existing-data conversion or upgrade script.

MariaDB-specific changes include the Prisma `mysql` connector, compatible UUID/text/JSON types, native enum migration, InnoDB tables, SQL row-lock syntax, collation-based case-insensitive search, and bounded full-transaction retries for MariaDB lock/read conflicts (including native error 1020). The Render configuration now expects a separately hosted MariaDB URL instead of provisioning PostgreSQL.

## Mobile dependency audit — unresolved release blocker
Latest audit at delivery: **15 high**, 0 moderate, 0 critical reported package nodes. Multiple counts are dependency-chain effects, not 15 unrelated root vulnerabilities. Two upstream root issues remain:
- `braces <=3.0.3`: deeply nested pattern stack-exhaustion DoS (GHSA-vfj7-8cjw-p6xm), propagating through micromatch/Metro/React Native/Expo tooling.
- `node-forge <=1.4.0`: RSA signature-verification issue (GHSA-86w9-cpqp-85rv), propagating through Expo signing/CLI tooling.

At inspection the registry’s latest packages in those lines remained affected. npm’s suggested automatic “fix” was a downgrade to Expo 44 / RN 0.72, incompatible with this SDK 58 app. That downgrade was **not applied**. No assertion is made that development-tool placement makes these harmless. Do not expose Metro to untrusted networks or accept untrusted signing inputs; require developer security review and patched supported upstream versions (or a reviewed compatible mitigation) before production mobile distribution. Re-run `npm audit --prefix mobile` when preparing release; counts and fixes can change.

Targeted fixes applied and rechecked:
- Backend `sharp` updated to ^0.35.5 for bundled native image-library advisories.
- Prisma 6 CLI’s `deepmerge-ts` dependency overridden to 8.0.2; generation, real migrations, tests and production build revalidated. Review override compatibility again on future Prisma updates.
- Mobile `xcode` dependency’s `uuid` overridden to 11.1.1; removes the buffer-bounds advisory chain (7 moderate nodes), preserving the `v4()` API it uses. Xcode UUID generation, Expo configuration, TypeScript and both JS exports rechecked. Full Apple native build/signing still untested.

## Not performed / not provided
- No Render account login, paid service creation, custom domain or live production deployment.
- No real bank/wallet transfer, payment-provider API, card checkout, recurring debit or automatic refund.
- No physical Android/iPhone tests, native signed APK/IPA, provisioning, Apple/Google account access or store submission.
- No production load test, independent security review or tested Render backup/restore.
- No email/SMS/WhatsApp/push notification integration; password recovery is owner-assisted, notifications are in-app.
- No app-store-compliant automatic account-deletion workflow; owner-managed Support requests only. Review store requirements before publishing.
- No invented business policies, prices, trainer profiles, testimonials, member counts or gym contact/payment details.

## Go-live checklist
Configure actual business settings/plans/policies/accounts; use owned gym photos; resolve/review mobile audit findings; test physical phones; verify canonical HTTPS URL/cookies/origin; test receipt storage across redeploy; set and restore coordinated database/file backups; rehearse owner verification; arrange accounting/tax documents; configure monitoring/retention; remove bootstrap token; review app-store privacy/deletion/signing requirements.
