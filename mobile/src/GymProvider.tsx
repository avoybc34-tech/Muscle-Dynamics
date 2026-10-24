import React,{createContext,useContext,useRef,useState} from 'react';
import {createPreviewStore,previewConfig} from './preview';
import type {User,Snapshot,Screen,Plan,Payment} from './types';
function useGymModel(){
 const store=useRef<ReturnType<typeof createPreviewStore>|null>(null);
 if(!store.current)store.current=createPreviewStore();
 const [data,setData]=useState<Snapshot>(store.current.snapshot());
 const [user,setUser]=useState<User|null>(data.user);
 const [screen,setScreen]=useState<Screen>('home');
 const [selectedPlan,setSelectedPlan]=useState<Plan|null>(null);
 const [payment,setPayment]=useState<Payment|null>(null);
 async function api<T>(path:string,method='GET',body?:object|FormData):Promise<T>{return store.current!.request<T>(path,method,body);}
 async function refresh(){const d=store.current!.snapshot();setData(d);setUser(d.user);return d;}
 async function connect(_value=''){store.current=createPreviewStore();await refresh();setPayment(null);setSelectedPlan(null);setScreen('home');}
 async function signIn(path:string,_body:object){await refresh();setScreen(path==='register'?'plans':'home');}
 async function logout(){setUser(null);setPayment(null);setSelectedPlan(null);setScreen('welcome');}
 return {server:'',token:null as string|null,user,data,config:previewConfig,screen,setScreen,loading:false,selectedPlan,setSelectedPlan,payment,setPayment,api,connect,signIn,refresh,logout,setUser,preview:true};
}
const Context=createContext<ReturnType<typeof useGymModel>|null>(null);
export function GymProvider({children}:{children:React.ReactNode}){return <Context.Provider value={useGymModel()}>{children}</Context.Provider>;}
export function useGym(){const gym=useContext(Context);if(!gym)throw Error('Gym provider missing');return gym;}
