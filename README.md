# Muscle Dynamics — MariaDB edition

Fresh gym platform: editable HTML/CSS/JavaScript website, member and owner/staff workspaces, Next.js API, Prisma/MariaDB, and Expo Android/iPhone app.

**Use this updated project instead of the earlier PostgreSQL ZIP. SQL alone does not convert the old backend.**

**Start here:** [HeidiSQL import](docs/HEIDISQL.md) · [Windows setup](docs/WINDOWS.md) · [Owner guide](docs/OWNER.md) · [Editing guide](docs/EDITING.md) · [Render deployment](docs/RENDER.md) · [Phone testing & signed builds](docs/MOBILE.md) · [Verification / limitations](docs/VERIFICATION.md).

## What is included
- New navy/blue public website; owner-editable contact details, homepage copy, policies, gallery, plans, trainers, classes and announcements.
- Member registration/login, membership, manual payment receipt submission/history, class booking, progress, in-app notifications, support and profile/password changes.
- Owner: member management, restricted staff accounts, private payment reviews, cash renewals, plans/accounts, attendance, classes/trainers, support, reports/CSV, media/settings, audit history.
- Restricted staff: member lookup/detail, check-ins, class listings/rosters and support replies. No financial records, payment receipts, payment decisions, roles or website settings.
- Shared real backend. No card gateway, bank API, fake success, recurring charge, invented pricing or public demo accounts.

## Run locally
Install Node.js 22.13+ and use your existing MariaDB server/HeidiSQL. Import `database/muscle_dynamics_mariadb.sql` once into a fresh application database (or initialize an empty database with `db:deploy`). Copy `.env.example` to `.env`, configure your own `mysql://USER:PASSWORD@127.0.0.1:3306/muscle_dynamics` database URL and a random bootstrap token (32+ characters). Then:

```sh
npm ci
npm run db:deploy
npm run dev
```
Open **http://localhost:3000**, **/setup.html** for the first owner, then **/admin.html**. Do not double-click an HTML file: authentication, database and payments need the server. Windows users can use `START-WINDOWS.bat`; see `docs/HEIDISQL.md` first. No PostgreSQL installation is needed. This fresh-database edition is not an automatic data converter for existing databases.

## Before taking real payments
Configure actual business contact details and legally reviewed privacy/membership terms; create actual PKR plans and receiving accounts; publish payment instructions. Registration/payment submission is blocked until required setup exists. Replace the illustrative equipment photo with your gym’s photo. Review the documented dependency audit, test on physical phones and rehearse a real owner-controlled verification before public launch.

## Important delivery status
Source/build validation is not a deployment, security certification or app-store release. No Render deployment, real bank transfer, physical phone test, signed APK/IPA or Apple submission was performed. `docs/VERIFICATION.md` records checks and unresolved mobile tooling advisories. No private `.env`, database dump, receipts, signing keys or installed dependencies belong in your source archive.
