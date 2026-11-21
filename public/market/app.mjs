import {places,label,brand,feedback,canonical,money,billsText,advertStates,kindNames,findPlace,interpret,match,contactQuestions,contactReplies,plans,limits} from './domain.mjs';
import {e,icon,card,hero,landing,searchForm,dateMarkup} from './shell.mjs';
import {requestMarketplace as api} from './client-api.mjs';
const main=document.querySelector('#content'),dialog=document.querySelector('#panel'),panel=document.querySelector('#panel-body'),notice=document.querySelector('#notice');
const mirror=document.querySelector('meta[name=rental-host]')?.content==='netlify';
const state={ads:[],adsLoading:true,loadError:false,view:'home',sessionLoading:!mirror,sessionError:false,session:{signedIn:false,reviewer:false,stripe:false},role:'renter',coupon:null,paidPasses:[]};
const store={read(k,alt){try{return JSON.parse(localStorage.getItem('lm-'+k))??alt;}catch{return alt;}},write(k,v){try{localStorage.setItem('lm-'+k,JSON.stringify(v));return true;}catch{return false;}}};
let saved=store.read('places',[]);if(!Array.isArray(saved))saved=[];
const say=s=>{notice.textContent=s;clearTimeout(say.timer);say.timer=setTimeout(()=>{notice.textContent='';},3700);};
function modal(title,content){panel.innerHTML='<h2 id="dialog-title">'+e(title)+'</h2>'+content+'<p class="error" id="modal-error" role="alert"></p>';if(!dialog.open)dialog.showModal();}
function leave(){if(dialog.open)dialog.close();}
const heroImages = {
  wanted: { src: '/market/photos/olive-lounge.webp', width: 1280, height: 854, position: '65% 57%', mobilePosition: '67% 50%' },
  plans: { src: '/market/photos/daylight-lounge.webp', width: 1280, height: 853, position: '50% 56%' },
  post: { src: '/market/photos/garden-double.webp', width: 1280, height: 853, position: '63% 52%' },
};

function placeHeroImage(place) {
  if (!place) return;
  return {
    src: '/market/places/' + place.image, width: 800, height: 600,
    position: place.id === 'anglesey' ? '50% 63%' : '50% 55%',
  };
}

