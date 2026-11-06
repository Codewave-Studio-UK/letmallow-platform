export function d1Store(binding){
 if(!binding)throw Error('Database binding is unavailable');
 const stmt=(q,p)=>binding.prepare(q).bind(...p);
 return {rows:async(q,p=[]) => (await stmt(q,p).all()).results,
         run:async(q,p=[]) => (await stmt(q,p).run()).meta.changes,
         batch:items => binding.batch(items.map(([q,p])=>stmt(q,p)))};
}
// Parameterised Neon SQL-over-HTTP. Switch explicitly after migrating and reconciling data.
export function neonStore(connection,send=fetch){
 const u=new URL(connection);
 if(!['postgresql:','postgres:'].includes(u.protocol)||!u.hostname.endsWith('.neon.tech')||!u.password)throw Error('Invalid Neon endpoint');
 const endpoint='https://'+u.hostname.replace(/^[^.]+\./,'api.')+'/sql';
 const shaped=(q,p)=>{let i=0;return {query:q.replace(/\?/g,()=>'$'+(++i)),params:p};};
 const post=async(body)=>{
  const res=await send(endpoint,{method:'POST',headers:{'Content-Type':'application/json','Neon-Connection-String':connection,'Neon-Array-Mode':'false','Neon-Raw-Text-Output':'false'},body:JSON.stringify(body)});
  if(!res.ok)throw Error('Neon query failed');
  return res.json();
 };
 return {rows:async(q,p=[]) => (await post(shaped(q,p))).rows,
         run:async(q,p=[]) => Number((await post(shaped(q,p))).rowCount),
         batch:items=>post({queries:items.map(([q,p])=>shaped(q,p))})};
}
