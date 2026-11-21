import {places,label,feedback,canonical,money,date,kindNames,findPlace,interpret,match,contactQuestions,contactReplies,plans,limits} from './domain.mjs';
import {e,icon,card,hero,landing,logo,searchForm} from './shell.mjs';
const main=document.querySelector('#content'),dialog=document.querySelector('#panel'),panel=document.querySelector('#panel-body'),notice=document.querySelector('#notice');
const mirror=document.querySelector('meta[name=rental-host]')?.content==='netlify';
const state={ads:[],loadError:false,view:'home',session:{signedIn:false,reviewer:false,stripe:false},role:'renter',coupon:null,paidPasses:[]};
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
async function api(name,data){
 const r=await fetch('/api/'+name,{method:data?'POST':'GET',credentials:'same-origin',headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined,cache:'no-store'});
 let out;try{out=await r.json();}catch{throw Error('The marketplace service is unavailable. You can still use the live search links.');}
 if(!r.ok)throw Error(out.error||'Please try again.');return out;
}
async function loadAds(){try{const r=await api('homes');if(!Array.isArray(r.ads))throw Error();state.ads=r.ads;state.loadError=false;}catch{state.loadError=true;}}
const urlFor=(view,filters={})=>{const p=new URLSearchParams();if(view!=='home')p.set('view',view);for(const [k,v]of Object.entries(filters))if(v&&v!=='any')p.set(k,String(v));return '/'+(p.size?'?'+p:'');};
function go(view,filters={},push=true){leave();if(push)history.pushState({},'',urlFor(view,filters));render();if(push){window.scrollTo(0,0);main.focus({preventScroll:true});}}
function reflectSaved(){document.querySelectorAll('[data-save]').forEach(b=>{const on=saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(on));const p=places.find(x=>x.id===b.dataset.save);b.setAttribute('aria-label',(on?'Remove ':'Save ')+(p?label(p):'location')+(on?' from saved areas':''));});}
function filters(){const p=new URLSearchParams(location.search);return {area:(p.get('area')||'').slice(0,80),kind:Object.hasOwn(kindNames,p.get('kind'))?p.get('kind'):'any',max:Math.min(100000,Math.max(0,Number(p.get('max'))||0))};}
function setFields(f){const form=document.querySelector('#search-form');if(!form)return;form.elements.area.value=f.area;form.elements.kind.value=f.kind;if(f.max&&!Array.from(form.elements.max.options).some(o=>+o.value===f.max))form.elements.max.add(new Option('Up to '+money(f.max),String(f.max)));form.elements.max.value=f.max?String(f.max):'';}
function providerRows(f){
 if(f.kind==='wanted')return '<div class="box"><h3>Find people looking for a room</h3><p>Choose “Rooms wanted” on SpareRoom and enter the area you want to search.</p><div class="actions">'+external('https://www.spareroom.co.uk/flatshare/search.pl','Search on SpareRoom')+'</div></div>';
 const p=findPlace(f.area);
 if(!p)return '<div class="item"><div><h3>Search an area on a provider</h3><p>Enter '+(f.area?'<b>'+e(f.area)+'</b>':'your town, island or postcode')+' on the provider’s search page. Set your budget there.</p></div><div class="actions">'+external('https://www.spareroom.co.uk/flatshare/search.pl','Rooms · SpareRoom')+external('https://www.openrent.co.uk/','Homes · OpenRent')+'</div></div>';
 const types=f.kind==='room'?['rooms']:f.kind==='flat'?['flats']:f.kind==='house'?['houses']:['rooms','flats','houses'];
 return types.map(k=>'<div class="item"><div><small class="eyebrow">'+e(p[k].provider)+'</small><h3>'+({rooms:'Rooms',flats:'Flats',houses:'Houses'}[k])+' in '+e(label(p))+'</h3><p>View the provider’s current adverts'+(p.id==='anglesey'?' in and around Anglesey':'')+'.</p></div>'+external(p[k].url,'View adverts')+'</div>').join('');
}
const advertTypes = { room: 'Room', flat: 'Flat', house: 'House', wanted: 'Wanted advert' };
const billsText = { Included: 'Bills included', Excluded: 'Bills excluded', 'Part included': 'Some bills included', 'To confirm': 'Bills to confirm' };

