# Muscle Dynamics — connected mobile app

**Version 2.1 · connected source / internal testing candidate**  
The approved navy/blue visual direction is implemented across the React Native member app and role-restricted owner/staff workspace, with a MariaDB API and notification worker. This replaces the earlier offline-only design preview; live accounts, workouts and financial decisions now use the backend. No real gym/customer/bank data is seeded.

## What changed in 2.1

- Approved photography-led training screens, Manrope type, rounded navy panels, blue actions and floating five-tab navigation.
- Member, owner and restricted staff features are all included, following the latest scope confirmation. Owner functions are visible only to authorized roles.
- Explicit isolated owner demo for visual review; no sample action verifies real money.
- New [actual screen gallery](docs/DESIGN-PREVIEW.html) and [overview image](docs/APP-OVERVIEW.png).

## What is included

- Branded launch, secure session restoration and separate sign-in/registration/recovery navigation.
- Native **Home / Workouts / Membership / Activity / Profile** tabs; detailed training, classes, progress, checkout, settings and account security screens.
- Persistent per-user data, owner-configured plans/accounts/policies, private receipts and avatars, financial audit history and transactional owner review.
- Owner workspace (Profile → Owner workspace) for real configuration, plan/account editing, exercise forms, classes, announcements, member/staff access and support replies. Staff cannot approve money or change roles.
- Notification preferences/history, permission and token registration, server event outbox, renewal reminders, Expo provider integration and receipt checks.
- Manual GitHub workflow for a test-signed APK and **unsigned** device IPA. No Windows BAT/CMD launcher is included.
- An explicitly labelled, isolated sample demo. It never becomes a fallback after a live API error.

## Start here

1. **[Setup guide](docs/SETUP.md)** — hosting/database/mail/push prerequisites and first owner setup.
2. **[GitHub build guide](docs/GITHUB-BUILDS.md)** — browser-based workflow and signing limitations.
3. **[Owner guide](docs/OWNER-GUIDE.md)** — publish actual information and safely verify manual PKR payments.
4. **[Verification report](docs/VERIFICATION.md)** — checks actually executed and checks still required.
5. **[Security and release gates](docs/SECURITY.md)** — unresolved mobile advisories and deployment controls.
6. **[Architecture/API](docs/ARCHITECTURE.md)** and **[upgrade changes](docs/CHANGELOG.md)**.

## Verification snapshot · 24 October 2026

| Check | Result |
|---|---|
| Backend tests against disposable MariaDB | **23/23 passed previously; backend unchanged** |
| Mobile automated tests | **20/20 passed** |
| TypeScript / Expo version alignment | Passed |
| Expo Doctor | **20/20 passed** |
| Android + iOS JS export and native prebuild | Passed |
| Browser demo member + owner workflows and auth boundaries | Passed; no page exceptions or invalid View text warnings |
| Workflow structural lint | Passed; actual GitHub run not performed |
| Backend dependency audit | 0 reported vulnerabilities |
| Mobile dependency audit | **5 high** reported packages; not forced into incompatible versions |

**Not a production approval.** Hosting, SMTP delivery, provider credentials, physical-device push, actual native compilation and lawful iOS signing still require configuration and execution. No new APK/IPA binary is inside this source package. The unsigned IPA workflow output is not normally installable on an iPhone. See the verification report rather than treating a successful JavaScript export as a native/device test.

## Repository layout

```text
.github/workflows/build.yml   Manual test-binary builds + backend CI
mobile/                      Expo / React Native / TypeScript
backend/                     Fastify / Prisma / MariaDB migrations + tests
compose.yaml                 Optional API + MariaDB + worker integration template
.env.example                 Compose DB configuration template (not a secret)
docs/                        Setup, policies, architecture and verification evidence
```

Only example environment templates are supplied. Configure secrets privately; never post passwords, reset codes, bootstrap tokens or signing keys in chat or commit them to GitHub. No paid service, cloud account or deployment was created.
