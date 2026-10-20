import {spawnSync} from 'node:child_process';
import fs from 'node:fs/promises';
await fs.mkdir('reports',{recursive:true});
const r=spawnSync(process.platform==='win32'?'npm.cmd':'npm',['audit','--json'],{encoding:'utf8',shell:process.platform==='win32'});
let report;try{report=JSON.parse(r.stdout);}catch{throw Error('Could not retrieve npm audit. Check registry/network; do not assume there are no vulnerabilities.');}
if(!report.metadata?.vulnerabilities)throw Error('Audit did not return vulnerability counts.');
await fs.writeFile('reports/npm-audit.json',JSON.stringify(report,null,2));
const v=report.metadata.vulnerabilities;console.log('Current npm audit package counts:',v);
const text=`## Security status\n\nCurrent reported package counts: high **${v.high||0}**, critical **${v.critical||0}**, moderate **${v.moderate||0}**.\n\nThese are explicitly acknowledged internal test builds, NOT security-reviewed production releases. See SECURITY.md and the audit artifact. No automatic force/downgrade is applied.\n`;
await fs.writeFile('reports/SECURITY-STATUS.md',text);
if(process.env.GITHUB_STEP_SUMMARY)await fs.appendFile(process.env.GITHUB_STEP_SUMMARY,text);
