import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../chatgpt-auth';
import {handle} from '../../../market/api.mjs';
import {marketStore} from '../../../market/store.mjs';
export const dynamic='force-dynamic';
async function route(req:Request) {
  const config=env as unknown as Record<string,string>;
  try {
    const person=await getChatGPTUser();
    const db=marketStore(config,env.DB);
    return handle(req,{user:person?{id:person.userId,email:person.email}:null,db,env:config});
  } catch {return Response.json({error:'Marketplace unavailable.'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
export {route as GET,route as POST};
