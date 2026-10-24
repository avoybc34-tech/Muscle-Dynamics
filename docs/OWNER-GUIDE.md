# Owner and staff operations

## Configure the real business

Use **Profile → Owner tools**. Settings control gym contacts, address/hours, policies and receiving instructions. Plans accept PKR prices (stored as integer paise), duration in days and benefits, one per line. Accounts support BANK, EASYPAISA, JAZZCASH and CASH; use only accounts you control. Transfer options need a real account title/number. Do not use sample bank details.

Existing plan/account/workout details can be edited, and published records can be deactivated without deleting past payment snapshots. Workouts use exercise fields with Add/Remove controls, sets, reps, rest seconds and technique instructions—not a raw JSON editor. Workout level must be Beginner, Intermediate or Advanced. Classes currently use explicit ISO-8601 timestamps; check the timezone before publishing. Announcements publish to members and create notification events.

## Review manual payments safely

1. Member chooses a published plan and receiving option, creates a draft, follows actual transfer/cash instructions, attaches their private proof, enters a useful reference and submits.
2. Status is **PENDING**. Uploading an image or ticking a member confirmation does **not** activate or renew membership.
3. Owner opens **payments**, inspects private proof, and checks actual bank/Easypaisa/JazzCash records or physically received cash independently. Screenshots alone are not verification.
4. Approve only after actual funds are confirmed; enter the actual verified transaction/reference and review note. Duplicate references are rejected. Reject unsupported/unreceived requests with a clear note.
5. The transaction writes the financial decision, history, membership and notification once. Concurrent duplicate approvals cannot double-extend a period.

### Financial rules

- Same-plan renewal while active extends from the current paid-through date.
- If expired, a verified approval starts a fresh period at approval time.
- A different plan is not applied just by selecting it; it requires owner review/approval. An approved plan change starts a new period. Review any remaining active time with the member before approving.
- No automatic refunds, prorating, recurring charging or card gateway is implemented or implied. Requests for exceptional adjustments must be handled transparently under the gym's actual policy.
- Past plan/receiving snapshots and membership history remain tied to the recorded decision rather than being silently rewritten when a plan/account is edited.

## Staff and support

Owner member management can grant/revoke restricted STAFF access or deactivate a non-owner account. Deactivation revokes sessions and disables devices. Staff workspace exposes member lookup and support replies—not settings, payment approval, private member receipts or role changes. Owner cannot demote/deactivate the sole owner through this UI.

Support requests persist in the backend. Owner/staff replies become available to the member and generate a notification event. The account-data review control submits a support request; it is **not** an automatic erasure button or legal guarantee. Verify identity, retention obligations and financial-record requirements before any deletion.

## What must be checked outside this source package

Real funds verification is a human responsibility. Use controlled real-device test accounts to test upload permissions, privacy, push, signing and expired-session handling. Publish policies appropriate to the actual business; bundled setup prompts are not legal advice or finished business policies.
