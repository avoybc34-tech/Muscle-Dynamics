import fs from 'node:fs/promises';
import {backendOrigin,requireTestAcknowledgement} from './build-utils.mjs';
try{
 if(process.env.GITHUB_ACTIONS==='true')requireTestAcknowledgement(process.env.ACK_TEST_BUILDS);
 const origin=backendOrigin(process.env.EXPO_PUBLIC_API_URL||'');
 if(process.env.GITHUB_ENV)await fs.appendFile(process.env.GITHUB_ENV,`EXPO_PUBLIC_API_URL=${origin}\n`);
 console.log(origin?'Public backend origin validated.':'No default backend configured. The app will show Connect to your gym.');
}catch(error){console.error(error.message);process.exitCode=1;}
