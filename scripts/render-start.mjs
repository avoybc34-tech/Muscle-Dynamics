// Render-only startup: wait for private DB, apply committed migrations, then serve the website/API.
import {spawn,spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyRuntimeEnvironment} from '../lib/runtime-env.js';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
try{
 applyRuntimeEnvironment();
 const {PrismaClient}=await import('@prisma/client');
 const db=new PrismaClient({log:[]});let connected=false;
 try{
  for(let attempt=1;attempt<=30;attempt++){
   try{await db.$queryRaw`SELECT 1`;connected=true;break;}
   catch{console.log(`Waiting for private database (${attempt}/30). No credentials are printed.`);await new Promise(r=>setTimeout(r,3000));}
  }
 }finally{await db.$disconnect();}
 if(!connected)throw Error('Private database is not ready. Check the MariaDB Render service and its disk/environment, then redeploy the web service.');
 console.log('Private database ready. Applying committed schema migrations.');
 const migration=spawnSync(process.execPath,['node_modules/prisma/build/index.js','migrate','deploy'],{stdio:'inherit',env:process.env});
 if(migration.error||migration.status!==0)throw Error('Database migration failed. Review the migration log; do not reset or delete existing business data.');
 if(process.argv.includes('--migrate-only')){console.log('Migration check completed; website not started.');}
 else{
  const port=String(process.env.PORT||'3000');if(!/^\d+$/.test(port))throw Error('Invalid web server port.');
  console.log('Starting Muscle Dynamics website and API.');
  const child=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','0.0.0.0','--port',port],{stdio:'inherit',env:process.env});
  for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
  const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>resolve(code??1));});process.exitCode=code;
 }
}catch(error){console.error('Startup stopped:',error.message);process.exitCode=1;}
