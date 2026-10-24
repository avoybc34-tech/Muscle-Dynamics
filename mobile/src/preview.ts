// OFFLINE DESIGN DATA ONLY. Never connects to a server or processes real money.
import type {Snapshot, Config, Plan, Account, Payment, GymClass} from './types';
export const previewConfig:Config={gymName:'Muscle Dynamics',registrationOpen:true,phone:'Not configured — preview only',email:'preview@example.invalid',address:'Sample gym — not a real location',privacyText:'Design preview only. No account is created and no information leaves this offline app.',termsText:'Sample screens, not membership terms. No payment or actual gym access is provided.',nutritionText:'Sample nutrition panel. Add your gym-approved information later.'};
export const previewPlans:Plan[]=[{id:'sample-month',name:'Sample Monthly',slug:'sample-month',tagline:'A sample plan for layout review',pricePaise:500000,durationDays:30,features:['Sample gym access','Sample class schedule','Preview member space'],highlight:true},{id:'sample-quarter',name:'Sample Quarterly',slug:'sample-quarter',tagline:'Example content — not a published offer',pricePaise:1350000,durationDays:90,features:['Sample extended membership','Preview progress tracking'],highlight:false}];
const account:Account={id:'sample-cash',label:'Sample cash counter — NO PAYMENT',type:'CASH',bankName:'',accountName:'SAMPLE ONLY',accountNumber:'',iban:'',note:'Do not pay or transfer anything. Offline design preview only.'};
const iso=(days:number)=>new Date(Date.now()+days*86400000).toISOString();
const copy=<T,>(value:T):T=>JSON.parse(JSON.stringify(value));
export function createPreviewStore(){
 let serial=0;
 const classes:GymClass[]=[{id:'sample-strength',title:'Sample Strength Session',startsAt:iso(1),endsAt:new Date(Date.now()+86400000+3600000).toISOString(),capacity:12,trainer:{name:'Sample trainer'},_count:{bookings:4}},{id:'sample-mobility',title:'Sample Mobility Class',startsAt:iso(2),endsAt:new Date(Date.now()+2*86400000+3600000).toISOString(),capacity:16,trainer:{name:'Preview instructor'},_count:{bookings:6}}];
 let state:Snapshot={user:{id:'preview-member',name:'Preview Member',email:'preview@example.invalid',phone:'Sample phone',role:'MEMBER'},membership:{planId:previewPlans[0].id,planName:previewPlans[0].name,status:'ACTIVE',startsAt:iso(-12),endsAt:iso(18)},payments:[{id:'sample-payment',reference:'SAMPLE-ONLY-001',planName:previewPlans[0].name,amountPaise:previewPlans[0].pricePaise,status:'APPROVED',accountSnapshot:account,proofId:null,proofNote:'Illustrative record. No money was paid.',adminNote:'Sample approval, not a real transaction.',createdAt:iso(-12),submittedAt:iso(-12),reviewedAt:iso(-12)}],progress:[{id:'sample-progress',weight:72,waist:82,workouts:3,calories:2100,notes:'Sample measurements for layout review',createdAt:iso(-1)}],notifications:[{id:'sample-note',title:'Welcome to design preview',message:'All data is sample content. No API, login or real payment is connected.',readAt:null,createdAt:iso(-1)}],attendance:[{id:'sample-attendance',createdAt:iso(-1)},{id:'sample-attendance-2',createdAt:iso(-3)}],bookings:[],tickets:[{id:'sample-ticket',subject:'Sample support conversation',message:'This is a preview of the support layout.',reply:'Example reply — nobody is receiving these messages.',status:'RESOLVED',createdAt:iso(-2)}],announcements:[{id:'sample-announcement',title:'Offline design preview',message:'Explore the screens. Changes reset when the app restarts.'}]};
 state.payments[0].proofId='sample-receipt';
 state.payments.push({...copy(state.payments[0]),id:'sample-pending',reference:'SAMPLE-PENDING-002',status:'PENDING',reviewedAt:null,adminNote:'Sample waiting-for-review state only.'},{...copy(state.payments[0]),id:'sample-rejected',reference:'SAMPLE-REJECTED-003',status:'REJECTED',adminNote:'Sample rejection message for design review. No payment was made.'});
 const snapshot=()=>copy(state);
 async function request<T>(path:string,method='GET',body?:object|FormData):Promise<T>{
  const b=(body||{}) as Record<string,any>;
  let result:unknown;
  if(path==='dashboard')result=snapshot();
  else if(path==='plans')result=previewPlans;
  else if(path==='config')result=previewConfig;
  else if(path==='payment-options')result={accounts:[account],instructions:'SAMPLE ONLY. No payment should be made. Preview buttons only change in-memory sample data.'};
  else if(path==='classes')result=classes;
  else if(path==='payments' && method==='POST'){
   const plan=previewPlans.find(p=>p.id===b.planId)||previewPlans[0];
   const p:Payment={id:'preview-draft-'+(++serial),reference:'SAMPLE-DRAFT-'+serial,planName:plan.name,amountPaise:plan.pricePaise,status:'DRAFT',accountSnapshot:account,proofId:null,proofNote:'',adminNote:'',createdAt:iso(0),submittedAt:null,reviewedAt:null};state.payments.unshift(p);result=p;
  }else if(/^payments\/[^/]+\/(proof|submit)$/.test(path)){
   const [,id,action]=path.split('/');const p=state.payments.find(p=>p.id===id);if(!p)throw Error('Sample payment not found.');
   if(action==='proof')p.proofId='sample-receipt';else{p.status='PENDING';p.proofNote=String(b.proofNote||'Sample receipt');p.submittedAt=iso(0);}result=p;
  }else if(path==='progress' && method==='POST'){
   state.progress.unshift({id:'preview-progress-'+(++serial),weight:b.weight==null?null:Number(b.weight),waist:b.waist==null?null:Number(b.waist),workouts:Number(b.workouts||0),calories:Number(b.calories||0),notes:String(b.notes||''),createdAt:iso(0)});result={ok:true};
  }else if(/^classes\/[^/]+\/book$/.test(path)){
   const c=classes.find(c=>c.id===path.split('/')[1]);if(!c)throw Error('Sample class not found.');
   if(!state.bookings.some(x=>x.classId===c.id)){c._count.bookings++;state.bookings.push({id:'sample-booking-'+(++serial),classId:c.id,gymClass:copy(c)});}result={ok:true};
  }else if(path.startsWith('bookings/') && method==='DELETE'){
   const booking=state.bookings.find(x=>x.id===path.split('/')[1]);if(booking){const c=classes.find(c=>c.id===booking.classId);if(c)c._count.bookings--;state.bookings=state.bookings.filter(x=>x.id!==booking.id);}result={ok:true};
  }else if(path==='notifications/read'){
   const ids=Array.isArray(b.ids)?b.ids:[];state.notifications.forEach(n=>{if(ids.includes(n.id))n.readAt=iso(0);});result={ok:true};
  }else if(path==='support' && method==='POST'){
   state.tickets.unshift({id:'sample-ticket-'+(++serial),subject:String(b.subject||''),message:String(b.message||''),reply:'',status:'OPEN',createdAt:iso(0)});result={ok:true};
  }else if(path==='profile'){
   state.user={...state.user,name:String(b.name||state.user.name),phone:String(b.phone||state.user.phone)};result=state.user;
  }else if(path==='password')throw Error('Preview only: no password exists or can be changed. Do not enter real credentials.');
  else throw Error('This action is not connected in the offline preview.');
  return copy(result) as T;
 }
 return {snapshot,request};
}
