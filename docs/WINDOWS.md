# Windows — MariaDB edition

**Your database client is HeidiSQL. Follow [HEIDISQL.md](HEIDISQL.md) for the SQL import and connection steps.** `docs\HEIDISQL.md` is a local file in the extracted project, not a website named HEIDISQL.md.

## Requirements
- Node.js 22 LTS, version 22.13 or newer. Reopen Command Prompt after installation.
- Your existing MariaDB server and HeidiSQL. No PostgreSQL installation required. Tested with MariaDB 11.8.6; use a maintained MariaDB release (10.11+ recommended).
- New MariaDB project ZIP extracted completely to a normal folder, not running inside the ZIP or mixing generated files from the old PostgreSQL project.

## Quick sequence
1. Back up any existing databases. Open `database\muscle_dynamics_mariadb.sql` in HeidiSQL and execute the entire file once into a fresh application database. It creates/uses `muscle_dynamics`.
2. Run `START-WINDOWS.bat` once to generate your private `.env` and random setup token.
3. Edit DATABASE_URL in `.env` to your actual MariaDB login:
   ```env
   DATABASE_URL=mysql://YOUR_USER:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:3306/muscle_dynamics
   ```
4. Run the launcher again. Wait for Ready, then open http://localhost:3000/setup.html and create the first owner using your private bootstrap token. Keep the terminal open while using the site.
5. Enter real business settings in admin. Remove/rotate the bootstrap token after creating the owner.

Manual Command Prompt alternative (in the extracted project folder, after configuring `.env`):
```bat
npm ci
npm run db:deploy
npm run dev
```
An empty database may be initialized directly by `db:deploy` instead of manual SQL import. The supplied full HeidiSQL import is compatible with this command because it includes its baseline history. Never import the old PostgreSQL migration.

## Troubleshooting
- `node` / `npm` not recognized: install Node and reopen CMD.
- File URL / missing functionality: use http://localhost:3000, not a double-clicked HTML file.
- Port 3000 in use: close the other local app, or run `npm run dev -- --port 3002` and use/update APP_URL to that local port.
- Connection error: start MariaDB and match the same host, port, username and password as HeidiSQL. Read HEIDISQL.md for password encoding and partial-import cases.
- `.env.txt`: enable File name extensions in Explorer, then name it exactly `.env`.
- New dependencies or replacing an older project: stop the server, use a fresh folder and run `npm ci`. Do not copy old node_modules/client artifacts.
- Windows firewall: allow Node on private networks only when needed for local phone testing. Do not publicly expose development mode or MariaDB.

## Developer tests (optional)
Set `TEST_DATABASE_URL` to a dedicated MariaDB database named `muscle_dynamics_test`. The test login must be allowed to CREATE/DROP disposable databases whose names start `muscle_dynamics_test_`; that permission is for a trusted LOCAL test environment only. The suite creates random fresh databases, runs integration/import checks and drops only those generated databases. Never point tests at production. `npm run check` checks source syntax and runs tests. No business fixtures are inserted into the application's database.

For hosting see RENDER.md: the MariaDB edition needs a separately hosted MariaDB connection; the old managed PostgreSQL Blueprint no longer applies.
