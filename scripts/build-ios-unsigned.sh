#!/usr/bin/env bash
set -euo pipefail
if [[ "$(uname -s)" != Darwin ]]; then
 echo 'iOS native archiving requires macOS/Xcode. Use the included GitHub macOS workflow.' >&2
 exit 1
fi
mkdir -p build-logs artifacts/ios build-output
node scripts/ci-config.mjs
xcodebuild -version | tee build-logs/xcode-version.txt
npx --no-install expo prebuild --platform ios --no-install 2>&1 | tee build-logs/ios-prebuild.log
printf 'export NODE_BINARY="%s"\n' "$(command -v node)" > ios/.xcode.env.local
pod install --project-directory=ios 2>&1 | tee build-logs/ios-pods.log
xcodebuild \
 -workspace ios/MuscleDynamics.xcworkspace \
 -scheme MuscleDynamics \
 -configuration Release \
 -sdk iphoneos \
 -destination 'generic/platform=iOS' \
 -archivePath "$PWD/build-output/MuscleDynamics.xcarchive" \
 -derivedDataPath "$PWD/build-output/DerivedData" \
 CODE_SIGNING_ALLOWED=NO \
 CODE_SIGNING_REQUIRED=NO \
 CODE_SIGN_IDENTITY='' \
 archive 2>&1 | tee build-logs/ios-xcodebuild.log
app="$PWD/build-output/MuscleDynamics.xcarchive/Products/Applications/MuscleDynamics.app"
test -d "$app"
test -s "$app/Info.plist"
# An archive must contain the release JS, not an app that still needs Metro.
test -s "$app/main.jsbundle"
# Do not accidentally publish an owner-provisioned build as 'unsigned'.
if [[ -f "$app/embedded.mobileprovision" ]]; then
 echo 'Unexpected provisioning profile in unsigned build; refusing to package.' >&2
 exit 1
fi
rm -rf build-output/ipa-staging
mkdir -p build-output/ipa-staging/Payload
ditto "$app" build-output/ipa-staging/Payload/MuscleDynamics.app
ipa_path="$PWD/artifacts/ios/Muscle-Dynamics-UNSIGNED.ipa"
(
 cd build-output/ipa-staging
 zip -qry "$ipa_path" Payload
)
unzip -t artifacts/ios/Muscle-Dynamics-UNSIGNED.ipa >build-logs/ios-ipa-zip-test.txt
node --input-type=module -e "import{writeBuildNotice}from'./scripts/build-utils.mjs';await writeBuildNotice('artifacts/ios/READ-ME-UNSIGNED-IPA.txt','ios');"
(cd artifacts/ios && shasum -a 256 *.ipa >SHA256.txt)
if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
 printf '\n## iOS result — UNSIGNED\nDevice-targeted IPA archive only. **Not normally installable on an iPhone.** Separate lawful signing/provisioning is required. No Apple account or signing secrets were used. Not a TestFlight/App Store release.\n' >> "$GITHUB_STEP_SUMMARY"
fi
