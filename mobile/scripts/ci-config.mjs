import {requireTestAcknowledgement} from './build-utils.mjs';
try{if(process.env.GITHUB_ACTIONS==='true')requireTestAcknowledgement(process.env.ACK_TEST_BUILDS);console.log('Offline design preview. No backend URL, API or credentials required.');}catch(error){console.error(error.message);process.exitCode=1;}
