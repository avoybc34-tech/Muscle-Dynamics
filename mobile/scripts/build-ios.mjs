import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const profile=process.argv.includes('--testflight')?'testflight':'preview';
console.log('\nMuscle Dynamics — signed iPhone build\n');
console.log('For Expo Go testing, use npm start instead. No IPA is needed.');
console.log('This build needs your own Expo/EAS project, unique iOS bundle ID, and paid Apple Developer signing access.');
console.log('Internal IPA builds require the test iPhone to be registered with EAS. TestFlight needs App Store Connect configuration.');
console.log('Do not share Apple passwords or signing credentials in source code.\n');
const config=JSON.parse(fs.readFileSync(new URL('../app.json',import.meta.url)));
if(config.expo.ios.bundleIdentifier.includes('yourgym')){console.error('STOP: replace the placeholder bundleIdentifier in app.json with your company-owned identifier.');process.exit(1);}
if(!config.expo.extra?.eas?.projectId){console.error('STOP: run npx eas-cli@latest login, then npx eas-cli@latest init in the mobile folder to link your Expo project.');process.exit(1);}
const command=process.platform==='win32'?'npx.cmd':'npx';
const args=['eas-cli@latest','build','--platform','ios','--profile',profile];
console.log('Starting:',command,args.join(' '));
const result=spawnSync(command,args,{stdio:'inherit',shell:process.platform==='win32'});
process.exit(result.status??1);
