# Full-project verification — 20 October 2026

## Scope

This is the complete Render website/API/private-MariaDB repository with the mobile source and repository-root GitHub build workflow. It replaces the earlier app-only ZIP as the combined deliverable. No Render resources, GitHub repository or cloud build jobs have been created for you. No deployment charges have been approved.

## Checks completed in the preparation environment

- Node 22.23.3; real MariaDB 11.8.6.
- Website/backend: **35/35 tests passed**, including real MariaDB integration tests, separate SQL-baseline import/schema comparison, payment review/renewal/concurrency/authorization rules and six runtime-environment checks. Integration fixtures use random disposable `_test` databases and are not shipped as business data.
- Render build script: clean dependency install and optimized Next production build succeeded **without a running database**. A build-only placeholder URL is passed to build child processes; it is not configured as the production database.
- Automatic startup tested with `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME` and no supplied `DATABASE_URL`: readiness wait, initial migration and web startup succeeded. Runtime password URL encoding and Render URL fallback have unit tests.
- Repeat startup migration: `migrate deploy` reported no pending migrations; no destructive seed/reset was run.
- Fresh application DB checks: **0 users, 0 plans, 0 payment accounts, 0 payment requests, 0 memberships and 0 stored files**. The initialized schema does not supply invented business records.
- Production HTTP smoke checks: `/api/health` returned `{"ok":true,"service":"Muscle Dynamics"}`; setup status correctly reported no owner.
- Chromium browser checks: desktop and 390px mobile homepage, member login/signup gating, and initial owner setup/admin routing. Local stock photo and fonts rendered. Expected signed-out `/api/me` 401 responses are authentication probes, not a successful login or unexpected JS exception. No real owner credentials or accounts were entered in browser QA.
- Mobile: TypeScript, dependency alignment and **11/11 tests passed**, including the monorepo workflow working-directory/cache/artifact paths.
- Expo Doctor: **20/20 checks passed**. Android and iOS Hermes JavaScript exports succeeded from the combined mobile folder.
- Workflow: actionlint 1.7.12 passed after moving it to the repository root. YAML structure checks confirm manual dispatch, three jobs, mobile lockfile cache paths and root-relative mobile artifact paths. Native build scripts pass shell syntax checks.
- Render YAML: structure/wiring checks confirm two same-region services, private DB host/password references, and separate database/receipt persistent disks. These checks do **not** replace Render's account-side Blueprint validation and actual deployment.
- Website/backend dependency audit: **0 reported vulnerabilities** in the resolved root dependency graph at check time.
- Mobile dependency audit: **15 high / 0 moderate / 0 critical** package-chain findings at check time. The mobile graph is separate from the root graph. See `mobile/SECURITY.md`; CI records the current report and requires test-build acknowledgement. No unsafe forced dependency downgrade was applied.

## Not verified / not promised

- A real Render deployment, provider billing/availability, container resource usage under production load, custom-domain DNS, and off-service backup/restore are not executed here. The MariaDB Dockerfile targets the upstream 11.8 image; the hosted container still needs its real Render start.
- GitHub-hosted Android Gradle and macOS/Xcode native compilation still need to run in your repository/account. Successful JavaScript exports and workflow lint are **not** successful APK/IPA compilation.
- No native binary is included in this source ZIP. Workflow artifacts are generated only after successful native jobs. No physical Android/iPhone testing has been performed.
- APK is test-signed with a publicly known key, not store/production signing. IPA is unsigned and not normally directly installable. No Apple/Expo account, private signing key or release credential is bundled.
- No automatic bank/wallet settlement, recurring billing, automatic refunds, production security certification, push/email messaging or automated account deletion is claimed.

## Package hygiene

The release source allowlist excludes private `.env`, dependency/build caches, native generated projects, receipts/uploads, test artifacts, local databases, signing secrets and binaries. `SOURCE-SHA256.txt` lists the included source files; the ZIP checksum is supplied beside the archive. The `.env.example` files contain placeholders only. Preserve the two package lockfiles and the root workflow during browser upload.
