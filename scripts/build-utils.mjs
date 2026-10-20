import fs from 'node:fs/promises';
export function backendOrigin(value=''){
 const text=value.trim();if(!text)return '';
 if(/[\r\n]/.test(text))throw Error('Backend URL cannot contain line breaks.');
 let u;try{u=new URL(text);}catch{throw Error('Backend URL must be a full HTTPS origin.');}
 if(u.protocol!=='https:'||u.username||u.password||['localhost','127.0.0.1','[::1]'].includes(u.hostname)||u.search||u.hash||!['','/'].includes(u.pathname))throw Error('Use only your public HTTPS backend origin, with no credentials, /api path or query string. Leave blank to connect inside the app.');
 return u.origin;
}
export function requireTestAcknowledgement(value){if(value!=='true')throw Error('Tick the test-build acknowledgement in Run workflow. IPA is UNSIGNED; APK uses a public test key; security findings still need review.');}
export function ensureTestSigning(gradle){
 if(!/release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.debug/.test(gradle)||!gradle.includes("file('debug.keystore')"))throw Error('Expo Android template changed: release APK is not configured with the expected public test key. Refusing to label an unsigned APK installable.');
}
export async function writeBuildNotice(file,platform){
 const body=platform==='ios'?'UNSIGNED IPA — NOT normally installable on an iPhone. No Apple certificate, provisioning profile or App Store signing was applied. Separate lawful signing/provisioning is required. Not an App Store/TestFlight release.':'ANDROID TEST APK — release JavaScript is embedded, but it uses the publicly known Expo/Android debug signing key. For private testing only, not Google Play or production. Do not enter real financial data until the app security review is complete.';
 await fs.writeFile(file,`MUSCLE DYNAMICS\n\n${body}\n\nBackend is separate: use your gym HTTPS API origin, never a database URL or localhost.\nUnresolved upstream mobile tooling advisories remain; review SECURITY.md.\n`);
}
