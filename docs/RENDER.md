# Render deployment — no local npm or database needed

## Before approving anything

This repository deploys **two paid services** in the same region: a Node web service (initial plan `1c-2g`) and a private self-hosted MariaDB service (`0.5c-512mb`), each with a 10 GB persistent disk. The Blueprint is NOT a free/static website configuration. Review Render's current total service and disk charges before clicking Apply. Nothing has been deployed or purchased for you. Increase database resources if actual workload exceeds the starter limits.

## Browser-only steps

1. Extract the full ZIP. Create a new private GitHub repository. Upload the **contents** of the `muscle-dynamics-full` folder, not an enclosing ZIP or enclosing folder. `render.yaml`, `package.json`, `public/`, `mobile/`, and `.github/` must be at the repository root. If GitHub limits upload size/count, commit the files in smaller batches. Include the lockfiles. Do not upload `.env` files or actual receipts.
2. Ensure `.github/workflows/build.yml` exists at exactly that path. Windows may hide the `.github` folder. If upload misses it, use GitHub **Add file → Create new file**, name it `.github/workflows/build.yml`, and paste the complete workflow from the extracted ZIP. GitHub may require workflow permission for the account uploading it.
3. On Render choose **New → Blueprint**, connect the repository, select the intended branch, review both services/disks and charges, then Apply. Do **not** choose Static Site, do not set Root Directory to `mobile`, and do not substitute PostgreSQL. The root `render.yaml` supplies build/start settings and private DB credentials automatically.
4. Wait for MariaDB and the web service. The web build installs dependencies on Render; startup waits for MariaDB and applies the committed migrations. Initial database image download/startup can take time. If the DB was still starting when the web startup timed out, wait until the DB is healthy and redeploy **only the web service**. There is no manual SQL import for a fresh database.
5. Open **the public URL of `muscle-dynamics-web`**. It serves the website, API, member area `/member.html`, and admin `/admin.html`. The DB service has no public website URL.
6. In web service **Environment**, reveal/copy `BOOTSTRAP_TOKEN` privately. Open `https://YOUR-WEB-SERVICE.onrender.com/setup.html`. Enter the token and your real owner email/name and a strong password. Never send the token/password here or put them in GitHub. The first owner setup is locked after success. Remove `BOOTSTRAP_TOKEN` from the web environment afterward (do not regenerate it via a Blueprint sync unless needed; setup remains locked once an owner exists).
7. Sign in at `/admin.html`. Add real gym contacts/hours/address, privacy/membership policies, membership plans and PKR prices, bank/Easypaisa/JazzCash details and manual payment instructions. Member signup stays disabled until required contact fields and both policies (at least 50 characters each) are completed. No real business records or invented prices are included. Customers cannot complete a payment flow until valid plans and a supported active payment account exist. Review `OWNER.md` before accepting real payments.
8. Health check: `/api/health` should report ready. Test real member registration, owner controls, and a clearly-labelled test payment/receipt before launch. Never approve a real membership until you have independently checked the actual funds. Use the app build instructions in `../mobile/README.md` to connect the same HTTPS web URL.

## Existing Render deployment / existing database

The Blueprint is intended for a **new, empty deployment**. Do not attach its auto-initialization to your existing production data without a backup and migration review. A new private database does not copy records from an old local/hosted database. The optional `database/muscle_dynamics_mariadb.sql` is a schema-only developer reference, not a backup or something to import on top of a migrated database.

## Custom domain

Add/verify your domain with Render first. Then set the web service `APP_URL` to the exact HTTPS origin, e.g. `https://gym.example.invalid` (replace this example). No paths or trailing query strings. Redeploy the web service and use that same origin inside the app or in its GitHub build input. Without an override the Render service URL is used automatically.

## Backups, maintenance and secrets

- MariaDB here is **self-hosted Docker**, not a managed Render database. You are responsible for tested off-service backups, monitoring, security updates and recovery. A persistent disk is not an independent backup.
- Back up the MariaDB data using a consistent database backup method and separately back up the private receipts disk; test restoring both to a separate environment. Do not make the DB publicly accessible or put raw backups/receipts in the Git repository.
- Keep both services in the same Render region; use the private host on port 3306. Do not use a home-PC/HeidiSQL IP. No publicly exposed DB or phpMyAdmin is included.
- Generated MariaDB passwords initialize an **empty** disk only. Editing `MARIADB_PASSWORD`/`MARIADB_ROOT_PASSWORD` in Render later does not update existing SQL accounts. Coordinate actual SQL password rotation and web environment/Blueprint re-sync; otherwise you can break access. Referenced environment values refresh on Blueprint sync, not automatically on every source secret edit.
- Do not delete or recreate either persistent disk to fix a deployment. That can permanently destroy members/payments/receipts. Disk-backed services are single-instance; upgrades/deploys may briefly interrupt service.
- The web disk protects uploaded receipt files from ordinary redeploys. The private MariaDB disk holds accounts, memberships, payments, settings and audit records. Neither depends on your PC being on.
- Read `SECURITY.md` before production. Keep owner/staff accounts restricted. An unsupervised new public deployment is not a security certification.

## Troubleshooting

- **Static HTML opens but actions do not work:** use the deployed web URL, not a downloaded HTML file, GitHub Pages, or Render Static Site. The frontend requires the included backend.
- **Database config missing:** use the full root Blueprint. Confirm `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_PORT` exist on the web service and the private DB is running. Do not paste credentials into screenshots/support chats.
- **Database wait/migration error:** inspect private DB logs/disk status and the web startup log. Check that the services share a region and the existing SQL user password matches the environment. Never run reset/force-push against business data.
- **Cannot save from custom domain:** set `APP_URL` to that exact HTTPS origin. Origin checks intentionally reject other sites.
- **Render reports high memory:** review logs and scale the affected service. Do not disable authentication, payment validation, or persistent storage to work around resource limits.