function dateMarkup(seconds) {
 const timestamp = new Date(seconds * 1000).toISOString();
 return `<time datetime="${timestamp}">${date(seconds)}</time>`;
}

function adPrice(ad) {
 return `<p class="ad-price">
   ${ad.kind === 'wanted' ? '<span class="ad-price-label">Budget</span>' : ''}
   <strong>${money(ad.rent)}</strong> <span>a month</span>
 </p>`;
}

function adFacts(ad) {
 return `<p class="ad-location">${icon('pin',16)} <span>${e(ad.area)} · ${e(ad.nation)}</span></p>
   <ul class="ad-facts" aria-label="Advert details">
     <li>${icon('home',16)} ${e(advertTypes[ad.kind] || ad.kind)}</li>
     <li>${e(billsText[ad.bills] || 'Bills to confirm')}</li>
   </ul>`;
}

function reviewedBadge() {
 return `<span class="badge audience-badge">${icon('shield',16)} Reviewed by LetMallow</span>`;
}

function adCards(ads) {
 if (state.loadError) return '<div class="empty">Community adverts could not load. <button class="link-button" data-refresh>Try again</button></div>';
 if (!ads.length) return '<div class="empty">No approved adverts match here yet.</div>';
 return `<div class="ad-grid">${ads.map(ad => `<article class="ad-card">
   ${ad.kind === 'wanted' ? '' : `<div class="ad-media">${icon('image',24)} <span>No photo supplied</span></div>`}
   <div class="ad-card-body">
     ${reviewedBadge()}
     <div class="ad-title"><h3>${e(ad.title)}</h3>${adPrice(ad)}</div>
     ${adFacts(ad)}
     <button class="link-button" data-ad="${e(ad.id)}" aria-label="View advert: ${e(ad.title)}">View advert ${icon('arrow',16)}</button>
   </div>
 </article>`).join('')}</div>`;
}

