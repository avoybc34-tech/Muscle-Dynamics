# MariaDB + HeidiSQL — start here

**Use this new MariaDB project ZIP, not the earlier PostgreSQL ZIP.** HeidiSQL is your client; this edition connects to your existing MariaDB server using Prisma's `mysql` connector. You do not need to install PostgreSQL.

## 1. Extract the new project
Extract the entire new ZIP to a **new folder**, for example `C:\Projects\muscle-dynamics-mariadb`. Do not copy the old project's `node_modules`, `.next` or `.env` over it. If you have any existing business data, back it up first; this is a fresh schema, not an automatic PostgreSQL-to-MariaDB data migration.

## 2. Import the SQL in HeidiSQL
1. Start MariaDB (or MySQL/MariaDB in your XAMPP/Wamp control panel).
2. Open HeidiSQL and connect to your existing MariaDB session, using your own host, username, password and port. Port is often **3306**; use the actual port shown in your session.
3. Choose **File → Load SQL file** and open `database\muscle_dynamics_mariadb.sql` from the new project. The separately supplied `Muscle-Dynamics-MariaDB.sql` is the same file.
4. Clear any text selection, then execute the **whole file** (normally **F9**, or Run → Run). Do not execute only the highlighted line.
5. Refresh the left database tree (normally F5). You should see **muscle_dynamics** containing `User`, `Plan`, `PaymentRequest`, `Membership`, `_prisma_migrations`, and the other application tables.

The script creates and selects `muscle_dynamics`. It uses MariaDB syntax (backticks, InnoDB-compatible schema, utf8mb4 and native enums), not PostgreSQL `public` schemas. It contains no default owner, passwords, plan prices or payment accounts. It records its migration baseline so the app launcher can safely check for later migrations.

**Import once into a fresh/empty application database.** Do not re-run it against a database with existing application tables, and do not ignore SQL errors and continue. It never drops existing tables, but an interrupted import can leave an incomplete schema. Back up and choose a new empty database if needed. If you choose another name, change BOTH the script's `CREATE DATABASE` and `USE` identifiers before running, and the same database name in `.env`.

Recommended: a maintained MariaDB release (10.11+); tested here with **11.8.6**. Check your version with:
```sql
SELECT VERSION();
```

## 3. Create the local configuration
Double-click `START-WINDOWS.bat` once. It creates `.env` with a random setup token, then stops until you enter your database connection. Open `.env` in Notepad and change the first line:

```env
DATABASE_URL=mysql://YOUR_HEIDISQL_USER:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:3306/muscle_dynamics
```

Use the database login credentials from your HeidiSQL session—not a gym member login. The prefix is **`mysql://` even though the server is MariaDB**. Replace host/port too if your session differs. Never paste a JDBC URL or a `postgresql://` connection here.

If your local MariaDB user is `root`, use `root` as the username. If that local account genuinely has an empty password, the local-development URL form is:
```env
DATABASE_URL=mysql://root:@127.0.0.1:3306/muscle_dynamics
```
This is only an example for an existing passwordless LOCAL development installation—not a recommendation to remove/set a blank password. For production, use a dedicated database user, strong password and restricted network access. HeidiSQL's user-management tools can create a dedicated user with permissions for only this database.

URL-encode special characters in the password: `@` → `%40`, `#` → `%23`, `:` → `%3A`, `/` → `%2F`, `%` → `%25`. Encode the password component, not the whole URL. Do not share `.env` or your database password.

Keep these other local values:
```env
APP_URL=http://localhost:3000
UPLOAD_DIR=.uploads
NODE_ENV=development
```
Keep the generated `BOOTSTRAP_TOKEN` private and unchanged until owner setup. Save the file exactly as `.env`, not `.env.txt`.

## 4. Start the app
Run **`START-WINDOWS.bat` again** and leave the terminal open. It installs dependencies as needed, generates the MariaDB client, checks/applies migrations and starts Next.js.

Open:
- Website: **http://localhost:3000**
- First owner: **http://localhost:3000/setup.html**
- Admin: **http://localhost:3000/admin.html**

At setup, enter the `BOOTSTRAP_TOKEN` from your own `.env`, then create your real owner account. Follow `OWNER.md` to add actual gym plans, receiving accounts, contacts and policies.

**The SQL import alone does not run the website.** Do not double-click `public\index.html`; authentication/payments need the Node server.

## Optional: skip manual SQL import
If the database exists and is completely empty, `npm run db:deploy` / the launcher can create the tables directly. Choose one first-install route: full HeidiSQL SQL import OR direct Prisma migration. The supplied full SQL import already includes the matching `_prisma_migrations` history. Do not separately import only a partial migration SQL file.

## Errors
- **1064 near `"public"`**: you opened the old PostgreSQL file. Use the NEW `muscle_dynamics_mariadb.sql` and updated project.
- **Access denied**: verify username/password, user host permissions, password URL encoding and database privileges. Do not publish credentials when asking for help.
- **Can't connect / ECONNREFUSED**: start MariaDB; match HeidiSQL host and actual port. A HeidiSQL SSH tunnel works only while the tunnel is open; the app must reach the database itself.
- **Unknown database**: refresh HeidiSQL and confirm the SQL ran against the intended server; the database name in `.env` must match.
- **Table already exists**: do not delete business data. Back up, then use a fresh database or ask a developer to inspect the partial installation.
- **P3005 database is not empty**: the database was populated without matching Prisma history. Do not blindly mark it applied. Use this complete SQL file on a new empty database, or have a developer verify schema equivalence before baselining.
- **Password contains # or @**: URL-encode the password component. Never share it here.
