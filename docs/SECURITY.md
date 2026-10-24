# Security status and release gates

**Internal testing source, not production-approved · 24 October 2026.** Automated checks are useful evidence, not a penetration test or proof of real-device security.

## Implemented controls

- Salted scrypt password hashes; opaque hashed access/refresh/reset credentials; bounded access (15 minutes), refresh (30 days) and single-use recovery (30 minutes) lifetimes.
- Transactional refresh/reset and session revocation, native SecureStore persistence, memory-only access credentials, separate auth navigation and no live-to-demo fallback.
- One-time private first-owner setup; placeholder bootstrap values refused. Real contacts/policies are required before registration opens.
- Authenticated per-user queries; server-side owner/staff roles; restricted staff cannot approve payments, change roles or retrieve another member's private proof.
- Validation, security headers, rate limits, bounded request/upload sizes, image decoding/re-encoding, authorized private media and sanitized database/conflict errors.
- Transactional, exactly-once financial decisions with duplicate-reference checks and owner actual-funds confirmation. A receipt alone cannot activate membership. Stale expiry writes cannot overwrite a concurrent renewed expiry.
- Session-bound device records, preference checks and session validity checks before sending. Reset/password-change/deactivation revoke prior access. Push bodies avoid payment amounts/support-message contents.

## Dependency audit

The supplied machine-readable snapshots are under `verification/`:

| Package set | Reported counts |
|---|---|
| Backend | 0 vulnerabilities |
| Mobile | 5 high; 0 critical/moderate/low |

The mobile affected package entries are `@expo/cli`, `@expo/code-signing-certificates`, `expo`, `node-forge` and `zod`. These counts are reported packages, not five independently demonstrated exploits. No claim is made that all findings are harmless, development-only or unreachable in a particular binary. Review the exact advisories and final native/runtime dependency graph before release. Do not use `npm audit fix --force` blindly: its suggested Expo changes can break the SDK/native toolchain. Re-audit when deploying; this is a dated snapshot.

Backend nodemailer and deepmerge-ts were deliberately updated, then the actual MariaDB tests were rerun. Mobile advisories remain an explicit production-release blocker pending a supported mitigation/review.

## Secrets and infrastructure

No real `.env`, user records, uploaded files, production signing identities or provider credentials belong in this ZIP/repository. `.env.example` values are instructions, not usable secrets. Test fixtures deliberately use disposable non-business identities and dummy credentials; APK signing uses a public test identity.

Use HTTPS and private MariaDB networking; restrict the API behind a trusted proxy before enabling `TRUST_PROXY=true`. Review distributed rate limiting before multiple API instances. Restrict runtime filesystem/DB rights, protect backups, validate restore, and define retention/identity-verification procedures. Production migration privileges and container hardening require operator review; the Compose template is not a complete hardened platform.

SMTP flags are not proof of inbox delivery; push flags are not proof of FCM/APNs delivery. Recovery responses are generic and delivery failures invalidate the code, but mail delivery and abuse/traffic resistance still need a configured-service assessment. The API does not claim verified-email registration or implement social login/MFA.

## Required before accepting real members/payments

- [ ] Approved hosting costs, DNS, TLS, private DB/storage and supervised API/worker.
- [ ] Backup/restore test, error/worker/provider monitoring and appropriate retention/deletion process.
- [ ] Actual policies, contacts, receiving accounts, prices and owner operating procedure reviewed.
- [ ] Real SMTP request/arrival/reset/reuse/expired-code and old-session-rejection test.
- [ ] Resolve/review current dependency advisories and perform security/abuse/load review appropriate to deployment.
- [ ] Actual GitHub native builds pass; lawful private release signing replaces test/unsigned identities where distributing.
- [ ] Android and iPhone device tests: fresh launch, restart hydration, offline/timeout/retry, token expiry/revocation, logout, keyboard/safe areas, image permissions, private uploads and responsiveness.
- [ ] Physical-device push: allow/deny permission; token registration; foreground/background/terminated delivery; preference suppression; logout/password-change revocation; tap routing; provider receipts/retries.
- [ ] Controlled user/owner walkthrough: no paid state before independent funds verification, correct renewals/changes/expired restart, financial history and rejection handling.

The unsigned IPA cannot satisfy iPhone installation/signing/APNs gates. These items were intentionally left as honest external gates, not ticked with mocks.