function resultPage(view) {
 const f = filters();
 if (view === 'community') {
   return `<div class="audience-renter">
     ${heading('Community adverts','Residential adverts published here after a studio review.',placeHeroImage(findPlace('Bristol')))}
     ${adCards(state.ads)}
     <div class="section-actions"><button class="btn primary" data-nav="post">${icon('plus',16)} Post an advert</button></div>
   </div>`;
 }
 if (view === 'wanted') f.kind = 'wanted';
 const ads = state.loadError ? [] : state.ads.filter(a => match(a,f));
 const rentalTitle = f.kind === 'any' ? 'Rentals' : kindNames[f.kind] + ' to rent';
 const title = f.kind === 'wanted'
   ? 'Wanted ads'
   : f.area ? rentalTitle + ' in ' + f.area : 'Search rental adverts';
 const description = f.kind === 'wanted' ? 'Find people looking for a room or a whole home.' : '';
 const community = `<section class="results-section" aria-labelledby="community-results">
   <div class="results-title">
     <h2 id="community-results">Community adverts</h2>
     ${!state.loadError ? `<p class="muted">${ads.length} matching ${ads.length === 1 ? 'advert' : 'adverts'}</p>` : ''}
   </div>
   ${adCards(ads)}
 </section>`;
 const providers = `<section class="results-section provider-section" aria-labelledby="provider-results">
   <div class="results-title">
     <h2 id="provider-results">Live provider searches</h2>
     <p class="muted">Set your final budget on the provider’s website and check availability with the advertiser.</p>
   </div>
   <div class="provider-list">${providerRows(f)}</div>
 </section>`;
 return `<div class="audience-renter">
   ${heading(title,description,f.kind==='wanted'?heroImages.wanted:placeHeroImage(findPlace(f.area)))}
   ${searchForm({ compact: true })}
   ${ads.length ? community + providers : providers + community}
 </div>`;
}
function safePlanState(role){const d=store.read('sim-'+role,{});const verified=state.paidPasses.filter(x=>x.expires>Date.now()/1000);return {plus:!!d.plus||verified.some(x=>x.product===role),used:Math.max(0,Number(d.used)||0),extra:Math.max(verified.some(x=>x.product==='extra')?1:0,Math.min(1,Number(d.extra)||0)),early:!!d.early,wanted:Math.max(0,Number(d.wanted)||0)};}
function planPage(){
 const role=state.role,l=role==='landlord',s=safePlanState(role),max=limits(role,s.plus),free=l?['One active advert','Basic advert management','Receive enquiries']:['Three standard responses per test period','One wanted advert for 30 days','Basic search and saved areas'];
 const plus=l?['Five active adverts','Advert-level response analytics','An extra advert can be tested separately']:['30 responses per test period','Contact early-access test adverts','Three wanted adverts for 30 days'];
 return '<div class="plan-layout audience-'+role+'">'+heading('Membership plans','Live alpha adverts and enquiries are free. Use the separate simulator to compare proposed 30-day passes.',heroImages.plans)+'<div class="role-tabs" aria-label="Choose role"><button data-role="renter" aria-pressed="'+!l+'">Renter</button><button data-role="landlord" aria-pressed="'+l+'">Landlord</button></div><div class="split">'+[['Free',0,free,false],[plans[role].name,plans[role].amount/100,plus,true]].map(([t,n,items,isPlus])=>'<article class="box plan'+(isPlus?' plan--plus':'')+'"><h3>'+t+'</h3><b>'+money(n)+' <small class="muted">'+(n?'per 30 days · test price':'')+'</small></b><ul>'+items.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="actions"><button class="btn '+(isPlus?'primary':'outline')+'" data-sim="'+(isPlus?'plus':'free')+'">Try '+t+'</button></div></article>').join('')+'</div><h2 class="results-head">Plan simulator</h2><div class="box stack"><b>'+e(s.plus?plans[role].name:'Free')+' · simulated account</b><p>'+ (l?'Adverts posted: '+s.used+' of '+(max.ads+s.extra)+'.':s.used+' of '+max.responses+' simulated responses used. Wanted adverts: '+s.wanted+' of '+max.wanted+'.')+'</p><div class="actions">'+(l?'<button class="btn outline small" data-sim="use">Post test advert</button><button class="btn outline small" data-sim="extra">Try one extra advert (£3)</button>':'<button class="btn outline small" data-sim="use">Respond to a standard advert</button><button class="btn outline small" data-sim="early">Try early access</button><button class="btn outline small" data-sim="wanted">Post test wanted ad</button>')+'<button class="link-button" data-sim="reset">Reset</button></div>'+(l&&s.plus?'<p>Test analytics · '+s.used+' adverts posted in this simulation.</p>':'')+'</div><div class="box stack payment-box"><h3>Stripe test checkout</h3><p>'+(state.session.stripe?'Test mode is connected. Use Stripe test details only.':'The Stripe sandbox has not been connected. You can try every plan limit above without entering payment details.')+'</p>'+(state.session.stripe?'<div class="actions"><button class="btn outline" data-pay="'+role+'">Open Stripe test checkout</button>'+(l?'<button class="btn outline" data-pay="extra">Test extra advert</button>':'')+'</div>':'')+'</div></div>';
}
function privacy(){return heading('Privacy & safety','Codewave Studio operates the LetMallow alpha for residential rentals in England and Wales.')+`<div class="stack"><section class="box"><h3>Browsing and smart search</h3><p>Search terms are interpreted on your device. A standard search puts the town, home type and budget in the page URL. Avoid entering an address or personal circumstances. Saved areas and the plan simulator use this browser’s local storage. You can remove them in Saved or reset the simulator.</p></section><section class="box"><h3>Adverts, enquiries and account data</h3><p>Signing in supplies an account identifier and email from ChatGPT. The service uses the identifier for advert ownership, your inbox and access control. The email is used for the authorised reviewer check. Advert text becomes public only after review. Private evidence links stay in the review queue. When replying, you can choose to share your sign-in email with that enquirer to arrange a viewing. Replying again without the tick removes the address from their inbox. They may already have copied it. Use a town or island rather than an exact address.</p><p>We process account records to provide the service you request and carry out safety checks in the legitimate interests of users and the studio. Adverts are listed for up to 30 days from submission. Public results exclude expired adverts immediately. Expired records become eligible for removal after a further 30 days and enquiries after 60 days. Housekeeping runs on subsequent submissions. Withdrawal removes an advert and its enquiries. You can erase your platform records in Your account.</p></section><section class="box"><h3>Providers and your choices</h3><p>Sites hosts the account service and its interim database. The Netlify edition uses the same account service. External search providers operate the pages you open. Tally processes feedback or reports you choose to submit. Stripe only receives a checkout request when a connected sandbox is used. No advert text is sent to an AI provider.</p><p>For access, correction, removal, restriction, objection or questions about transfers and safeguards, contact Codewave Studio through the feedback form. You can also complain to the UK Information Commissioner. Avoid sending identity documents or bank details.</p><div class="actions">${external(feedback,'Contact the studio')}${external('https://ico.org.uk/make-a-complaint/','ICO complaints')}</div></section><section class="box"><h3>Report a concern</h3><p>Report suspicious adverts with their reference. The studio can remove an advert during investigation. Confirm the advertiser’s authority and view the home before sending money. LetMallow does not collect rent, deposits or holding payments.</p>${external(feedback,'Report an advert')}</section></div>`;}
function reflectNav(view){document.querySelectorAll('header nav [data-nav]').forEach(b=>{const on=b.dataset.nav===view||(b.dataset.nav==='home'&&['areas','search','community'].includes(view));b.classList.toggle('current',on);if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
let renderID=0;
function render(){
 const view=new URLSearchParams(location.search).get('view')||'home';state.view=view;const id=++renderID;let html='';
 if(['search','community','wanted'].includes(view))html=resultPage(view);
 else if(view==='areas'||view==='saved'){const all=view==='areas',arr=all?places:places.filter(p=>saved.includes(p.id));html=heading(all?'Explore all areas':'Saved areas',all?'Choose a location or enter any town or island in England and Wales.':'Areas saved on this device.',all?placeHeroImage(findPlace('Anglesey')):undefined)+(all?searchForm():'')+'<div class="grid area-grid">'+arr.map(card).join('')+'</div>'+(!arr.length?'<div class="empty">Select the heart on an area to save it here.</div>':'');}
 else if(view==='plans')html=planPage();
 else if(view==='privacy')html=privacy();
 else if(view==='advert')html=details(new URLSearchParams(location.search).get('id'));
 else if(view==='post')html=postPage();
 else if(view==='account'||view==='review'){html=heading(view==='review'?'Review adverts':'Your account')+(state.session.signedIn?'<p>Loading…</p>':signIn(view));if(state.session.signedIn)loadAccount(view,id);}
 else html=landing();
 main.innerHTML=html;reflectSaved();reflectNav(view);if(view==='search'||view==='wanted')setFields({...filters(),...(view==='wanted'?{kind:'wanted'}:{})});
}
function signIn(view){const path=urlFor(view);const destination=mirror?canonical+path:'/signin-with-chatgpt?return_to='+encodeURIComponent(path);
 return '<div class="box stack sign-in-card"><div class="section-icon">'+icon('user',24)+'</div><h2>'+(mirror?'Open your LetMallow account':'Sign in to your account')+'</h2><p>Browsing is open to everyone. Sign in with ChatGPT to post, withdraw an advert or exchange enquiries.</p><div><a class="btn primary" target="_top" href="'+e(destination)+'">'+(mirror?'Continue to account service':'Sign in with ChatGPT')+' '+icon('arrow',16)+'</a></div></div>';}
function postPage(){if(!state.session.signedIn)return heading('Post an advert','One home advert and one 30-day wanted advert are available per account during the free alpha.',heroImages.post)+signIn('post');
 return heading('Post an advert','We review adverts before they appear. Use a town or neighbourhood and keep personal details out of the public text.',heroImages.post)+`<form id="ad-form" class="form entry box"><div class="split"><label>Advert type<select name="kind"><option value="room">Room to rent</option><option value="flat">Flat to rent</option><option value="house">House to rent</option><option value="wanted">Room or property wanted</option></select></label><label>Nation<select name="nation"><option>England</option><option>Wales</option></select></label></div><label>Town, neighbourhood or island<input required name="area" minlength="2" maxlength="80" placeholder="e.g. Beaumaris, Anglesey"></label><div class="split"><label>Monthly rent or wanted budget (£)<input required type="number" min="1" max="100000" name="rent" inputmode="numeric"></label><label>Bills<select name="bills">${opts(['Included','Excluded','Part included','To confirm'])}</select></label></div><label>Advert title<input required name="title" minlength="5" maxlength="90" placeholder="e.g. Double room in central Cardiff"></label><label>Description<textarea required name="body" minlength="25" maxlength="1200" placeholder="Describe the home, rent, bills and terms that matter to a renter."></textarea></label><button class="link-button" type="button" data-draft>Build a draft from these fields ${icon('spark',16)}</button><label>Existing public advert link (optional, for review)<input type="url" name="proof" maxlength="690" placeholder="https://"><span class="muted">SpareRoom, OpenRent, Rightmove, Zoopla or OnTheMarket. The studio may need further evidence before publication.</span></label><label class="check"><input required type="checkbox" name="authority">I authorise publication of this advert. I own or represent the offer, or I am the person looking for a home. The information is accurate.</label><p class="muted">Every advert expires after 30 days. For Welsh offers the reviewer checks applicable Rent Smart Wales registration and licensing or the relevant exemption. <button type="button" class="link-button" data-nav="privacy">Privacy &amp; safety</button></p><button class="btn primary" type="submit">Submit for review</button><p class="error" role="alert"></p></form>`;}
const accountLinks = [
 ['account-adverts', 'home', 'Your adverts'],
 ['account-received', 'message', 'Received enquiries'],
 ['account-sent', 'send', 'Sent enquiries'],
];
const testPassesLink = ['account-passes', 'ticket', 'Stripe test passes'];
const advertStates = { pending: 'Pending review', live: 'Live', rejected: 'Removed from publication', expired: 'Expired' };

function advertState(ad) {
 const status = ad.expires <= Date.now() / 1000 ? 'expired' : ad.status;
 return `<span class="badge" data-status="${e(status)}">${e(advertStates[status] || status)}</span>`;
}

function messageRow(message, canReply) {
 const reply = message.answer || 'Awaiting a reply';
 const contact = message.contact
   ? canReply
     ? '<p class="muted">You shared your email with this enquirer.</p>'
     : `<p>Contact the advertiser at <a href="mailto:${e(encodeURIComponent(message.contact))}">${e(message.contact)}</a>.</p>`
   : '';
 return `<li class="workspace-row">
   <span class="section-icon">${icon(canReply ? 'message' : 'send',20)}</span>
   <div class="workspace-copy">
     <h3>${e(message.title)}</h3>
     <p>${e(message.question)}</p>
     <p class="message-reply">${e(reply)}</p>
     ${contact}
   </div>
   ${canReply ? buttons(message.id,'data-answer','Reply') : ''}
 </li>`;
}

function workspaceSection([id, symbol, title], audience, rows, empty) {
 return `<section class="workspace-section audience-${audience}" aria-labelledby="${id}">
   <h2 id="${id}" tabindex="-1">${icon(symbol,20)} ${title}</h2>
   ${rows.length ? `<ul class="workspace-list">${rows.join('')}</ul>` : `<p class="empty">${empty}</p>`}
 </section>`;
}

function accountPage(out) {
 const links = out.passes.length ? [...accountLinks, testPassesLink] : accountLinks;
 return `<div class="account-layout">
   <aside class="account-sidebar">
     <a class="brand" href="/" aria-label="LetMallow home">${logo}</a>
     <nav aria-label="Account sections">
       ${links.map(([id,symbol,title],index) => `<button type="button" data-account-section="${id}"${index === 0 ? ' aria-current="location"' : ''}>${icon(symbol,20)} ${title}</button>`).join('')}
     </nav>
     <a class="link-button" target="_top" href="/signout-with-chatgpt?return_to=%2F">Sign out</a>
   </aside>
   <div class="account-content">
     ${heading('Your account','Manage your adverts and check the inbox for replies.')}
     <div class="actions">
       <button class="btn primary" data-nav="post">${icon('plus',16)} Post an advert</button>
       ${out.reviewer ? '<button class="btn outline" data-nav="review">Review adverts</button>' : ''}
     </div>
     ${workspaceSection(accountLinks[0],'landlord',out.ads.map(ad => `<li class="workspace-row">
       <span class="section-icon">${icon('home',20)}</span>
       <div class="workspace-copy">
         <h3>${e(ad.title)}</h3>
         <p>Expires ${dateMarkup(ad.expires)} · ${e(ad.area)}</p>
         ${advertState(ad)}
       </div>
       ${buttons(ad.id,'data-withdraw','Withdraw')}
     </li>`),'Your submitted adverts will appear here.')}
     ${workspaceSection(accountLinks[1],'landlord',out.inbox.map(m => messageRow(m,true)),'No enquiries yet.')}
     ${workspaceSection(accountLinks[2],'renter',out.sent.map(m => messageRow(m,false)),'No enquiries sent.')}
     ${out.passes.length ? workspaceSection(testPassesLink,'renter',out.passes.map(pass => `<li class="workspace-row">
       <span class="section-icon">${icon('ticket',20)}</span>
       <div class="workspace-copy"><h3>${e(plans[pass.product]?.name)}</h3><p>Expires ${dateMarkup(pass.expires)}</p></div>
     </li>`),'') : ''}
     <button class="link-button" data-erase>Erase my platform records</button>
   </div>
 </div>`;
}

function reviewPage(ads) {
 const cards = ads.map(ad => `<article class="box stack">
   ${advertState(ad)}
   <div class="ad-title"><h3>${e(ad.title)}</h3>${adPrice(ad)}</div>
   ${adFacts(ad)}
   <p class="adtext">${e(ad.body)}</p>
   <p class="muted">Advert reference ${e(ad.id)}</p>
   ${ad.proof ? external(ad.proof,'Private evidence link') : '<p>Further authority checks needed if evidence is missing.</p>'}
   <div class="actions">${ad.status === 'live'
     ? buttons(ad.id,'data-unpublish','Unpublish')
     : buttons(ad.id,'data-approve','Review for approval','primary') + buttons(ad.id,'data-reject','Reject')}</div>
 </article>`).join('');
 return heading('Review adverts','Verify advertiser authority, nation and material terms. For Welsh offers check registration/licensing or the applicable exemption. Record the evidence in the studio review process. Only approve complete adverts.')
   + `<div class="rows">${cards || '<p class="empty">The queue is empty.</p>'}</div>`;
}

async function loadAccount(view,id) {
 const isReview = view === 'review';
 try {
   const out = await api(isReview ? 'queue' : 'account');
   if (id !== renderID) return;
   main.innerHTML = isReview ? reviewPage(out.ads) : accountPage(out);
 } catch (err) {
   if (id !== renderID) return;
   main.innerHTML = heading(isReview ? 'Review adverts' : 'Your account')
     + `<div class="empty">${e(err.message)} <button class="link-button" data-refresh>Try again</button></div>`;
 }
}

function details(id) {
 const ad = state.ads.find(item => item.id === id);
 if (!ad) return heading('Advert unavailable','This advert may have expired or been withdrawn.')
   + '<button class="btn outline" data-nav="community">Browse community adverts</button>';
 const path = urlFor('advert',{id:ad.id});
 const dest = mirror ? canonical + path : '/signin-with-chatgpt?return_to=' + encodeURIComponent(path);
 return `<div class="audience-renter">
   ${heading(ad.title)}
   <article class="box stack advert-detail">
     ${reviewedBadge()}
     ${adPrice(ad)}
     ${adFacts(ad)}
     <p class="adtext">${e(ad.body)}</p>
     <p class="muted">Advert reference ${e(ad.id)} · Expires ${dateMarkup(ad.expires)}</p>
     <div class="actions">
       ${state.session.signedIn
         ? buttons(ad.id,'data-enquire','Send a free enquiry','primary')
         : `<a class="btn primary" target="_top" href="${e(dest)}">Sign in to enquire for free</a>`}
       ${external(feedback,'Report this advert')}
     </div>
   </article>
 </div>`;
}
function openSmart(){modal('Describe your search','<p>Write the place, home type and maximum rent. The on-device model suggests a type and lets you edit the filters.</p><form class="form" id="smart-form"><label>What are you looking for?<textarea required name="query" maxlength="200" placeholder="A room in Cardiff under £750 per month"></textarea></label><div class="actions"><button type="button" class="link-button" data-example>Use an example</button></div><button class="btn primary">Suggest filters</button></form>');}
function formAction(title,desc,op,data){
 modal(title,'<p>'+e(desc)+'</p><div class="actions dialog-actions"><button class="btn outline" data-close>Cancel</button><button class="btn primary" id="confirm-action">Confirm</button></div>');
 document.querySelector('#confirm-action').onclick=async ev=>{ev.currentTarget.disabled=true;try{await api(op,data);leave();await loadAds();go(op==='moderate'?'review':'account');say('Change saved.');}catch(err){panel.querySelector('.error').textContent=err.message;document.querySelector('#confirm-action').disabled=false;}};
}
function simulation(key){
 const s=safePlanState(state.role),l=state.role==='landlord',m=limits(state.role,s.plus);let msg='';
 if(key==='reset'){store.write('sim-'+state.role,{});render();say('Simulation reset.');return;}
 if(key==='plus'||key==='free'){s.plus=key==='plus';msg='Test plan selected.';}
 if(key==='extra'){s.extra=1;msg='One additional test advert slot enabled.';}
 if(key==='wanted'){if(s.wanted>=m.wanted){say('Wanted advert limit reached for this test plan.');return;}s.wanted++;msg='Test wanted advert added for 30 days.';}
 if(key==='use'||key==='early'){
  if(key==='early'&&!m.early){say('Early access is a Renter Plus test feature.');return;}
  if(s.used>=(l?m.ads+s.extra:m.responses)){say('Test plan limit reached. Try Plus or reset.');return;}
  s.used++;msg=l?'Test advert added.':'Test response recorded.';
 }
 store.write('sim-'+state.role,s);render();say(msg);
}
document.addEventListener('click',async ev=>{
 const b=ev.target.closest('button,[data-nav]');if(!b)return;const d=b.dataset;
 if('close' in d){leave();return;}
 if(d.nav){if(d.nav==='smart'){openSmart();return;}if(d.nav==='menu'){modal('Navigation','<div class="panel-menu">'+[['home','Explore'],['areas','All areas'],['wanted','Wanted ads'],['post','Post an advert'],['saved','Saved areas'],['plans','Plans'],['account','Your account']].map(([k,v])=>'<button data-nav="'+k+'">'+v+'</button>').join('')+'</div>');return;}go(d.nav);return;}
 if(d.accountSection) {
   const heading = document.getElementById(d.accountSection);
   if (heading) {
     const current = b.closest('nav').querySelector('[aria-current]');
     current?.removeAttribute('aria-current');
     b.setAttribute('aria-current','location');
     heading.focus({ preventScroll: true });
     heading.scrollIntoView({ block: 'nearest' });
   }
   return;
 }
 if(d.place){const p=places.find(x=>x.id===d.place);if(p)go('search',{area:label(p)});return;}
 if(d.save){const on=saved.includes(d.save);saved=on?saved.filter(x=>x!==d.save):[...saved,d.save];const persisted=store.write('places',saved);if(state.view==='saved')render();else reflectSaved();say((on?'Area removed.':'Area saved.')+(persisted?'':' This session only.'));return;}
 if(d.role){state.role=d.role;render();return;}if(d.sim){simulation(d.sim);return;}
 if('example' in d){panel.querySelector('textarea').value='A flat in Cardiff under £1,000 per month';panel.querySelector('textarea').focus();return;}
 if('refresh' in d){await loadAds();try{state.session=await api('session');}catch{}render();return;}
 if(d.ad){go('advert',{id:d.ad});return;}
 if('draft' in d){const f=document.querySelector('#ad-form');const v=fm(f);if(!v.area||!v.rent||!v.title){say('Enter a title, area and monthly amount first.');return;}
 const draft=(v.kind==='wanted'?'Looking for a home in ':'Available in ')+v.area+'. '+v.title+'. '+(v.kind==='wanted'?'Monthly budget ':'Monthly rent ')+money(v.rent)+'. Bills: '+v.bills.toLowerCase()+'.';
 if(f.elements.body.value.trim()){modal('Replace the current description?','<p>'+e(draft)+'</p><div class="actions dialog-actions"><button class="btn outline" data-close>Keep my text</button><button class="btn primary" id="use-draft">Use this draft</button></div>');panel.querySelector('#use-draft').onclick=()=>{f.elements.body.value=draft;leave();};}else{f.elements.body.value=draft;f.elements.body.focus();}return;}
 if(d.enquire||d.answer){const answer=!!d.answer;modal(answer?'Reply to enquiry':'Send a free enquiry','<p>The message will appear in the other person’s LetMallow inbox.</p><form class="form" id="msg-form" data-mode="'+(answer?'answer':'enquire')+'" data-id="'+e(d.answer||d.enquire)+'"><label>Message<select name="message">'+opts(answer?contactReplies:contactQuestions)+'</select></label>'+(answer?'<label class="check"><input type="checkbox" name="shareContact">Share my sign-in email privately with this enquirer so we can arrange a viewing.</label>':'')+'<button class="btn primary">Send message</button></form>');return;}
 if(d.withdraw){formAction('Withdraw this advert?','It will be removed along with its enquiries.','withdraw',{id:d.withdraw});return;}
 if(d.approve){formAction('Approve this advert?','Confirm you checked advertiser authority, the location, the fixed rent and material information, plus Welsh registration, licensing or exemption where applicable. This makes the text public.','moderate',{id:d.approve,decision:'approve',checked:true});return;}
 if(d.reject||d.unpublish){formAction('Remove from publication?','This advert will be excluded from public search.','moderate',{id:d.reject||d.unpublish,decision:d.reject?'reject':'unpublish'});return;}
 if('erase' in d){formAction('Erase your platform records?','Your adverts, enquiries and test orders will be removed. This cannot be undone.','erase',{confirm:true});return;}
 if(d.pay){if(!state.session.signedIn){modal('Sign in for Stripe test checkout',signIn('plans'));return;}b.disabled=true;
 try{state.coupon??={};const requestId=state.coupon[d.pay]??=crypto.randomUUID();const data=await api('checkout',{product:d.pay,requestId});location.assign(data.url);}catch(err){say(err.message);b.disabled=false;}return;}
});
document.addEventListener('submit',async ev=>{
 const f=ev.target;if(!['search-form','smart-form','ad-form','msg-form'].includes(f.id))return;ev.preventDefault();
 const data=fm(f);
 if(f.id==='search-form'){go(data.kind==='wanted'?'wanted':'search',{area:data.area.trim(),kind:data.kind,max:data.max});return;}
 if(f.id==='smart-form'){const parsed=interpret(data.query);go('search',parsed);say(parsed.area||parsed.max||parsed.kind!=='any'?'Suggested filters applied. You can edit each one.':'No supported filters found. Enter your town, home type or budget.');return;}
 const button=f.querySelector('button[type=submit],button.primary');button.disabled=true;
 try{if(f.id==='ad-form'){await api('submit',{...data,authority:f.elements.authority.checked});go('account');say('Advert submitted for review.');}
 else{await api(f.dataset.mode,{id:f.dataset.id,shareContact:!!f.elements.shareContact?.checked,[f.dataset.mode==='answer'?'answer':'question']:data.message});go('account');say('Message sent.');}}
 catch(err){const errBox=f.querySelector('.error')||panel.querySelector('.error');if(errBox)errBox.textContent=err.message;else say(err.message);button.disabled=false;}
});
window.addEventListener('popstate',()=>{leave();render();});
dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)leave();}});
render();
const initialView=state.view;
Promise.all([loadAds(),mirror?Promise.resolve():api('session').then(s=>state.session=s).catch(()=>{})]).then(()=>{
 if(state.session.signedIn&&initialView==='plans'){
    api('account').then(out=>{state.paidPasses=out.passes||[];if(state.view==='plans')render();}).catch(()=>{});
    const checkout=new URLSearchParams(location.search).get('checkout');
    if(checkout==='return')say('Returned from Stripe. Your verified test pass appears once payment is confirmed.');
    if(checkout==='cancel')say('Test checkout cancelled.');
  }
  if(state.view==='post'&&!state.session.signedIn)return;
 if(state.view===initialView&&['search','community','wanted','account','review','advert','post','plans'].includes(initialView))render();
});
