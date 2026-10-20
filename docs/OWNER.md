# Owner & staff operations

## Launch checklist
1. Create the first owner at `/setup.html` using your private setup token; remove the token afterwards. Never share your owner login with staff.
2. **Website & policies:** enter actual address, phone, public email, opening hours, WhatsApp (optional), homepage content, privacy notice and membership terms. Policies must cover your verification process, tax treatment, cancellation/refund decisions, retention, account-deletion/data-access requests and renewal rules. The platform supplies no invented legal policies. Signup stays closed until contact fields and both policies (50+ characters each) exist; that validation is not legal review.
3. **Membership plans:** add actual gym plan name, unique slug, PKR price, duration in days, benefits and display order; mark active to publish. Amounts are stored as integer paisa. No legacy INR or property-listing plans are seeded.
4. **Receiving accounts:** add only actual accounts you control: Bank, Easypaisa, JazzCash, Cash or Other. Transfer methods need account title and account number/IBAN before activation. Cash requires instructions. Never enter a password, PIN, OTP or bank-login credential.
5. Add clear transfer instructions in Website & policies. Payment drafts require an active plan/account and completed contact/policy/instruction setup.
6. Upload owned/authorized gym photos to Photo library; paste image IDs into website/gallery/trainer settings. The included stock image is illustrative, not a claim about your premises.
7. Add trainers, future classes and announcements. Enter class times in your browser’s local timezone; member views show Pakistan time.
8. Create individual staff accounts as needed. Review security/backup/release checks before inviting the public.

## Verify a manual transfer
Member chooses plan → sees account instructions → transfers outside the app → uploads screenshot and transaction/sender details → submits **PENDING**. A draft or pending request grants no gym access.

1. Open **Payment verification**.
2. Read the frozen price/plan/account details and private screenshot.
3. Independently open your actual receiving bank/wallet account. Match amount, sender/reference and date, and ensure the same transfer was not already used elsewhere. The platform cannot query your bank or validate a screenshot as money received.
4. Only if actual funds are confirmed, select approval, tick the actual-funds confirmation and write a meaningful review note.
5. If not confirmed, reject with a clear reason. No membership activates; the member sees the note and in-app update. A rejected request is immutable; contact the member and ask for a new request as appropriate.

Reviewed payments cannot be re-reviewed. Concurrent duplicate approval is transaction-protected and creates one subscription period. Screenshot viewing is limited to its submitting account and the owner, not restricted staff.

## Renewals & cash
- Approved active **same-plan** renewal extends existing expiry by purchased days.
- Expired/new/cancelled membership restarts at approval time.
- An active plan change is an owner decision and replaces the membership period from approval; no automatic proration or credits.
- No recurring debits, automatic renewals, automated refunds, bank integrations or card gateway.
- Use **Record cash payment** only after you actually receive cash. Select an active CASH account/member/plan, confirm receipt and enter a note. This immediately creates an audited approved payment and membership/renewal. It is not a “free activate” shortcut.
- Payment request downloads/records are **not tax invoices or bank confirmations**. Arrange legally required receipts/invoices separately.
- Membership cancellation requires a reason and notifies the member. It does not send a refund.

## Daily operations
- **Members:** search/paginate, inspect membership and attendance, edit contact/status, create staff access, reset non-owner passwords or cancel membership (owner permissions). Verify identity before password resets. Send temporary passwords through a private channel; have members change them immediately.
- **Attendance:** staff/owner record active members at reception; one check-in per member per Pakistan calendar day. No location spoofing/QR self-check-in is implied.
- **Classes:** capacity is transaction-protected. Members need access through class start. Cancelling a class cancels bookings and notifies; changed times/title/trainer notify booked members. Review bookings if changes affect membership coverage.
- **Support:** reply and set open/resolved; replies produce in-app updates. No email or WhatsApp message is automatically sent.
- **Reports:** approved payments only, filtered by approval date in Pakistan time; CSV export capped at 10,000 rows. Narrow dates for larger datasets. Revenue is not bank reconciliation, accounting, refund or tax reporting.
- **Audit:** owner sees recent history of financial/admin changes. Keep separate operational backups; UI history is capped, underlying records remain in MariaDB.

## Access boundaries
Owner can manage financial records, roles/settings/content and operations. Restricted staff can look up members, view membership/attendance, record check-ins, view classes/trainers/rosters and reply to support. Staff cannot view payment screenshots/reviews/reports, edit plans/accounts/settings/roles or approve payments. Members access only their own private data.

## Recovery & maintenance
There is no fake email-reset integration. Members contact reception; the owner verifies identity and resets non-owner passwords. For a lost owner account, a trusted server/database administrator must perform a controlled recovery with a backup and identity verification; do not delete the owner or reopen bootstrap setup. Account deletion/data requests are handled by the gym through Support according to its policy; automatic deletion is not implemented. Review mobile store deletion requirements before publishing.

Log out revokes all current sessions for that account; password changes/resets revoke sessions too. Browser sessions use HttpOnly cookies; native sessions use SecureStore. Do not place payment proofs or database exports into a public media folder.
