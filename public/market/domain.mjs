import {places} from './places.mjs';
export {places};
export const brand='LetMallow', feedback='https://tally.so/r/8NzzzY', canonical='https://cws-demo-letmallow-alpha.hollowcarat.chatgpt.site';
export const label=p=>p.id==='anglesey'?'Anglesey':p.place;
export const normalise=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
export function findPlace(text){
  const q=' '+normalise(text)+' '; const names={cardiff:['caerdydd'],anglesey:['ynys mon','anglesey','holyhead','caergybi']};
  return places.find(p=>[normalise(label(p)),...(names[p.id]||[])].some(n=>q.includes(' '+n+' ')));
}
export const money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
export const date=n=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'2-digit',month:'2-digit',year:'numeric'}).format(n*1000);
export const kindNames={any:'All properties',room:'Rooms',flat:'Flats',house:'Houses',wanted:'Wanted adverts'};
export const billsText = {
  Included: 'Bills included',
  Excluded: 'Bills excluded',
  'Part included': 'Some bills included',
  'To confirm': 'Bills to confirm',
};
export const advertStates = { pending: 'Pending review', live: 'Published', rejected: 'Removed from publication', expired: 'Expired' };
export function match(a,f){
 const query=normalise(f.area),p=findPlace(f.area);
 return Boolean((!query||normalise(a.area).includes(query)||normalise(a.nation)===query||(p&&findPlace(a.area)?.id===p.id))&&(f.kind==='any'?a.kind!=='wanted':a.kind===f.kind)&&(!f.max||a.rent<=f.max));
}
export const contactQuestions=['Is this still available?','Can I arrange a viewing?','Which bills are included?','Are you still looking for a home?'];
export const contactReplies=['Yes, still available.','Please see the advert for viewing details.','Please see the bills information in the advert.','This advert is now closed.'];
export const plans={renter:{name:'Renter Plus',amount:600},landlord:{name:'Landlord Plus',amount:1200},extra:{name:'Extra advert',amount:300}};
export const limits=(role,plus)=>role==='landlord'?{ads:plus?5:1,analytics:plus}:{responses:plus?30:3,wanted:plus?3:1,early:plus};
