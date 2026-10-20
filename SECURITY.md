# Test builds, not production security approval

Latest checked dependency graph reports **15 high**, 0 moderate, 0 critical package-chain findings. Counts may change; every workflow run saves the current `npm audit` JSON and a visible summary.

Known upstream roots at preparation time:
- `braces <=3.0.3`: nested-pattern stack-exhaustion DoS (GHSA-vfj7-8cjw-p6xm), affecting Metro/micromatch/React Native/Expo tooling chains.
- `node-forge <=1.4.0`: RSA signature-verification issue (GHSA-86w9-cpqp-85rv), affecting Expo CLI/signing tooling chains.

No compatible patched release was available in those lines at the earlier inspection. The automatic force suggestion downgraded Expo/RN to an incompatible set and was NOT applied. This new repository also does not run `audit fix --force` or `--legacy-peer-deps`, falsify the audit, or hide failed dependency checks. Developer review/compatible fixes remain required. Avoid exposing Metro to untrusted networks or accepting untrusted signing inputs. No claim is made that tooling placement makes advisories harmless.

Other controls:
- Workflow dispatch only, explicit test acknowledgement, read-only repository permissions, and no persisted checkout credentials.
- No Apple/Expo login or signing secrets requested. No automatic store upload or publishing.
- Source is freshly checked out and installed from the lockfile; generated native projects are not committed.
- APK signing is checked and deliberately labelled **public test key**, not a production identity. IPA signing is disabled and labelled **UNSIGNED**.
- API input accepts only a public HTTPS origin without credentials/query/path/newlines; the URL is compiled public configuration, not a place for secrets.
- Local environments, native outputs, signing keys and credentials are ignored; the delivered source ZIP contains no such secrets.

Before production: resolve/review advisories, set an owned app identity/private signing, test both platforms physically, implement any store-required account-deletion/privacy flows, configure the actual secured backend, and review gym legal/payment/retention policies. No account-deletion automation, push/email notifications or card gateway was added in this build-cleanup task.
