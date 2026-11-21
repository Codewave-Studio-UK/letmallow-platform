import {findPlace, label, normalise} from './domain.mjs';

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
