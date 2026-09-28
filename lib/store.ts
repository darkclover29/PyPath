import { env } from 'cloudflare:workers';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';

export type State={current:string;checks:Record<string,boolean>;revisions:Record<string,{added:string;reviewed?:string}>};
const initialState=():State=>({current:'getting-started',checks:{},revisions:{}});

function database(){
 if(!env.DB)throw new Error('Cloudflare D1 is not configured.');
 return env.DB;
}

function secret(name:'PYPATH_PASSWORD_HASH'|'PYPATH_SESSION_SECRET'){
 const value=env[name];
 if(typeof value!=='string'||!value)return null;
 return value;
}

export function validPassword(value:string){
 const expected=secret('PYPATH_PASSWORD_HASH');
 if(!expected)return false;
 const actual=scryptSync(value,'pypath-local-v1',32).toString('hex');
 return expected.length===actual.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(actual));
}

export function token(){
 const signingKey=secret('PYPATH_SESSION_SECRET');
 if(!signingKey)throw new Error('Cloudflare session secret is not configured.');
 const expiry=String(Date.now()+7*86400000);
 return expiry+'.'+createHmac('sha256',signingKey).update(expiry).digest('hex');
}

export function authenticated(req:Request){
 const signingKey=secret('PYPATH_SESSION_SECRET');
 const value=req.headers.get('cookie')?.split('; ').find(x=>x.startsWith('pypath_session='))?.slice(15);
 if(!signingKey||!value)return false;
 const [expiry,sig]=value.split('.');
 const expected=createHmac('sha256',signingKey).update(expiry).digest('hex');
 return Number(expiry)>Date.now()&&sig?.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected));
}

export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}

export async function readState():Promise<State>{
 const row=await database().prepare('SELECT state_json FROM pypath_state WHERE id = 1').first<{state_json:string}>();
 if(!row)return initialState();
 try{return JSON.parse(row.state_json) as State;}catch{return initialState();}
}

export async function saveState(state:State){
 await database().prepare('INSERT INTO pypath_state (id, state_json, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET state_json = excluded.state_json, updated_at = CURRENT_TIMESTAMP').bind(JSON.stringify(state)).run();
}
