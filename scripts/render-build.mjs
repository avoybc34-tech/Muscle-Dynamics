// Runs on Render, not the owner's PC. No database connection is needed to build source.
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const env={...process.env,DATABASE_URL:process.env.DATABASE_URL||'mysql://build_only:unused@127.0.0.1:3306/build_only'};
for(const args of [['ci','--include=dev'],['run','build']]){
 const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',args,{env,stdio:'inherit',shell:process.platform==='win32'});
 if(r.error||r.status!==0){console.error('Render source build failed. Read the build error above.');process.exit(r.status||1);}
}
