# Muscle Dynamics — FULL website + admin + member portal + app

**This is the combined project, not the previous app-only ZIP.** Deploy the website/API/private MariaDB on **Render**. Build the Android TEST APK and unsigned iPhone IPA on **GitHub Actions**. Both website and app use the same gym backend.

## No npm on your PC

You do **not** need to run npm, install Node, keep HeidiSQL open, or keep your PC switched on. Render installs/runs the website server and database. GitHub's runners install/build the mobile app. The website is plain HTML/CSS/JS backed by the included API; it is **not** a static-only site.

### 1. Upload the complete project

Extract the ZIP → create a private GitHub repository → upload the **contents** of `muscle-dynamics-full/`. `render.yaml`, `package.json`, `public/`, `mobile/`, and `.github/` go at repository root. Upload in batches if necessary. Confirm `.github/workflows/build.yml` exists; if hidden folders were skipped, use **Add file → Create new file** with that exact path and paste the workflow from the ZIP.

### 2. Host website + database

Render → **New → Blueprint** → choose that repository → review charges → Apply. **Not Static Site.** Leave repository Root Directory unset. The Blueprint creates a paid Node web service, a paid private MariaDB service and two persistent disks. **Check current pricing before approving; this is not a free-hosting package.** No deployment, account action or charge has been performed for you.

Open the web service's HTTPS URL when ready. Render runs installation, build, database startup waiting and migrations automatically. The database is hosted privately on Render—not your PC.

### 3. Become owner and enter your real details

Privately copy `BOOTSTRAP_TOKEN` from the Render **web service → Environment**. Open `YOUR-RENDER-WEB-URL/setup.html`, create your owner login, then use `/admin.html` to enter real contacts, privacy/membership policies, payment instructions, membership plans/PKR prices, and bank/Easypaisa/JazzCash payment accounts. Member registration stays closed until required contact details and both policies are completed. There are no fabricated prices, bank details, members or payments in this package. Remove the bootstrap environment token after successful owner setup.

Website: `/` · Members: `/member.html` · Admin: `/admin.html` · Health: `/api/health`.

### 4. Build and connect the mobile app

GitHub repository → **Actions → Build APK and unsigned IPA → Run workflow**. Choose Android/iOS/both; use your Render **HTTPS website origin** (no `/api` suffix), and acknowledge the testing/signing limitations. Download the artifacts after the jobs finish. See [`mobile/README.md`](mobile/README.md).

- **Android:** installable TEST APK, release-mode JS bundled, public test signing key. Not a Play Store/production-signing package.
- **iPhone:** **UNSIGNED IPA, not directly installable** until separately signed/provisioned. No Apple/Expo credentials required for this build.
- These are source/build workflows, **not prebuilt APK/IPA files**. Native jobs must still run in your GitHub account; no successful cloud build is claimed here.

## Included functionality

Navy/blue Muscle Dynamics website; owner-only initial setup; member registration/login; restricted staff; editable plans/settings/payment accounts; manual PKR bank/Easypaisa/JazzCash/cash payment review; private receipts; rejection reasons and in-app notifications; memberships and same-plan renewals; owner review for plan changes; attendance; trainers; classes/bookings; announcements; support; CSV exports; audit trail. No automatic payment gateway, automatic renewals, refunds or prorating. Staff must verify permissions; owner verifies actual funds before approvals.

## Read before launch

- [Detailed Render deployment, troubleshooting, storage and backups](docs/RENDER.md)
- [Owner operation guide](docs/OWNER.md)
- [Mobile build/download instructions](mobile/README.md)
- [Verification and limitations](VERIFICATION.md) · [Security notes](SECURITY.md)
- [Editing guide](docs/EDITING.md) · [Third-party assets](docs/THIRD-PARTY.md)

MariaDB is self-hosted with persistent storage, **not** a managed database. Arrange tested off-service database **and** receipt backups before real use. Existing business data is not included or migrated by uploading this ZIP. Keep credentials and member/payment records out of GitHub.

## Repository layout

```
render.yaml                  complete paid web + private MariaDB Blueprint
public/                      website / member / admin / setup HTML, CSS, JS, assets
app/, lib/, prisma/          shared API, authentication, MariaDB schema/migrations
scripts/render-*.mjs         automatic Render build/start; not owner PC commands
docker/mariadb/              private MariaDB container
mobile/                      Expo native app + build scripts
.github/workflows/build.yml  manual GitHub Android/iPhone build
docs/, tests/, database/     guides, tests, schema-only SQL reference
```

`package.json` and lockfiles are required for Render/GitHub automation. You do not run them locally. Do not remove them to make the site “HTML only”: member/admin functions need the server.
