# Edit the website and app

## Admin edits (no code)
Use **Website & policies** for gym name, tagline, main headline/introduction/about, real contact details, hours, receiving instructions, privacy/membership policies, optional nutrition guidance and gallery/photo IDs. Other admin sections manage actual plans/accounts, trainers/classes and announcements. Saves go to MariaDB and are read by the website/native app. This is an agreed content editor, not a drag-and-drop page builder. Do not insert HTML/scripts: content is plain text and safely escaped.

## Source map
```text
public/index.html          Public website structure and fixed marketing copy
public/member.html         Member HTML entry
public/admin.html          Owner/staff HTML entry
public/setup.html          First-owner HTML entry
public/legal.html          Published policy view
public/css/site.css        All website/workspace responsive styles
public/css/fonts.css       Self-hosted fonts
public/js/common.js        API calls, escaping, dialogs and formatters
public/js/shells.js        Brand, auth layouts, sidebar/mobile navigation
public/js/site.js          Public data rendering
public/js/member.js        Member routes/forms/payment dialogs
public/js/admin.js         Owner and restricted staff routes/forms
public/js/setup.js         First-owner form
public/js/legal.js         Plain-text legal display
public/assets/             Stock photo, mark, fonts/licenses
lib/api.js                 Shared API routes and authorization
lib/domain.js              Schemas, empty defaults and membership rules
lib/security.js            Password/session/origin/rate-limit/transaction helpers
lib/files.js               Private image validation/reencoding/storage
lib/payments.js            Membership activation transaction
prisma/schema.prisma       Database models
prisma/migrations/         Committed migration history
mobile/App.tsx             Native member screens/navigation
mobile/src/GymProvider.tsx SecureStore authentication and shared app state
mobile/src/api.ts          Native API requests and display helpers
mobile/src/ui.tsx          Native colors/styles/reusable controls
```

## Typical changes
- Website colours, spacing, headings and responsive breakpoints: `public/css/site.css`; main values begin near the top. Native colours/styles are separate in `mobile/src/ui.tsx`.
- Fixed homepage sections/buttons: `public/index.html`. Dynamic copy comes from admin settings through `site.js` and overrides its relevant fallback text.
- Dashboard layout/copy: `member.js`, `admin.js`, `shells.js`. Keep user-controlled values escaped with `h()` before building HTML.
- Hero photo: use admin media; blank photo ID falls back to `public/assets/training-floor.jpg`. Do not overwrite `lib/files.js` permissions to make private receipts public.
- App branding: `mobile/app.json`, `mobile/src/ui.tsx`; replace placeholder package/bundle identifiers before signed builds. Add owned icon/splash assets before store release.

## Developer-only safe workflow

These are optional maintainer checks, not owner setup steps. For normal hosting use Render Blueprint from the root README; Render runs npm automatically.

Back up source/database/uploads → edit in VS Code → run `npm run check` (requires dedicated test DB) and `npm run build` → `npm run typecheck --prefix mobile` for app changes → test relevant browser/phone flow → commit/deploy. Never hand-edit an already deployed migration; create a new migration with `npm run db:migrate` on a developer database, commit it and use `npm run db:deploy` in production.

All user-facing frontend HTML/CSS/JS is ordinary editable source, not compiled React page markup. Next is used for the backend/server and a root redirect; the native app is React Native/TypeScript as required by Expo. Do not remove the API server expecting static hosting to support login or payment review.
