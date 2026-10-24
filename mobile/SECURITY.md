# Offline design-preview security limitations

This is a clearly labelled test/demo, not a production gym or payment service. The runtime has no API transport or remote login, no persistent session storage, no receipt picker and no real payment gateway. All sample edits exist in memory and reset when restarted. Do not enter real personal information or passwords.

Latest npm audit: **5 high / 0 moderate / 0 critical** package-chain findings in the locked mobile graph. Affected package chains include Expo CLI/code-signing tooling, node-forge and zod. Counts can change; every workflow run saves the current audit and visible summary. Do not force an incompatible dependency downgrade or claim offline mode makes toolchain advisories harmless. No audit fix --force or legacy-peer-deps workaround was applied.

GitHub controls: manual dispatch only, test-build acknowledgement, read-only repository permissions, no persisted checkout credentials, separate native artifacts/logs and a security report. Source is installed from its lockfile. No Apple/Expo login, signing secret, backend URL or DB credentials are requested. No automatic store upload/publishing.

Android uses a publicly known test/debug signing identity. IPA has signing disabled. Neither artifact is production/store-ready. Use valid private signing, owned identifiers, legal/privacy flows, reviewed dependencies and physical-device tests before any future production release. Native compilation is not verified until a real Actions job succeeds.

The OS share sheet can be opened only by the user for a sample request record. The sample receipt is bundled locally and labelled NOT A PAYMENT; no gallery/photo access is needed. There is no automatic email, push notification, bank transfer, support delivery or real password change.
