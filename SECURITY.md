# Security / operational readiness

- Fresh source only: no private `.env`, real database records, uploaded proofs, user accounts, credentials, Apple keys or Android release signing keys are included.
- All website, owner/member and app sessions use the shared MariaDB backend. Website cookies are HttpOnly/SameSite with production Secure cookies; app access tokens are stored in platform secure storage. Use HTTPS, strong unique owner credentials and restricted staff permissions. Do not expose the private DB port to the public internet.
- The initial bootstrap token must be kept private, used once for the first owner, and removed after setup. The package contains no default owner password or public setup token.
- Manual payment approval is an administrative decision, not payment-gateway confirmation. Independently verify bank/wallet/cash funds before approving. Receipts alone do not prove settlement.
- Keep database AND receipt backups off-service and test recovery. A Render disk is persistence, not a complete backup plan. Self-hosted MariaDB needs monitoring, updates, backups and coordinated credential rotation.
- Review dependency reports before launch and apply supported updates with regression tests. The root web/backend and mobile have separate dependency trees. Root audit results do not clear mobile advisories.
- Mobile has unresolved high-severity upstream build-toolchain advisories recorded in verification. CI publishes a report but deliberately does not pretend audit success. Android uses a public test key; iOS IPA has no signing/provisioning. Neither is approved as production/store-ready.
- Do not publish raw error logs containing secrets or private user data. Never place DB credentials in `EXPO_PUBLIC_*`, HTML/JS, workflow inputs, or screenshots. The only public mobile environment value should be the website HTTPS origin.
- Native cloud builds, real devices, Render service creation and a complete production penetration test have not been performed here. Complete those checks before accepting real customer records or payments.
