# Connected setup and deployment

Services were intentionally left unconfigured at the owner's request. This is an operator guide, not evidence of deployment. You do not need npm/CMD on your Windows PC to use the GitHub build workflow.

## 1. Infrastructure you must supply later

- A supported Node 22 server or Docker host, MariaDB, a private database connection, persistent private image storage, an HTTPS API hostname and a continuously running worker.
- A real SMTP account/from address for password-reset delivery.
- For push: your Expo/EAS project UUID and platform credentials (Android FCM v1 and Apple APNs/signing/provisioning as applicable), with a physical device.
- Your actual plans, prices, receiving accounts, gym contacts, privacy/terms text and payment instructions. These are deliberately not invented.
- Backups, restoration testing, monitoring, retention/deletion procedures and a security review before accepting real customers.

Choose a provider and approve its costs separately. No provider account or payment has been created. This source has no claim of a verified one-click hosting deployment.

## 2. Environment configuration

Copy `backend/.env.example` to a private `backend/.env` **on the server only**. Replace all placeholders.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | `mysql://` URI for the MariaDB application user; URI-encode password characters. Compose host is `db`, database `muscle_dynamics`, user `muscle_app`. |
| `UPLOAD_DIR` | Persistent private directory. Compose uses `/var/data/muscle-dynamics`. Do not expose it as a static website. |
| `HOST`, `PORT` | Bind interface and API port. Put HTTPS termination in front of it. |
| `APP_ORIGIN` | Actual allowed browser origin; native clients use the HTTPS API origin without `/v1`. |
| `BOOTSTRAP_TOKEN` | Newly generated, private, random token of at least 32 characters, used only for the first owner. Placeholder tokens are refused. Unset it after setup. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE` | Real mail service. `465` generally uses `true`; `587` uses `false` with mandatory STARTTLS. Confirm with your provider. |
| `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM` | Private provider credentials and authorized sender. Empty mail settings do not produce pretend recovery emails. |
| `PUSH_ENABLED` | Keep `false` until provider/project/device tests pass; worker still generates in-app history and expiry reminders. |
| `EXPO_ACCESS_TOKEN` | Optional server-only token when Expo push access-token security is enabled. Never embed it in the app. |

`TRUST_PROXY` defaults off. Only set it to `true` behind a trusted, access-restricted reverse proxy that overwrites client-forwarded headers. Do not expose that API listener directly to untrusted networks. Rate limiting is per process; review shared limits before horizontal scaling.

### Optional Docker Compose template

Also copy the root `.env.example` to a private root `.env` and set two different long random database passwords. The backend URI password must match `DB_PASSWORD`; the root password is not the application password. Hexadecimal random secrets avoid URI-encoding mistakes.

Server/operator commands, not Windows launchers:

```sh
docker compose config --quiet
docker compose up -d --build
```

The template binds API port 3000 to **127.0.0.1 only** for a host reverse proxy. MariaDB is not published. Add HTTPS/reverse-proxy configuration appropriate to your host; the template does not provision a certificate or DNS. API startup applies committed migrations. The worker may retry until tables are ready. Docker execution was **not tested in this workspace**.

### Without Docker

On a provisioned server, from `backend/`, install the locked dependencies, apply migrations and supervise both processes:

```sh
npm ci --include=dev
npm run db:deploy
npm start
# In a separate supervised service, same private environment:
npm run worker
```

Use a restricted runtime DB user; consider a separate migrator account in production. Do not use a disposable integration-test database for real customers. Prisma uses the MySQL connector for MariaDB.

## 3. Verify and connect

- Check `GET https://YOUR-ACTUAL-HOST/health`. `ok` checks DB reachability. `mailConfigured` / `pushConfigured` indicate settings only, **not verified delivery**.
- Connect the mobile app to the same HTTPS origin through **Connect to your gym**; it verifies `/v1/config`. Do not add `/v1`, user credentials, query strings or fragments to the origin.
- Or supply `backend_url` in the GitHub workflow. Blank is supported: configure inside the app later. Nothing silently switches to demo on errors.
- Development builds can permit HTTP for local testing. Do not use real passwords/payments over development HTTP.

## 4. Create the first owner

1. Connect to the real configured API. If no owner exists, the connection screen offers first-owner setup.
2. Enter the private bootstrap token directly in the app, owner details and a matching password/confirmation of at least 10 characters.
3. Open **Profile → Owner workspace → Gym settings**. Publish actual contacts, address, hours, privacy/terms text and payment instructions.
4. Add real PKR plans and receiving options. Add real workouts, classes and announcements if used.
5. Remove `BOOTSTRAP_TOKEN` from the server environment and restart the API. Setup cannot create another owner once one exists.
6. Registration opens only after required real gym configuration is supplied. There is no seeded owner password.

## 5. Configure recovery email

Configure SMTP privately; confirm sender authorization/SPF/DKIM/DMARC with your provider. Use a real test recipient and perform request → email arrival → single-use reset → old-session rejection. Recovery sends an expiring code and a mobile deep link; it is not an OTP login system. When mail is absent the API returns a clear unavailable error. Actual inbox delivery was not executed here.

## 6. Configure push

- Set the app's real `expo_project_id` workflow input. For Android, optionally add repository secret `GOOGLE_SERVICES_JSON_BASE64` containing the matching Android Google services JSON, base64 encoded. This is app configuration, **not** an FCM v1 server service-account credential.
- Configure actual FCM v1 / APNs credentials with your own Expo/platform account. Merely providing the JSON or UUID does not configure server-side platform delivery.
- Build and lawfully sign/install on a physical device. In **Settings → Notification settings**, save preferences and register the device after granting permission.
- Run the backend worker, enable push only when ready, and generate a real test event. Verify foreground/background/terminated delivery, tap routing, preference suppression, revocation and provider receipts.
- Jobs accumulated while push was disabled may be sent on enablement. Review/retire obsolete pending jobs operationally before enabling a long-idle deployment; retain notification/financial history according to policy.

Reference documentation: https://docs.expo.dev/push-notifications/overview/ and https://docs.expo.dev/push-notifications/push-notifications-setup/ . No physical-device/provider certification has been performed.

## 7. Operations and verification

See `SECURITY.md` and `VERIFICATION.md`. Back up MariaDB and private uploads together; test restore before launch. Monitor API errors, worker failures, pending/failed PushJob and PushReceipt records, storage use and SMTP delivery. Provider retries are bounded and at-least-once; a retry can duplicate a notification. Financial records are not automatic deletion targets.
