import {authenticated,sameOrigin,readState,saveState} from '@/lib/store';
import {chapters,topics} from '@/content/roadmap';
import notes from '@/content/notes.json';

export async function GET(req:Request){
 if(!authenticated(req))return new Response('Unauthorized',{status:401});
 try{return Response.json({chapters,topics,state:await readState(),notes},{headers:{'Cache-Control':'no-store'}});}catch{return Response.json({error:'Could not load your notebook. Please retry.'},{status:500});}
}

export async function PATCH(req:Request){
 if(!authenticated(req))return new Response('Unauthorized',{status:401});if(!sameOrigin(req))return new Response('Forbidden',{status:403});
 const b=await req.json().catch(()=>null) as {topic?:string;action?:string;key:string;value?:boolean}|null;const topic=topics.find(t=>t.id===b?.topic);if(!topic||!b)return Response.json({error:'Unknown topic'},{status:400});
 try{const s=await readState();
 if(b.action==='current')s.current=topic.id;
 else if(b.action==='check'&&typeof b.value==='boolean'&&(['understand','notes','practice',...topic.subtopics.map((_,i)=>String(i))].includes(b.key)))s.checks[`${topic.id}:${b.key}`]=b.value;
 else if(b.action==='revise')s.revisions[topic.id]={added:new Date().toISOString()};
 else if(b.action==='review'&&s.revisions[topic.id])s.revisions[topic.id].reviewed=new Date().toISOString();
 else if(b.action==='remove')delete s.revisions[topic.id];
 else return Response.json({error:'Invalid update'},{status:400});
 await saveState(s);return Response.json(s);
 }catch{return Response.json({error:'Could not save your progress. Please try again.'},{status:500});}
}
