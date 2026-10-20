# Render deployment — MariaDB edition

No deployment has been performed. The Blueprint now deploys the **Node web/API service only**, with a persistent upload disk. It deliberately does not create the previous managed PostgreSQL database. Your local MariaDB/HeidiSQL session is sufficient for local Windows use, but not automatically available to a hosted Render app.

## Requirements and deploy
1. Arrange a production MariaDB service reachable by Render through a secured connection. Use a maintained version, a dedicated user limited to this application database, backups, strong credentials, TLS/certificate verification and appropriate network restrictions. Follow that provider's TLS instructions and Prisma MySQL connection-URL documentation. Do not disable certificate checks to make a connection work.
2. Do not use `127.0.0.1` or `localhost` in a hosted DATABASE_URL: that would refer to the Render container, not your Windows computer. Do not expose your home MariaDB port to the public internet just to connect Render. A separately operated persistent MariaDB service is additional hosting and maintenance, not included/created by this Blueprint.
3. Put source at the root of your private repository. Exclude `.env`, receipts, installed dependencies and generated builds. Connect it in Render → New → Blueprint and review all costs before approval. The file creates one paid Node web service and a 10 GB disk; plan identifiers/pricing can change.
4. Set Render's private **DATABASE_URL** to your actual hosted MariaDB `mysql://...` URL. Set **APP_URL** to the exact canonical HTTPS origin without a trailing slash. These values are prompted, not invented. A wrong APP_URL intentionally blocks cross-origin browser writes.
5. Render generates BOOTSTRAP_TOKEN. UPLOAD_DIR points to `/var/data/muscle-dynamics`. Node is pinned to 22.23.3. Never put database secrets in public JS or Expo public variables.
6. Build: `npm ci && npm run build`. Pre-deploy: `npm run db:deploy`. Start: `npm start`. Health: `/api/health` returns `ok: true` when the database is reachable.
7. On a completely empty database, migrations create the tables. Alternatively, the full supplied MariaDB SQL import already records the initial migration. Never import both separate/partial schemas or point this edition at PostgreSQL. Existing PostgreSQL business data requires a planned, backed-up migration; no automatic data conversion is supplied.
8. Open HTTPS `/setup.html`, enter your private bootstrap token and create the owner. Remove/rotate that token afterwards. Configure real contact details/policies/plans/receiving accounts and perform launch checks before accepting funds.

## Persistence and scale
The database stores records/permissions. Receipts and public uploaded photos are files on the attached persistent disk. Do not use an ephemeral free web filesystem for receipts. This is a single-instance design (`numInstances: 1`); multi-instance scaling needs protected shared object storage. Disk deployments may have downtime; schedule maintenance.

## Backups and maintenance
- Back up MariaDB using your provider's tools and/or an appropriate consistent `mariadb-dump` strategy; protect encrypted off-host copies and retention.
- Back up the receipt/upload disk as well as the database at coordinated points. A database-only restore leaves broken file references. Restrict access to backups as financial/personal data.
- Restore into an isolated environment and verify logins, private receipts, memberships and financial totals before relying on backups. A hosted restore was not tested here.
- Keep database network access restricted; never allow every internet IP for convenience. Review the production database user's migration versus runtime permissions.
- Monitor health, logs, disk space, pending requests, transactions and audit history. Rate-limit rows/replaced files need a retention maintenance policy at scale; no scheduled cleanup worker is installed.
- Review dependency audits and security testing before release. The unresolved mobile tooling findings in VERIFICATION.md still apply.

Phones use the same live HTTPS origin in the app connection screen, without `/api` or `/admin.html`. Do not put a database URL into the app.

References: https://render.com/docs/blueprint-spec · https://render.com/docs/disks · https://www.prisma.io/docs/orm/overview/databases/mysql
