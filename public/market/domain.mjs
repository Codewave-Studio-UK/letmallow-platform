import {places} from './places.mjs';
export {places};
export const brand='LetMallow', feedback='https://tally.so/r/8NzzzY', canonical='https://codewave-rental-alpha.hollowcarat.chatgpt.site';
export const label=p=>p.id==='anglesey'?'Anglesey':p.place;
export const normalise=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
export function findPlace(text){
  const q=' '+normalise(text)+' '; const names={cardiff:['caerdydd'],anglesey:['ynys mon','anglesey','holyhead','caergybi']};
  return places.find(p=>[normalise(label(p)),...(names[p.id]||[])].some(n=>q.includes(' '+n+' ')));
}
export const money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
export const date=n=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'2-digit',month:'2-digit',year:'numeric'}).format(n*1000);
export const kindNames={any:'All properties',room:'Rooms',flat:'Flats',house:'Houses',wanted:'Wanted ads'};
export const modelExamples={
 room:['a double room','a room in a shared house','flatshare','share with housemates','a bedroom in a shared flat','a room with flatmates','single room to rent','a lodger room','house share','flat share'],
 flat:['a studio flat','self contained apartment','entire flat','a flat to myself','one bedroom apartment','a maisonette','two bedroom flat','self contained studio'],
 house:['a terraced house','detached property','a house with a garden','entire house','whole townhouse','family bungalow','standalone cottage','semi detached home'],
};
const tokens=t=>normalise(t).split(' ').filter(w=>w&&!['a','the','in','with','to','for','my','of','i'].includes(w));
const vocabulary=new Set(), model={};
for(const [label,examples] of Object.entries(modelExamples)){
  const counts=new Map();let total=0;
  for(const e of examples)for(const word of tokens(e)){counts.set(word,(counts.get(word)||0)+1);vocabulary.add(word);total++;}
  model[label]={counts,total};
}
export function inferType(text){
 const words=tokens(text).filter(w=>vocabulary.has(w));
 if(!words.length)return 'any';
 const ranked=Object.entries(model).map(([k,m])=>[k,words.reduce((s,w)=>s+Math.log(((m.counts.get(w)||0)+1)/(m.total+vocabulary.size)),0)]).sort((a,b)=>b[1]-a[1]);
 return ranked[0][1]-ranked[1][1]>.45?ranked[0][0]:'any';
}
export function interpret(text){
 const place=findPlace(text);
 const loc=String(text).match(/\b(?:in|near)\s+([\p{L}][\p{L}\s'-]{1,60}?)(?=\s+(?:under|below|up to|for|with|at|within|budget|without|less than)\b|[,.!?£]|$)/iu);
 const b=String(text).match(/(?:under|up to|max(?:imum)?|below|budget(?: of)?|less than|£)\s*£?\s*([\d,]+(?:\.\d+)?)\s*(k\b)?\s*(pcm|pw|per week|a week|weekly)?/i);
 let max=b?Number(b[1].replaceAll(',',''))*(b[2]?1000:1):0;
 if(/pw|week/i.test(b?.[3]||'')) max*=52/12;
 return {area:place?label(place):(loc?.[1]?.trim()||''),kind:inferType(text),max:max>0&&max<=100000?Math.round(max):0};
}
export function match(a,f){
 const query=normalise(f.area),p=findPlace(f.area);
 return Boolean((!query||normalise(a.area).includes(query)||normalise(a.nation)===query||(p&&findPlace(a.area)?.id===p.id))&&(f.kind==='any'?a.kind!=='wanted':a.kind===f.kind)&&(!f.max||a.rent<=f.max));
}
export const contactQuestions=['Is this still available?','Can I arrange a viewing?','Which bills are included?','Are you still looking for a home?'];
export const contactReplies=['Yes, still available.','Please see the advert for viewing details.','Please see the bills information in the advert.','This advert is now closed.'];
export const plans={renter:{name:'Renter Plus',amount:600},landlord:{name:'Landlord Plus',amount:1200},extra:{name:'Extra advert',amount:300}};
export const limits=(role,plus)=>role==='landlord'?{ads:plus?5:1,analytics:plus}:{responses:plus?30:3,wanted:plus?3:1,early:plus};
