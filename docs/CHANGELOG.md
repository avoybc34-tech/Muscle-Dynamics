# Version 2.1 — approved full-app design

- Implemented the selected navy/blue design direction, photography-led training, bundled Manrope typography, rounded panels and floating native tabs across real member screens.
- Kept live authentication/session behavior, data isolation, financial review rules, workout logging, progress, classes, private images, support, preferences and notification integration.
- Included owner/staff tools and first-owner setup, as the latest instruction explicitly requested admin and everything shown in the designs. The temporary member-only scope is superseded.
- Restructured owner navigation into a purposeful workspace, with actual settings, plans/accounts, members/roles, payments, workout exercise forms, classes, announcements, support and audit.
- Added a clearly labelled, isolated owner demo; it changes sample data only and cannot contact the live API or verify real funds.
- Corrected static-row wrappers so switches remain interactive; approval is disabled until independent funds confirmation, a reference and a reason are provided. Live server verification remains authoritative.
- Weekly UI counts actual completed activities and does not invent a workout goal.
- Captured actual browser demo screens after transitions completed, rather than presenting generated designs as implemented screenshots.

20 mobile tests and 20/20 Expo Doctor checks passed. Android/iOS exports and native prebuilds passed. Backend source/migrations/dependencies remain byte-identical to the previously database-verified 23-test version. See VERIFICATION.md for the distinction between source/export checks and external native/device/service gates.
