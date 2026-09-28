import {readFileSync, writeFileSync, renameSync, mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {randomBytes, createHmac, timingSafeEqual, scryptSync} from 'node:crypto';
const dir = join(process.cwd(), 'data');
mkdirSync(dir,{recursive:true});
const keyFile=join(dir,'session-key');
let key:string;
try { key=readFileSync(keyFile,'utf8'); } catch { key=randomBytes(32).toString('hex');writeFileSync(keyFile,key,{mode:0o600}); }
export function validPassword(value:string) { const expected=process.env.PYPATH_PASSWORD_HASH; if(!expected)return false; const actual=scryptSync(value,'pypath-local-v1',32).toString('hex'); return expected.length===actual.length&&timingSafeEqual(Buffer.from(expected),Buffer.from(actual)); }
export function token() { const expiry=String(Date.now()+7*86400000);return expiry+'.'+createHmac('sha256',key).update(expiry).digest('hex'); }
export function authenticated(req:Request) { const t=req.headers.get('cookie')?.split('; ').find(x=>x.startsWith('pypath_session='))?.slice(15); if(!t)return false; const [expiry,sig]=t.split('.');const expected=createHmac('sha256',key).update(expiry).digest('hex');return Number(expiry)>Date.now()&&sig?.length===expected.length&&timingSafeEqual(Buffer.from(sig),Buffer.from(expected)); }
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export type State={current:string; checks:Record<string,boolean>; revisions:Record<string,{added:string;reviewed?:string}>};
export function readState():State {try{return JSON.parse(readFileSync(join(dir,'progress.json'),'utf8'));}catch(e){if((e as NodeJS.ErrnoException).code!=='ENOENT')throw e;return {current:'getting-started',checks:{},revisions:{}};} }
export function saveState(state:State){const tmp=join(dir,'progress.tmp');writeFileSync(tmp,JSON.stringify(state,null,2));renameSync(tmp,join(dir,'progress.json'));}
