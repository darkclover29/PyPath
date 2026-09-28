import {authenticated,sameOrigin,validPassword,token} from '@/lib/store';
const attempts=new Map<string,{count:number;until:number}>();
export async function GET(req:Request){return Response.json({authenticated:authenticated(req)},{headers:{'Cache-Control':'no-store'}});}
export async function POST(req:Request){
 if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const a=attempts.get('local');if(a&&a.until>Date.now()&&a.count>=10)return Response.json({error:'Too many attempts. Try again in five minutes.'},{status:429});
 const body=await req.json().catch(()=>null) as {password?:unknown}|null;if(typeof body?.password!=='string'||body.password.length>200||!validPassword(body.password)){attempts.set('local',{count:a&&a.until>Date.now()?a.count+1:1,until:a&&a.until>Date.now()?a.until:Date.now()+300000});return Response.json({error:'That password doesn’t match. Please try again.'},{status:401});}
 attempts.delete('local');return Response.json({ok:true},{headers:{'Set-Cookie':`pypath_session=${token()}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${new URL(req.url).protocol==='https:'?'; Secure':''}`}});
}
export async function DELETE(req:Request){if(!sameOrigin(req))return new Response('Forbidden',{status:403});return Response.json({ok:true},{headers:{'Set-Cookie':'pypath_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0'}});}