function heading(title, description, image) {
  return hero({ title, description, image, action: { label: 'Explore', view: 'home' } });
}
const opts=(list,current='')=>list.map(s=>'<option '+(s===current?'selected':'')+'>'+e(s)+'</option>').join('');
const external=(url,title)=>'<a class="btn outline small" target="_blank" rel="noopener noreferrer" href="'+e(url)+'">'+e(title)+' '+icon('external',16)+'</a>';
const fm=el=>Object.fromEntries(new FormData(el));
const buttons=(id,field,text,cls='outline')=>'<button class="btn '+cls+'" '+field+'="'+e(id)+'">'+e(text)+'</button>';
async function loadSession(){
 if(mirror)return;
 state.sessionLoading=true;
 try{state.session=await api('session');state.sessionError=false;}
 catch{state.sessionError=true;state.session={signedIn:false,reviewer:false,stripe:false};}
 finally{state.sessionLoading=false;}
}
async function loadAds(){state.adsLoading=true;try{const r=await api('homes');if(!Array.isArray(r.ads))throw Error();state.ads=r.ads;state.loadError=false;}catch{state.loadError=true;}finally{state.adsLoading=false;}}
function sessionNotice(){
 if(state.sessionLoading)return '<p class="empty" role="status">Checking your account…</p>';
 if(state.sessionError)return '<p class="empty" role="alert">We couldn’t check if you’re signed in. <button class="link-button" data-refresh>Try again</button></p>';
 return '';
}
const urlFor=(view,filters={})=>{const p=new URLSearchParams();if(view!=='home')p.set('view',view);for(const [k,v]of Object.entries(filters))if(v&&v!=='any')p.set(k,String(v));return '/'+(p.size?'?'+p:'');};
function go(view,filters={},push=true){leave();if(push)history.pushState({},'',urlFor(view,filters));render();if(push){window.scrollTo(0,0);main.focus({preventScroll:true});}}
function reflectSaved(){document.querySelectorAll('[data-save]').forEach(b=>{const on=saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(on));const p=places.find(x=>x.id===b.dataset.save);b.setAttribute('aria-label',(on?'Remove ':'Save ')+(p?label(p):'location')+(on?' from saved areas':''));});}
function filters(){const p=new URLSearchParams(location.search);return {area:(p.get('area')||'').slice(0,80),kind:Object.hasOwn(kindNames,p.get('kind'))?p.get('kind'):'any',max:Math.min(100000,Math.max(0,Number(p.get('max'))||0))};}
function setFields(f){const form=document.querySelector('#search-form');if(!form)return;form.elements.area.value=f.area;form.elements.kind.value=f.kind;if(f.max&&!Array.from(form.elements.max.options).some(o=>+o.value===f.max))form.elements.max.add(new Option('Up to '+money(f.max),String(f.max)));form.elements.max.value=f.max?String(f.max):'';}
function providerRows(f){
 if(f.kind==='wanted')return '<div class="box"><h3>Find people looking for a room</h3><p>Choose “Rooms wanted” on SpareRoom and enter the area you want to search.</p><div class="actions">'+external('https://www.spareroom.co.uk/flatshare/search.pl','Search on SpareRoom')+'</div></div>';
 const p=findPlace(f.area);
 if(!p)return '<div class="item"><div><h3>Search on rental websites</h3><p>Enter '+(f.area?'<b>'+e(f.area)+'</b>':'your town, island or postcode')+' on the rental website. You can set your budget there.</p></div><div class="actions">'+external('https://www.spareroom.co.uk/flatshare/search.pl','Find rooms on SpareRoom')+external('https://www.openrent.co.uk/','Find homes on OpenRent')+'</div></div>';
 const types=f.kind==='room'?['rooms']:f.kind==='flat'?['flats']:f.kind==='house'?['houses']:['rooms','flats','houses'];
 return types.map(k=>'<div class="item"><div><small class="eyebrow">'+e(p[k].provider)+'</small><h3>'+({rooms:'Rooms',flats:'Flats',houses:'Houses'}[k])+' in '+e(label(p))+'</h3><p>Browse current adverts on '+e(p[k].provider)+(p.id==='anglesey'?' in and around Anglesey':'')+'.</p></div>'+external(p[k].url,'View adverts')+'</div>').join('');
}
function adRows(ads){if(state.adsLoading)return '<div class="empty" role="status">Loading community adverts…</div>';
 if(state.loadError)return '<div class="empty" role="alert">We couldn’t load community adverts. You can still search other rental websites. <button class="link-button" data-refresh>Try again</button></div>';
 return ads.length?ads.map(a=>'<div class="item"><div><small class="eyebrow">'+icon('pin',16)+' '+e(a.nation)+' · '+e(a.area)+'</small><h3>'+e(a.title)+'</h3><p>'+(a.kind==='wanted'?'Budget of ':'')+money(a.rent)+' a month · '+e(billsText[a.bills]||'Bills to confirm')+'</p></div>'+buttons(a.id,'data-ad','View advert')+'</div>').join(''):'<div class="empty">No community adverts match your search yet. Try another rental website or post an advert.</div>';}
