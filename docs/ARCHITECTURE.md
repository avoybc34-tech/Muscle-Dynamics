# Architecture and API map

## Mobile

Version 2.1 implements the approved Manrope/navy/blue design in shared Typography/UI/Visuals components. Home training reads published workouts; the weekly panel derives completed sessions from actual activity. Owner/staff workspace is role-gated and included in mobile, following the latest scope. First-owner setup remains private-token gated. Explicit owner demo is memory-only, with sample-only review actions.

`App.tsx` composes native stack/tab navigation, launch state, reset linking and allowlisted notification routing. `src/Session.tsx` owns live session hydration, refresh locking, API origin, logout and the separate opt-in demo. Refresh credentials/origin are stored in SecureStore on native devices; access credentials are held in memory. Live API failures remain visible errors with retry rather than generating paid/member sample state.

`src/screens/` separates auth, dashboard/profile, training/classes, payment, settings and role-restricted owner/staff workflows. `src/components/UI.tsx` contains navy/blue cards, fields, buttons, loaders and errors. Resource loading is bounded by client timeouts. Refresh loads fresh dashboard data; session expiry/revocation returns to auth.

The web QA mode requires both browser platform and `EXPO_PUBLIC_WEB_DEMO=true`; it is explicitly labelled sample data and bypasses native SecureStore only for that browser demo. **Production web authentication is not a deliverable.** Native live auth must be verified on actual devices.

## API and database

Fastify → authentication/role guards → Zod validation → Prisma/MySQL connector → MariaDB. Committed migrations create users, sessions, reset tokens, gym settings, plans/accounts, payments, membership/history, workouts/activity/progress/classes/bookings, private files, notifications/devices/outbox/receipts, support and audit records.

Opaque bearer credentials are hashed server-side; passwords use salted scrypt. Refresh rotation and reset/session invalidation are transactional. Owner setup is one-time, token gated and refuses placeholder bootstrap values. Auth errors do not return raw ORM/SQL details. Uploads are size/type checked and re-encoded; filesystem paths are never exposed as public static URLs.

Financial approval locks the payment and updates paid-through state transactionally. Retry handling includes MariaDB changed-record/deadlock/timeout conflicts; a final conflict is a safe 409, not a fabricated success. Class booking uses capacity protection. Expiry writes compare the previously read expiry so a concurrent paid renewal cannot be overwritten by a stale expiry pass.

## Routes

All application routes are prefixed `/v1`; `/health` is unprefixed. Owner/staff list routes accept validated `cursor`/`limit` query parameters (up to 100); member payment pages are capped at 50 per response, with `nextCursor`. Dashboard collections are recent bounded summaries, not the entire database. Full validation is authoritative in `backend/src/app.mjs`.

| Area | Routes |
|---|---|
| Public/bootstrap | `GET /config`, `POST /setup` |
| Authentication | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/forgot`, `/auth/reset`; authenticated `POST /auth/logout` |
| Account | `PATCH /profile`, `POST /password`, `GET /sessions`, `DELETE /sessions/:id`, `PATCH /preferences` |
| Devices | `PUT /devices`, `DELETE /devices` |
| Member records | `GET /dashboard` (personal membership/history, payments, activity, progress, support and notifications), `GET /payment-history` (cursor pages), `GET /plans`, `/payment-options`, `/workouts`, `/classes` |
| Payments/media | `POST /payments`, `/payments/:id/proof`, `/payments/:id/submit`, `/avatar`; `GET /files/:id` with authorization |
| Training | `POST /workouts/:id/start`, `PATCH /activity/:id`, `POST /progress`, `POST /classes/:id/book`, `DELETE /bookings/:id` |
| Support/history | `POST /support`, `POST /notifications/read` |
| Owner | `GET/PUT /admin/settings`; `GET/POST /admin/plans`, `/accounts`, `/workouts` and `PUT .../:id`; `GET /admin/payments`, `POST /admin/payments/:id/review`; classes, announcements and audit |
| Owner/staff | `GET /admin/members`, `GET /admin/support`, `POST /admin/support/:id/reply`; only owner can `PATCH /admin/members/:id` |

A signed-in member can read only their personal financial/activity/support/private-media records. Owner finance review is distinct from staff support rights. Role checks happen on the server, not just in navigation.

## Notifications

Business events write in-app notifications and deduplicated outbox records. The minute worker generates 1/3/7-day renewal reminders in pages (not a fixed 500-user ceiling), transitions expired memberships, claims delivery jobs, checks preferences and valid non-revoked device sessions, sends through Expo and polls receipts. Generic push bodies avoid exposing amounts/message details on a lock screen; event titles can still indicate the category.

Delivery is at-least-once, with bounded retries and abandoned-lease recovery; provider/network uncertainty can cause duplicate delivery. SMTP/push configuration flags are not delivery proofs. The worker is required even when the app is closed; mobile background JS is not used as a pretend reliable scheduler.

## Deliberate boundaries

No hosted environment, payment gateway, recurring billing, automatic refunds/proration, real seed accounts, social login, production web auth, signed App Store release or verified mail/push/device delivery is supplied. Operational monitoring, backups, policy review, scale/load tests and release signing remain deployment responsibilities.
