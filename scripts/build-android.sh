#!/usr/bin/env bash
set -euo pipefail
mkdir -p build-logs artifacts/android
node scripts/ci-config.mjs
npx --no-install expo prebuild --platform android --no-install 2>&1 | tee build-logs/android-prebuild.log
node --input-type=module -e "import fs from 'node:fs/promises';import{ensureTestSigning}from'./scripts/build-utils.mjs';ensureTestSigning(await fs.readFile('android/app/build.gradle','utf8'));"
if command -v sdkmanager >/dev/null; then
  set +o pipefail
  yes | sdkmanager --licenses >build-logs/android-licenses.log 2>&1
  license_status=${PIPESTATUS[1]}
  set -o pipefail
  test "$license_status" -eq 0
fi
chmod +x android/gradlew
(
 cd android
 ./gradlew :app:assembleRelease --no-daemon --stacktrace --max-workers=2 \
  '-Dorg.gradle.jvmargs=-Xmx3g -XX:MaxMetaspaceSize=768m' \
  '-PreactNativeArchitectures=arm64-v8a,armeabi-v7a' \
  '-Pandroid.enableMinifyInReleaseBuilds=false'
) 2>&1 | tee build-logs/android-gradle.log
apk=android/app/build/outputs/apk/release/app-release.apk
test -s "$apk"
# A debug variant would normally need Metro. Require embedded release JS before publishing a test APK.
unzip -l "$apk" >build-logs/android-apk-files.txt
grep -q 'assets/index.android.bundle' build-logs/android-apk-files.txt
sdk="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
test -n "$sdk"
apksigner=$(find "$sdk/build-tools" -type f -name apksigner | sort -V | tail -1)
test -x "$apksigner"
"$apksigner" verify --verbose --print-certs "$apk" | tee build-logs/android-signature.txt
cp "$apk" artifacts/android/Muscle-Dynamics-ANDROID-TEST.apk
node --input-type=module -e "import{writeBuildNotice}from'./scripts/build-utils.mjs';await writeBuildNotice('artifacts/android/READ-ME-TEST-APK.txt','android');"
(cd artifacts/android && sha256sum *.apk >SHA256.txt)
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
 printf '\n## Android result\nInstallable release-mode APK with bundled JS, signed using the **public test key**. Not a Play Store/production release. Download the Android artifact below.\n' >> "$GITHUB_STEP_SUMMARY"
fi