function resultPage(view){
 const f=filters();if(view==='wanted')f.kind='wanted';
 if(view==='community')return heading('Community adverts','We review adverts before they appear on LetMallow.',placeHeroImage(findPlace('Bristol')))+'<div class="rows">'+adRows(state.ads)+'</div><button class="btn primary" data-nav="post">Post an advert</button>';
 const display=view==='wanted'?'Wanted adverts':f.area?'Rentals in '+f.area:'Find homes to rent';
 return heading(display,view==='wanted'?'Find people looking for a room, flat or house.':'Browse community adverts or search other rental websites.',f.kind==='wanted'?heroImages.wanted:placeHeroImage(findPlace(f.area)))+searchForm()+'<h2 class="results-head">Search other rental websites</h2><p class="muted">Set your budget on the rental website and ask the advertiser if the home is still available.</p><div class="rows">'+providerRows(f)+'</div><h2 class="results-head">Community adverts</h2><div class="rows">'+adRows(state.ads.filter(a=>match(a,f)))+'</div>';
}
function safePlanState(role){const d=store.read('sim-'+role,{});const verified=state.paidPasses.filter(x=>x.expires>Date.now()/1000);return {plus:!!d.plus||verified.some(x=>x.product===role),used:Math.max(0,Number(d.used)||0),extra:Math.max(verified.some(x=>x.product==='extra')?1:0,Math.min(1,Number(d.extra)||0)),early:!!d.early,wanted:Math.max(0,Number(d.wanted)||0)};}
function planPage(){
 const role=state.role,l=role==='landlord',s=safePlanState(role),max=limits(role,s.plus),free=l?['1 active advert','Manage your advert','Receive enquiries']:['3 replies to test adverts every 30 days','1 wanted advert for 30 days','Search and save areas'];
 const plus=l?['5 active adverts','See how many replies each advert gets','Try an extra advert separately']:['30 replies to test adverts every 30 days','Reply to test adverts before they open to everyone','3 wanted adverts for 30 days'];
 return heading('Membership plans','Posting and sending enquiries are free during alpha. Try the proposed 30-day plans below.',heroImages.plans)+'<div class="role-tabs" aria-label="Choose renter or landlord"><button data-role="renter" aria-pressed="'+!l+'">Renter</button><button data-role="landlord" aria-pressed="'+l+'">Landlord</button></div><div class="split">'+[['Free',0,free,false],[plans[role].name,plans[role].amount/100,plus,true]].map(([t,n,items,isPlus])=>'<article class="box plan"><h3>'+t+'</h3><b>'+money(n)+' <small class="muted">'+(n?'for 30 days in test mode':'')+'</small></b><ul>'+items.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="actions"><button class="btn '+(isPlus?'primary':'outline')+'" data-sim="'+(isPlus?'plus':'free')+'">Try '+(isPlus?t:'the free plan')+'</button></div></article>').join('')+'</div><h2 class="results-head">Try a plan</h2><div class="box stack"><b>'+e(s.plus?plans[role].name:'Free')+' test plan</b><p>'+ (l?'Adverts posted: '+s.used+' of '+(max.ads+s.extra)+'.':s.used+' of '+max.responses+' test replies used. Wanted adverts: '+s.wanted+' of '+max.wanted+'.')+'</p><div class="actions">'+(l?'<button class="btn outline small" data-sim="use">Post test advert</button><button class="btn outline small" data-sim="extra">Try one extra advert (£3)</button>':'<button class="btn outline small" data-sim="use">Reply to a test advert</button><button class="btn outline small" data-sim="early">Try early access</button><button class="btn outline small" data-sim="wanted">Post test wanted advert</button>')+'<button class="link-button" data-sim="reset">Reset</button></div>'+(l&&s.plus?'<p>'+s.used+(s.used===1?' advert':' adverts')+' posted in this test.</p>':'')+'</div><div class="box stack payment-box"><h3>Stripe test checkout</h3><p>'+(mirror?'Open LetMallow to see whether Stripe test checkout is available.':state.sessionLoading?'Checking test checkout availability…':state.sessionError?'We couldn’t check whether Stripe test checkout is available. Reload the page to try again.':state.session.stripe?'Use Stripe test card details. You won’t be charged.':'Stripe test checkout is unavailable. You can still try the plans above without entering payment details.')+'</p>'+(mirror?'<p><a class="btn outline" target="_top" href="'+canonical+'/?view=plans">Continue to LetMallow</a></p>':state.session.stripe?'<div class="actions"><button class="btn outline" data-pay="'+role+'">Open Stripe test checkout</button>'+(l?'<button class="btn outline" data-pay="extra">Test extra advert</button>':'')+'</div>':'')+'</div>';
}
function privacy(){return heading('Privacy and safety','Codewave Studio operates the LetMallow alpha for residential rentals in England and Wales.')+`<div class="stack"><section class="box"><h3>Browsing and smart search</h3><p>LetMallow reads your search on your device. A standard search puts the town, home type and budget in the page URL. Avoid entering an address or personal circumstances. This browser stores your saved areas and plan choices. Open Saved areas to remove an area or reset the test plan on the Plans page.</p></section><section class="box"><h3>Adverts, enquiries and account data</h3><p>When you sign in, ChatGPT shares an account ID and email address. We use the ID to link your adverts and enquiries to your account and manage access. We use your email to check if you can review adverts. Advert text becomes public only after review. Only reviewers can see private evidence links. When replying, you can choose to share your sign-in email with that enquirer to arrange a viewing. To remove your email from their inbox, reply again and leave the box unticked. They may have already copied it. Use a town or island rather than an exact address.</p><p>We process account records to provide the service you request and carry out safety checks in the legitimate interests of users and the studio. Adverts are listed for up to 30 days from submission. Adverts disappear from public results as soon as they expire. When someone submits an advert, the service can remove adverts that expired more than 30 days ago and enquiries more than 60 days old. Withdrawing an advert removes it and its enquiries. You can delete your LetMallow records from your account.</p></section><section class="box"><h3>Providers and your choices</h3><p>ChatGPT Sites hosts your account and its current database. The Netlify site uses the same account service. Other rental websites run their own searches. Tally processes feedback or reports you choose to submit. Stripe receives a checkout request only when you use its connected test checkout. No advert text is sent to an AI provider.</p><p>For access, correction, removal, restriction, objection or questions about transfers and safeguards, contact Codewave Studio through the feedback form. You can also complain to the UK Information Commissioner. Avoid sending identity documents or bank details.</p><div class="actions">${external(feedback,'Contact the studio')}${external('https://ico.org.uk/make-a-complaint/','Complain to the ICO')}</div></section><section class="box"><h3>Report a concern</h3><p>Report suspicious adverts with their reference. The studio can remove an advert during investigation. Check that the advertiser has permission to let the home and view it before sending money. LetMallow does not collect rent, deposits or holding payments.</p>${external(feedback,'Report an advert')}</section></div>`;}
function reflectNav(view){document.querySelectorAll('header nav [data-nav], header .saved').forEach(b=>{const on=b.dataset.nav===view||(b.dataset.nav==='home'&&['areas','search','community'].includes(view));b.classList.toggle('current',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
let renderID=0;
function render(){
 const view=new URLSearchParams(location.search).get('view')||'home';state.view=view;const id=++renderID;let html='';
 if(['search','community','wanted'].includes(view))html=resultPage(view);
 else if(view==='areas'||view==='saved'){const all=view==='areas',arr=all?places:places.filter(p=>saved.includes(p.id));html=heading(all?'Explore all areas':'Saved areas',all?'Choose a location or enter any town or island in England and Wales.':'Find the areas you’ve saved on this device.',all?placeHeroImage(findPlace('Anglesey')):undefined)+(all?searchForm():'')+'<div class="grid area-grid">'+arr.map(card).join('')+'</div>'+(!arr.length?'<div class="empty">To save an area, select the heart next to it.</div>':'');}
 else if(view==='plans')html=planPage();
 else if(view==='privacy')html=privacy();
 else if(view==='advert')html=details(new URLSearchParams(location.search).get('id'));
 else if(view==='post')html=postPage();
 else if(view==='account'||view==='review'){html=heading(view==='review'?'Review adverts':'Your account')+(state.session.signedIn?'<p class="empty" role="status">Loading your account…</p>':signIn(view));if(state.session.signedIn)loadAccount(view,id);}
 else html=landing();
 main.innerHTML=html;reflectSaved();reflectNav(view);if(view==='search'||view==='wanted')setFields({...filters(),...(view==='wanted'?{kind:'wanted'}:{})});
}
function signIn(view){const pending=sessionNotice();if(pending)return pending;const path=urlFor(view);const destination=mirror?canonical+path:'/signin-with-chatgpt?return_to='+encodeURIComponent(path);
 return '<div class="box stack"><h3>'+(mirror?'Open your LetMallow account':'Sign in to your account')+'</h3><p>You can browse without an account. Sign in with ChatGPT to post or withdraw an advert, or to send and reply to enquiries.</p><div><a class="btn primary" target="_top" href="'+e(destination)+'">'+(mirror?'Continue to LetMallow':'Sign in with ChatGPT')+' '+icon('arrow',16)+'</a></div></div>';}
function postPage(){if(!state.session.signedIn)return heading('Post an advert','You can post one home advert and one wanted advert for free during alpha. Each advert lasts 30 days.',heroImages.post)+signIn('post');
 return heading('Post an advert','We review adverts before publishing them. Give the area and leave personal details out of your advert.',heroImages.post)+`<form id="ad-form" class="form entry"><div class="split"><label>Advert type<select name="kind"><option value="room">Room to rent</option><option value="flat">Flat to rent</option><option value="house">House to rent</option><option value="wanted">Room or home wanted</option></select></label><label>Country<select name="nation"><option>England</option><option>Wales</option></select></label></div><label>Town, neighbourhood or island<input required name="area" minlength="2" maxlength="80" placeholder="e.g. Beaumaris, Anglesey"></label><div class="split"><label>Monthly rent or budget (£)<input required type="number" min="1" max="100000" name="rent" inputmode="numeric"></label><label>Bills<select name="bills">${Object.entries(billsText).map(([value, text]) => `<option value="${e(value)}">${text}</option>`).join('')}</select></label></div><label>Advert title<input required name="title" minlength="5" maxlength="90" placeholder="e.g. Double room in central Cardiff"></label><label>Description<textarea required name="body" minlength="25" maxlength="1200" placeholder="Include the rent, bills, any deposit and the move-in date. If you’re looking for a home, describe what you need."></textarea></label><button class="link-button" type="button" data-draft>Draft a description ${icon('spark',16)}</button><label>Link to a public advert (optional)<input type="url" name="proof" maxlength="690" placeholder="https://"><span class="muted">SpareRoom, OpenRent, Rightmove, Zoopla or OnTheMarket. Only reviewers see this link. We may ask for more evidence before publishing.</span></label><label class="check"><input required type="checkbox" name="authority">I agree to LetMallow publishing this advert. I own the home, have permission to advertise it or am looking for a home. The information is accurate.</label><p class="muted">Every advert expires after 30 days. For homes in Wales, we check Rent Smart Wales registration and licensing, or an exemption where it applies. <button type="button" class="link-button" data-nav="privacy">Privacy and safety</button></p><button class="btn primary" type="submit">Submit for review</button><p class="error" role="alert"></p></form>`;}
async function loadAccount(view,id){
 try{const out=await api(view==='review'?'queue':'account');if(id!==renderID)return;
 if(view==='review'){
 main.innerHTML=heading('Review adverts','Check who can advertise the home, where it is and the rent and terms. For homes in Wales, check registration and licensing or any exemption that applies. Record the evidence before approving an advert.')+'<div class="rows">'+(out.ads.map(a=>'<div class="box stack"><h3>'+e(a.title)+'</h3><p>'+e(a.area)+' · '+e(a.nation)+' · '+money(a.rent)+' a month · '+e(billsText[a.bills]||'Bills to confirm')+'</p><p class="adtext">'+e(a.body)+'</p><p class="muted">Advert reference '+e(a.id)+' · '+e(advertStates[a.status]||'Status unavailable')+'</p>'+(a.proof?external(a.proof,'Private evidence link'):'<p>Ask for proof that the advertiser can let the home if you haven’t checked it yet.</p>')+'<div class="actions">'+(a.status==='live'?buttons(a.id,'data-unpublish','Unpublish'):buttons(a.id,'data-approve','Review for approval','primary')+buttons(a.id,'data-reject','Reject'))+'</div></div>').join('')||'<div class="empty">There are no adverts in the review queue.</div>')+'</div>';return;}
 const message=(m,canReply)=>'<div class="box stack"><h3>'+e(m.title)+'</h3><p>'+e(m.question)+'</p><b>'+e(m.answer||'Awaiting a reply')+'</b>'+(m.contact?(canReply?'<small>You shared your email with the person who sent this enquiry.</small>':'<p>Contact the advertiser at <a href="mailto:'+e(encodeURIComponent(m.contact))+'">'+e(m.contact)+'</a>.</p>'):'')+(canReply?buttons(m.id,'data-answer','Reply'):'')+'</div>';
 main.innerHTML=heading('Your account','Manage your adverts and see the enquiries you’ve sent and received.')+'<div class="actions"><button class="btn primary" data-nav="post">Post an advert</button>'+(out.reviewer?'<button class="btn outline" data-nav="review">Review adverts</button>':'')+'<a class="link-button" target="_top" href="/signout-with-chatgpt?return_to=%2F">'+icon('logOut',16)+' Sign out</a></div><h2 class="results-head">'+icon('home')+' Your adverts</h2><div class="rows">'+(out.ads.map(a=>'<div class="item"><div><small class="badge">'+e(advertStates[a.expires<=Date.now()/1000?'expired':a.status]||'Status unavailable')+'</small><h3>'+e(a.title)+'</h3><p>'+icon('calendar',16)+' Expires '+dateMarkup(a.expires)+' · '+e(a.area)+'</p></div>'+buttons(a.id,'data-withdraw','Withdraw')+'</div>').join('')||'<p class="empty">Adverts you submit will appear here.</p>')+'</div><h2 class="results-head">'+icon('message')+' Received enquiries</h2><div class="rows">'+(out.inbox.map(m=>message(m,true)).join('')||'<p class="empty">No enquiries yet.</p>')+'</div><h2 class="results-head">'+icon('send')+' Sent enquiries</h2><div class="rows">'+(out.sent.map(m=>message(m,false)).join('')||'<p class="empty">You haven’t sent any enquiries yet.</p>')+'</div>'+(out.passes.length?'<h2 class="results-head">'+icon('ticket')+' Stripe test passes</h2>'+out.passes.map(p=>'<p>'+e(plans[p.product]?.name)+' · Expires '+dateMarkup(p.expires)+'</p>').join(''):'')+'<button class="link-button" data-erase>Delete my LetMallow records</button>';
 }catch(err){if(id===renderID)main.innerHTML=heading(view==='review'?'Review adverts':'Your account')+'<div class="empty" role="alert">'+e(err.message)+' <button class="link-button" data-refresh>Try again</button></div>';}}
function details(id){
 if(state.adsLoading)return heading('Opening advert')+'<p class="empty" role="status">Loading the advert…</p>';
 if(state.loadError)return heading('We couldn’t load the advert')+adRows([]);
 const a=state.ads.find(x=>x.id===id);if(!a)return heading('Advert unavailable','This advert may have expired or been withdrawn.')+'<button class="btn outline" data-nav="community">Browse community adverts</button>';
 const dest=mirror?canonical+urlFor('advert',{id:a.id}):'/signin-with-chatgpt?return_to='+encodeURIComponent(urlFor('advert',{id:a.id}));
 return heading(a.title,a.area+' · '+a.nation)+'<div class="box stack advert-detail"><p class="ad-price">'+(a.kind==='wanted'?'Budget of ':'')+'<strong>'+money(a.rent)+'</strong> a month</p><p>'+e(billsText[a.bills]||'Bills to confirm')+' · Expires '+dateMarkup(a.expires)+'</p><p class="muted">'+icon('shield',16)+' Reviewed by LetMallow</p><p class="adtext">'+e(a.body)+'</p><small>Advert reference '+e(a.id)+'</small><div class="actions">'+(state.session.signedIn?buttons(a.id,'data-enquire','Send a free enquiry','primary'):'<a class="btn primary" target="_top" href="'+e(dest)+'">Sign in to enquire for free</a>')+external(feedback,'Report this advert')+'</div></div>';
}
function openSmart(){modal('Try smart search','<p>Tell us where you want to live, what kind of home you need and your monthly budget. You can change the suggested filters before you search again.</p><form class="form" id="smart-form"><label>What are you looking for?<textarea required name="query" maxlength="200" placeholder="A room in Cardiff for up to £750 a month"></textarea></label><div class="actions"><button type="button" class="link-button" data-example>Use an example</button></div><button class="btn primary">Suggest search filters</button></form>');}
function formAction(title,desc,op,data){
 modal(title,'<p>'+e(desc)+'</p><div class="actions dialog-actions"><button class="btn outline" data-close>Cancel</button><button class="btn primary" id="confirm-action">Confirm</button></div>');
 document.querySelector('#confirm-action').onclick=async ev=>{ev.currentTarget.disabled=true;try{await api(op,data);leave();await loadAds();go(op==='moderate'?'review':'account');say('Your change is saved.');}catch(err){panel.querySelector('.error').textContent=err.message;document.querySelector('#confirm-action').disabled=false;}};
}
function simulation(key){
 const s=safePlanState(state.role),l=state.role==='landlord',m=limits(state.role,s.plus);let msg='';
 if(key==='reset'){store.write('sim-'+state.role,{});render();say('Simulation reset.');return;}
 if(key==='plus'||key==='free'){s.plus=key==='plus';msg='Test plan selected.';}
 if(key==='extra'){s.extra=1;msg='You can now post one more test advert.';}
 if(key==='wanted'){if(s.wanted>=m.wanted){say('You’ve used all the wanted adverts on this test plan.');return;}s.wanted++;msg='Test wanted advert added for 30 days.';}
 if(key==='use'||key==='early'){
  if(key==='early'&&!m.early){say('Choose the Renter Plus test plan to try early access.');return;}
  if(s.used>=(l?m.ads+s.extra:m.responses)){say('You’ve reached the limit for this test plan. Reset it or try a different plan.');return;}
  s.used++;msg=l?'Test advert added.':'Test response recorded.';
 }
 store.write('sim-'+state.role,s);render();say(msg);
}
document.addEventListener('click',async ev=>{
 const b=ev.target.closest('button,[data-nav]');if(!b)return;const d=b.dataset;
 if('close' in d){leave();return;}
 if(d.nav){if(d.nav==='smart'){openSmart();return;}if(d.nav==='menu'){modal('Navigation','<div class="panel-menu">'+[['home','Explore'],['areas','All areas'],['wanted','Wanted adverts'],['post','Post an advert'],['saved','Saved areas'],['plans','Plans'],['account','Your account']].map(([k,v])=>'<button data-nav="'+k+'">'+v+'</button>').join('')+'</div>');return;}go(d.nav);return;}
 if(d.place){const p=places.find(x=>x.id===d.place);if(p)go('search',{area:label(p)});return;}
 if(d.save){const on=saved.includes(d.save);saved=on?saved.filter(x=>x!==d.save):[...saved,d.save];const persisted=store.write('places',saved);if(state.view==='saved')render();else reflectSaved();say((on?'Area removed.':'Area saved.')+(persisted?'':' This change lasts until you close the page.'));return;}
 if(d.role){state.role=d.role;render();return;}if(d.sim){simulation(d.sim);return;}
 if('example' in d){panel.querySelector('textarea').value='A flat in Cardiff for up to £1,000 a month';panel.querySelector('textarea').focus();return;}
 if('refresh' in d){const loading=Promise.all([loadAds(),loadSession()]);render();await loading;render();return;}
 if(d.ad){go('advert',{id:d.ad});return;}
 if('draft' in d){const f=document.querySelector('#ad-form');const v=fm(f);if(!v.area||!v.rent||!v.title){say('Enter a title, area and monthly rent or budget first.');return;}
 const title=v.title.trim().replace(/[.!?]+$/, '');
 const amount=v.kind==='wanted'?'Budget of '+money(v.rent)+' a month':money(v.rent)+' a month';
 const draft=amount+'. '+(billsText[v.bills]||'Bills to confirm')+'. '+title+'. '+(v.kind==='wanted'?'I’m looking for a home in ':'The home is in ')+v.area.trim()+'.';
 if(f.elements.body.value.trim()){modal('Replace the current description?','<p>'+e(draft)+'</p><div class="actions dialog-actions"><button class="btn outline" data-close>Keep my text</button><button class="btn primary" id="use-draft">Use this draft</button></div>');panel.querySelector('#use-draft').onclick=()=>{f.elements.body.value=draft;leave();};}else{f.elements.body.value=draft;f.elements.body.focus();}return;}
 if(d.enquire||d.answer){const answer=!!d.answer;modal(answer?'Reply to enquiry':'Send a free enquiry','<p>The other person will see this message in their LetMallow inbox.</p><form class="form" id="msg-form" data-mode="'+(answer?'answer':'enquire')+'" data-id="'+e(d.answer||d.enquire)+'"><label>Message<select name="message">'+opts(answer?contactReplies:contactQuestions)+'</select></label>'+(answer?'<label class="check"><input type="checkbox" name="shareContact">Share my sign-in email with the person who sent this enquiry so we can arrange a viewing.</label>':'')+'<button class="btn primary">Send message</button></form>');return;}
 if(d.withdraw){formAction('Withdraw this advert?','It will be removed along with its enquiries.','withdraw',{id:d.withdraw});return;}
 if(d.approve){formAction('Approve this advert?','Check that the advertiser has permission, the location and fixed rent are correct, and the advert includes the key terms. For homes in Wales, check registration and licensing or an applicable exemption. Approving makes the advert public.','moderate',{id:d.approve,decision:'approve',checked:true});return;}
 if(d.reject||d.unpublish){formAction('Remove from publication?','People will no longer see this advert in public search.','moderate',{id:d.reject||d.unpublish,decision:d.reject?'reject':'unpublish'});return;}
 if('erase' in d){formAction('Delete your LetMallow records?','This will delete your adverts, enquiries and test orders. You can’t undo it.','erase',{confirm:true});return;}
 if(d.pay){if(!state.session.signedIn){modal('Sign in for Stripe test checkout',signIn('plans'));return;}b.disabled=true;
 try{state.coupon??={};const requestId=state.coupon[d.pay]??=crypto.randomUUID();const data=await api('checkout',{product:d.pay,requestId});location.assign(data.url);}catch(err){say(err.message);b.disabled=false;}return;}
});
document.addEventListener('submit',async ev=>{
 const f=ev.target;if(!['search-form','smart-form','ad-form','msg-form'].includes(f.id))return;ev.preventDefault();
 const data=fm(f);
 if(f.id==='search-form'){go(data.kind==='wanted'?'wanted':'search',{area:data.area.trim(),kind:data.kind,max:data.max});return;}
 if(f.id==='smart-form'){const parsed=interpret(data.query);go('search',parsed);say(parsed.area||parsed.max||parsed.kind!=='any'?'We’ve applied the suggested filters. You can change them in the results.':'We couldn’t suggest filters. Try adding a town, home type or monthly budget.');return;}
 const button=f.querySelector('button[type=submit],button.primary');button.disabled=true;
 try{if(f.id==='ad-form'){await api('submit',{...data,authority:f.elements.authority.checked});go('account');say('We’ve received your advert for review.');}
 else{await api(f.dataset.mode,{id:f.dataset.id,shareContact:!!f.elements.shareContact?.checked,[f.dataset.mode==='answer'?'answer':'question']:data.message});go('account');say('Message sent.');}}
 catch(err){const errBox=f.querySelector('.error')||panel.querySelector('.error');if(errBox)errBox.textContent=err.message;else say(err.message);button.disabled=false;}
});
window.addEventListener('popstate',()=>{leave();render();});
dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)leave();}});
render();
loadAds().then(()=>{
 if(['search','community','wanted','advert'].includes(state.view))render();
});
loadSession().then(()=>{
 if(['account','review','advert','post','plans'].includes(state.view))render();
 if(state.session.signedIn&&state.view==='plans'){
    api('account').then(out=>{state.paidPasses=out.passes||[];if(state.view==='plans')render();}).catch(()=>{});
    const checkout=new URLSearchParams(location.search).get('checkout');
    if(checkout==='return')say('Your test pass will appear in your account once Stripe confirms the test payment.');
    if(checkout==='cancel')say('You cancelled Stripe test checkout.');
  }
});
