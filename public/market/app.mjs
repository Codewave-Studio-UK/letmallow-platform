import {places,label,feedback,canonical,money,billsText,advertStates,kindNames,findPlace,match,contactQuestions,contactReplies,plans,limits} from './domain.mjs';
import {e,icon,card,hero,landing,locationField,placePhoto,searchForm,dateMarkup,navigationLinks} from './shell.mjs';
import {requestMarketplace as api} from './client-api.mjs';
const main=document.querySelector('#content'),dialog=document.querySelector('#panel'),panel=document.querySelector('#panel-body'),notice=document.querySelector('#notice');
const header = document.querySelector('.site-header');
const nav = header.querySelector('.nav-wrap');
let stickyToolbar;
const stickySizes = new ResizeObserver(entries => {
  for (const {target} of entries) {
    if (!target.isConnected) continue;
    const name = target === header ? '--navbar-height' : '--result-toolbar-height';
    document.documentElement.style.setProperty(name, target.getBoundingClientRect().height + 'px');
  }
});
stickySizes.observe(header);
const dropdown = nav.querySelector('.nav-dropdown');
const desktopMenu = nav.querySelector('.nav-desktop-menu');
const mirror=document.querySelector('meta[name=rental-host]')?.content==='netlify';
const state={ads:[],adsLoading:true,loadError:false,view:'home',sessionLoading:!mirror,sessionError:false,session:{signedIn:false,reviewer:false,stripe:false},role:'renter',coupon:null,paidPasses:[]};
const store={read(k,alt){try{return JSON.parse(localStorage.getItem('lm-'+k))??alt;}catch{return alt;}},write(k,v){try{localStorage.setItem('lm-'+k,JSON.stringify(v));return true;}catch{return false;}}};
let saved=store.read('places',[]);if(!Array.isArray(saved))saved=[];
const say=s=>{notice.textContent=s;clearTimeout(say.timer);say.timer=setTimeout(()=>{notice.textContent='';},3700);};
function modal(title,content,variant=''){dialog.className=variant;panel.innerHTML='<h2 id="dialog-title">'+e(title)+'</h2>'+content+'<p class="error" id="modal-error" role="alert"></p>';if(!dialog.open)dialog.showModal();}
function leave(){if(dialog.open)dialog.close();}
const heroImages = {
  wanted: { src: '/market/photos/olive-lounge.webp', width: 1280, height: 854, position: '65% 57%', mobilePosition: '67% 50%' },
  plans: { src: '/market/photos/daylight-lounge.webp', width: 1280, height: 853, position: '50% 56%' },
  post: { src: '/market/photos/garden-double.webp', width: 1280, height: 853, position: '63% 52%' },
};

function placeHeroImage(place) {
  if (!place) return;
  return {
    src: '/market/places/' + place.image, width: 800, height: 600, variants: [480],
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
let adsRequest;
let sessionRequest;
const sessionViews = ['account', 'messages', 'review', 'advert', 'post', 'plans'];
const accountTitles = { account: 'Your account', messages: 'Messages', review: 'Review adverts' };
async function loadAds(){state.adsLoading=true;try{const r=await api('homes');if(!Array.isArray(r.ads))throw Error();state.ads=r.ads;state.loadError=false;}catch{state.loadError=true;}finally{state.adsLoading=false;}}
function sessionNotice(){
 if(state.sessionLoading)return '<p class="empty" role="status">Checking your account…</p>';
 if(state.sessionError)return '<p class="empty" role="alert">We couldn’t check if you’re signed in. <button class="link-button" data-refresh>Try again</button></p>';
 return '';
}
const urlFor=(view,filters={})=>{const p=new URLSearchParams();if(view!=='home')p.set('view',view);for(const [k,v]of Object.entries(filters))if(v&&v!=='any')p.set(k,String(v));return '/'+(p.size?'?'+p:'');};
function go(view,filters={},push=true){leave();if (!browseViews.includes(view)) prefersMap = false;
 if(push)history.pushState({},'',urlFor(view,filters));render();if(push){window.scrollTo(0,0);main.focus({preventScroll:true});}}
function reflectSaved(){document.querySelectorAll('[data-save]').forEach(b=>{const on=saved.includes(b.dataset.save);b.setAttribute('aria-pressed',String(on));const p=places.find(x=>x.id===b.dataset.save);b.setAttribute('aria-label',(on?'Remove ':'Save ')+(p?label(p):'location')+(on?' from saved areas':''));});}
function filters(){const p=new URLSearchParams(location.search);return {area:(p.get('area')||'').slice(0,80),kind:Object.hasOwn(kindNames,p.get('kind'))?p.get('kind'):'any',max:Math.min(100000,Math.max(0,Number(p.get('max'))||0))};}
function setFields(form, filter) {
  form.elements.area.value = filter.area;
  form.elements.kind.value = filter.kind;
  if (filter.max && !Array.from(form.elements.max.options).some(option => +option.value === filter.max)) {
    form.elements.max.add(new Option('Up to ' + money(filter.max), String(filter.max)));
  }
  form.elements.max.value = filter.max ? String(filter.max) : '';
}

function resultFilters(view) {
  const current = filters();
  if (view === 'wanted') current.kind = 'wanted';
  return current;
}

function resultToolbar(filter) {
  const active = Number(filter.kind !== 'any') + Number(filter.max > 0);
  return `<div class="result-toolbar">
    <form id="result-search" role="search">
      ${locationField('result-search')}
      <button class="btn primary" type="submit">${icon('search', 20)} Search</button>
    </form>
    <button class="btn outline filter-button${active ? ' is-filtered' : ''}" type="button" data-filter="all" aria-haspopup="dialog">${icon('filter', 20)} Filters${active ? ' (' + active + ')' : ''}</button>
    <div class="filter-pills">
      <button class="btn outline${filter.kind !== 'any' ? ' is-filtered' : ''}" type="button" data-filter="kind" aria-haspopup="dialog">${e(kindNames[filter.kind])} ${icon('down', 16)}</button>
      <button class="btn outline${filter.max ? ' is-filtered' : ''}" type="button" data-filter="max" aria-haspopup="dialog">${filter.max ? 'Up to ' + money(filter.max) : 'Any budget'} ${icon('down', 16)}</button>
    </div>
  </div>`;
}

function resultCard({title, label: subtitle, description, place, action, location}) {
  const thumbnail = place
    ? placePhoto(place, '(min-width: 1440px) 360px, (min-width: 1024px) 160px, (min-width: 768px) 46vw, (min-width: 640px) 190px, 96vw', '')
    : icon('home', 24);
  return `<article class="result-card">
    <div class="result-media"${place ? '' : ' aria-hidden="true"'}>${thumbnail}</div>
    <div class="result-card-content">
      <p class="eyebrow">${location ? icon('pin', 16) + ' ' : ''}${e(subtitle)}</p>
      <h3>${e(title)}</h3>
      <div>${description}</div>
      <div class="actions">${action}</div>
    </div>
  </article>`;
}

function providerRows(filter) {
  const place = findPlace(filter.area);
  if (filter.kind === 'wanted') {
    return resultCard({
      title: 'Find people looking for a room', label: 'SpareRoom', place,
      description: '<p>Choose “Rooms wanted” and enter the area you want to search.</p>',
      action: external('https://www.spareroom.co.uk/flatshare/search.pl', 'Search on SpareRoom'),
    });
  }
  if (!place) {
    return resultCard({
      title: 'Search on rental websites', label: 'External searches',
      description: '<p>Enter ' + (filter.area ? '<strong>' + e(filter.area) + '</strong>' : 'your town, island or postcode') + ' on the rental website.</p>',
      action: external('https://www.spareroom.co.uk/flatshare/search.pl', 'SpareRoom') + external('https://www.openrent.co.uk/', 'OpenRent'),
    });
  }
  const types = filter.kind === 'any' ? ['room', 'flat', 'house'] : [filter.kind];
  return types.map(type => {
    const group = type + 's';
    const source = place[group];
    return resultCard({
      title: kindNames[type] + ' in ' + label(place), label: source.provider, place,
      description: '<p>Browse current adverts on ' + e(source.provider) + '.</p>',
      action: external(source.url, 'View adverts'),
    });
  }).join('');
}

function matchingAdverts(view) {
  const filter = resultFilters(view);
  if (view === 'community' && filter.kind === 'any') {
    return state.ads.filter(ad => match(ad, {...filter, kind: ad.kind}));
  }
  return state.ads.filter(ad => match(ad, filter));
}

function adRows(ads) {
  if (state.adsLoading) return '<p class="empty" role="status">Loading community adverts…</p>';
  if (state.loadError) return '<div class="empty" role="alert">We couldn’t load community adverts. <button class="link-button" data-refresh>Try again</button></div>';
  if (!ads.length) return '<p class="empty">No community adverts match your search yet.</p>';
  return ads.map(ad => resultCard({
    title: ad.title, label: ad.area + ' · ' + (kindNames[ad.kind] || 'Advert'), location: true,
    description: `<p class="ad-price">${ad.kind === 'wanted' ? 'Budget of ' : ''}<strong>${money(ad.rent)}</strong> a month</p>
      <p>${e(billsText[ad.bills] || 'Bills to confirm')}</p>
      <p class="muted">${icon('shield', 16)} Reviewed by LetMallow</p>`,
    action: buttons(ad.id, 'data-ad', 'View advert'),
  })).join('');
}

const browseViews = ['search', 'community', 'wanted'];
const splitView = matchMedia('(min-width: 1024px)');
let prefersMap = false;
let listScroll = 0;
let rentalMap;

function resultPage(view) {
  const filter = resultFilters(view);
  const community = view === 'community';
  const title = community ? 'Community adverts' : view === 'wanted' ? 'Wanted adverts' : filter.area ? 'Rentals in ' + filter.area : 'Find homes to rent';
  const description = community ? 'We review adverts before they appear on LetMallow.' : view === 'wanted'
    ? 'Find people looking for a room, flat or house.' : 'Browse community adverts or search other rental websites.';
  const image = view === 'wanted' ? heroImages.wanted : placeHeroImage(findPlace(filter.area));
  return heading(title, description, image) + `
  <div class="result-workspace">
    ${resultToolbar(filter)}
    <div class="result-layout">
      <section class="result-feed" aria-label="Search results" id="result-feed" tabindex="0">
        <div class="result-group">
          <h2>Community adverts</h2>
          <div class="result-grid" id="community-results">${adRows(matchingAdverts(view))}</div>
          ${community ? '<button class="btn primary" data-nav="post">Post an advert</button>' : ''}
        </div>
        ${community ? '' : `<div class="result-group">
          <h2>Search other rental websites</h2>
          <p>Check prices, availability and details on the rental website.</p>
          <div class="result-grid">${providerRows(filter)}</div>
        </div>`}
      </section>
      <section class="result-map" id="result-map" aria-labelledby="map-heading" tabindex="-1" hidden>
        <h2 id="map-heading">Explore the map</h2>
        <div id="map-content"><p class="empty" role="status">Loading map…</p></div>
      </section>
    </div>
  </div>
    <button type="button" class="btn primary view-toggle" data-toggle-map aria-controls="result-feed result-map">Map view</button>`;
}

function updateMap() {
  rentalMap?.update(resultFilters(state.view), matchingAdverts(state.view), state.view, {loading: state.adsLoading, failed: state.loadError});
}

async function mountMap(container) {
  if (container.dataset.mounted) return;
  container.dataset.mounted = 'true';
  container.innerHTML = '<p class="empty" role="status">Loading map…</p>';
  try {
    const {createRentalMap} = await import('./rental-map.mjs');
    if (!container.isConnected) return;
    rentalMap = createRentalMap(container);
    updateMap();
  } catch {
    if (!container.isConnected) return;
    delete container.dataset.mounted;
    container.innerHTML = '<p class="empty" role="alert">We couldn’t load the map. <button class="link-button" type="button" data-retry-map>Try again</button></p>';
  }
}

function setResultView() {
  const feed = main.querySelector('#result-feed');
  if (!feed) return;
  const map = main.querySelector('#result-map');
  const toggle = main.querySelector('[data-toggle-map]');
  const active = splitView.matches || prefersMap;
  const focused = document.activeElement;
  feed.hidden = active && !splitView.matches;
  map.hidden = !active;
  toggle.innerHTML = active ? icon('list') + ' List view' : icon('map') + ' Map view';
  feed.tabIndex = splitView.matches ? 0 : -1;
  if (splitView.matches && focused === toggle) feed.focus({preventScroll: true});
  if ((feed.hidden && feed.contains(focused)) || (map.hidden && map.contains(focused))) toggle.focus();
  if (active) void mountMap(map.querySelector('#map-content'));
}
splitView.addEventListener('change', setResultView);

function refreshResults() {
  const list = main.querySelector('#community-results');
  if (!list) {
    if (state.view === 'advert') render();
    return;
  }
  list.innerHTML = adRows(matchingAdverts(state.view));
  updateMap();
}

function safePlanState(role){const d=store.read('sim-'+role,{});const verified=state.paidPasses.filter(x=>x.expires>Date.now()/1000);return {plus:!!d.plus||verified.some(x=>x.product===role),used:Math.max(0,Number(d.used)||0),extra:Math.max(verified.some(x=>x.product==='extra')?1:0,Math.min(1,Number(d.extra)||0)),early:!!d.early,wanted:Math.max(0,Number(d.wanted)||0)};}
function planPage(){
 const role=state.role,l=role==='landlord',s=safePlanState(role),max=limits(role,s.plus),free=l?['1 active advert','Manage your advert','Receive enquiries']:['3 replies to test adverts every 30 days','1 wanted advert for 30 days','Search and save areas'];
 const plus=l?['5 active adverts','See how many replies each advert gets','Try an extra advert separately']:['30 replies to test adverts every 30 days','Reply to test adverts before they open to everyone','3 wanted adverts for 30 days'];
 return heading('Membership plans','Posting and sending enquiries are free during alpha. Try the proposed 30-day plans below.',heroImages.plans)+'<div class="role-tabs" aria-label="Choose renter or landlord"><button data-role="renter" aria-pressed="'+!l+'">Renter</button><button data-role="landlord" aria-pressed="'+l+'">Landlord</button></div><div class="split">'+[['Free',0,free,false],[plans[role].name,plans[role].amount/100,plus,true]].map(([t,n,items,isPlus])=>'<article class="box plan"><h3>'+t+'</h3><b>'+money(n)+' <small class="muted">'+(n?'for 30 days in test mode':'')+'</small></b><ul>'+items.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="actions"><button class="btn '+(isPlus?'primary':'outline')+'" data-sim="'+(isPlus?'plus':'free')+'">Try '+(isPlus?t:'the free plan')+'</button></div></article>').join('')+'</div><h2 class="results-head">Try a plan</h2><div class="box stack"><b>'+e(s.plus?plans[role].name:'Free')+' test plan</b><p>'+ (l?'Adverts posted: '+s.used+' of '+(max.ads+s.extra)+'.':s.used+' of '+max.responses+' test replies used. Wanted adverts: '+s.wanted+' of '+max.wanted+'.')+'</p><div class="actions">'+(l?'<button class="btn outline small" data-sim="use">Post test advert</button><button class="btn outline small" data-sim="extra">Try one extra advert (£3)</button>':'<button class="btn outline small" data-sim="use">Reply to a test advert</button><button class="btn outline small" data-sim="early">Try early access</button><button class="btn outline small" data-sim="wanted">Post test wanted advert</button>')+'<button class="link-button" data-sim="reset">Reset</button></div>'+(l&&s.plus?'<p>'+s.used+(s.used===1?' advert':' adverts')+' posted in this test.</p>':'')+'</div><div class="box stack payment-box"><h3>Stripe test checkout</h3><p>'+(mirror?'Open LetMallow to see whether Stripe test checkout is available.':state.sessionLoading?'Checking test checkout availability…':state.sessionError?'We couldn’t check whether Stripe test checkout is available. Reload the page to try again.':state.session.stripe?'Use Stripe test card details. You won’t be charged.':'Stripe test checkout is unavailable. You can still try the plans above without entering payment details.')+'</p>'+(mirror?'<p><a class="btn outline" target="_top" href="'+canonical+'/?view=plans">Continue to LetMallow</a></p>':state.session.stripe?'<div class="actions"><button class="btn outline" data-pay="'+role+'">Open Stripe test checkout</button>'+(l?'<button class="btn outline" data-pay="extra">Test extra advert</button>':'')+'</div>':'')+'</div>';
}
function privacy(){return heading('Privacy and safety','Codewave Studio operates the LetMallow alpha for residential rentals in England and Wales.')+`<div class="stack"><section class="box"><h3>Browsing and smart search</h3><p>LetMallow reads your search on your device. A standard search puts the town, home type and budget in the page URL. Avoid entering an address or personal circumstances. This browser stores your saved areas and plan choices. Open Saved areas to remove an area or reset the test plan on the Plans page.</p></section><section class="box"><h3>Adverts, enquiries and account data</h3><p>When you sign in, ChatGPT shares an account ID and email address. We use the ID to link your adverts and enquiries to your account and manage access. We use your email to check if you can review adverts. Advert text becomes public only after review. Only reviewers can see private evidence links. When replying, you can choose to share your sign-in email with the person who contacted you to arrange a viewing. To remove your email from their inbox, reply again and leave the box unticked. They may have already copied it. Use a town or island rather than an exact address.</p><p>We process account records to provide the service you request and carry out safety checks in the legitimate interests of users and the studio. Adverts are listed for up to 30 days from submission. Adverts disappear from public results as soon as they expire. When someone submits an advert, the service can remove adverts that expired more than 30 days ago and enquiries more than 60 days old. Withdrawing an advert removes it and its enquiries. You can delete your LetMallow records from your account.</p></section><section class="box"><h3>Providers and your choices</h3><p>ChatGPT Sites hosts your account and its current database. The Netlify site uses the same account service. Other rental websites run their own searches. Tally processes feedback or reports you choose to submit. Stripe receives a checkout request only when you use its connected test checkout. No advert text is sent to an AI provider.</p><p>For access, correction, removal, restriction, objection or questions about transfers and safeguards, contact Codewave Studio through the feedback form. You can also complain to the UK Information Commissioner. Avoid sending identity documents or bank details.</p><div class="actions">${external(feedback,'Contact the studio')}${external('https://ico.org.uk/make-a-complaint/','Complain to the ICO')}</div></section><section class="box"><h3>Report a concern</h3><p>Report suspicious adverts with their reference. The studio can remove an advert during investigation. Check that the advertiser has permission to let the home and view it before sending money. LetMallow does not collect rent, deposits or holding payments.</p>${external(feedback,'Report an advert')}</section></div>`;}
function reflectNav(view) {
  for (const button of nav.querySelectorAll('[data-nav]:not([data-nav="menu"])')) {
    if (button.dataset.nav === view) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  }
}
let renderID=0;
function render(){
 const view=new URLSearchParams(location.search).get('view')||'home';state.view=view;const id=++renderID;let html='';
 if (browseViews.includes(view)) html = resultPage(view);
 else if(view==='areas'||view==='saved'){const all=view==='areas',arr=all?places:places.filter(p=>saved.includes(p.id));html=heading(all?'Explore all areas':'Saved areas',all?'Choose a location or enter any town or island in England and Wales.':'Find the areas you’ve saved on this device.',all?placeHeroImage(findPlace('Anglesey')):undefined)+(all?searchForm():'')+'<div class="grid area-grid">'+arr.map(card).join('')+'</div>'+(!arr.length?'<div class="empty">To save an area, select the heart next to it.</div>':'');}
 else if(view==='plans')html=planPage();
 else if(view==='privacy')html=privacy();
 else if(view==='advert')html=details(new URLSearchParams(location.search).get('id'));
 else if(view==='post')html=postPage();
 else if (Object.hasOwn(accountTitles, view)) {
   html = heading(accountTitles[view]) + (state.session.signedIn
     ? '<p class="empty" role="status">Loading your account…</p>' : signIn(view));
   if (state.session.signedIn) loadAccount(view, id);
 }
 else if (id === 1 && main.firstElementChild) html = null;
 else html = landing();
 rentalMap?.destroy();
 rentalMap = undefined;
 main.classList.toggle('browsing', browseViews.includes(view));
 if (stickyToolbar) stickySizes.unobserve(stickyToolbar);
 if (html !== null) main.innerHTML = html;
 stickyToolbar = main.querySelector('.result-toolbar');
 if (stickyToolbar) stickySizes.observe(stickyToolbar);
 reflectSaved();
 reflectNav(view);
 if (browseViews.includes(view)) {
   main.querySelector('#result-search').elements.area.value = resultFilters(view).area;
   setResultView();
 }
 if ((browseViews.includes(view) || view === 'advert') && !adsRequest) {
   adsRequest = loadAds().then(refreshResults);
 }
 if (!mirror && sessionViews.includes(view) && !sessionRequest) {
   sessionRequest = loadSession().then(() => {
     if (sessionViews.includes(state.view)) render();
     if (!state.session.signedIn || state.view !== 'plans') return;
     api('account').then(out => {
       state.paidPasses = out.passes || [];
       if (state.view === 'plans') render();
     }).catch(() => {});
     const checkout = new URLSearchParams(location.search).get('checkout');
     if (checkout === 'return') say('Your test pass will appear in your account once Stripe confirms the test payment.');
     if (checkout === 'cancel') say('You cancelled Stripe test checkout.');
   });
 }
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
 const messages = '<h2 class="results-head">'+icon('message')+' Received enquiries</h2><div class="rows">'+(out.inbox.map(m=>message(m,true)).join('')||'<p class="empty">No enquiries yet.</p>')+'</div><h2 class="results-head">'+icon('send')+' Sent enquiries</h2><div class="rows">'+(out.sent.map(m=>message(m,false)).join('')||'<p class="empty">You haven’t sent any enquiries yet.</p>')+'</div>';
 if (view === 'messages') {
   main.innerHTML = heading('Messages', 'Read and reply to enquiries about adverts.') + messages;
   return;
 }
 main.innerHTML=heading('Your account','Manage your adverts and see the enquiries you’ve sent and received.')+'<div class="actions"><button class="btn primary" data-nav="post">Post an advert</button>'+(out.reviewer?'<button class="btn outline" data-nav="review">Review adverts</button>':'')+'<a class="link-button" target="_top" href="/signout-with-chatgpt?return_to=%2F">'+icon('logOut',16)+' Sign out</a></div><h2 class="results-head">'+icon('home')+' Your adverts</h2><div class="rows">'+(out.ads.map(a=>'<div class="item"><div><small class="badge">'+e(advertStates[a.expires<=Date.now()/1000?'expired':a.status]||'Status unavailable')+'</small><h3>'+e(a.title)+'</h3><p>'+icon('calendar',16)+' Expires '+dateMarkup(a.expires)+' · '+e(a.area)+'</p></div>'+buttons(a.id,'data-withdraw','Withdraw')+'</div>').join('')||'<p class="empty">Adverts you submit will appear here.</p>')+'</div>'+messages+(out.passes.length?'<h2 class="results-head">'+icon('ticket')+' Stripe test passes</h2>'+out.passes.map(p=>'<p>'+e(plans[p.product]?.name)+' · Expires '+dateMarkup(p.expires)+'</p>').join(''):'')+'<button class="link-button danger" data-erase>Delete my LetMallow records</button>';
 }catch(err){if(id===renderID)main.innerHTML=heading(accountTitles[view])+'<div class="empty" role="alert">'+e(err.message)+' <button class="link-button" data-refresh>Try again</button></div>';}}
function details(id){
 if(state.adsLoading)return heading('Opening advert')+'<p class="empty" role="status">Loading the advert…</p>';
 if(state.loadError)return heading('We couldn’t load the advert')+adRows([]);
 const a=state.ads.find(x=>x.id===id);if(!a)return heading('Advert unavailable','This advert may have expired or been withdrawn.')+'<button class="btn outline" data-nav="community">Browse community adverts</button>';
 const dest=mirror?canonical+urlFor('advert',{id:a.id}):'/signin-with-chatgpt?return_to='+encodeURIComponent(urlFor('advert',{id:a.id}));
 return heading(a.title, a.area + ' · ' + a.nation) + `<div class="advert-detail">
   <div class="detail-main">
     ${a.kind === 'wanted' ? '' : `<section class="property-gallery" aria-labelledby="photos-title">
       <h2 id="photos-title">Property photos</h2>
       <div class="gallery-placeholder">${icon('image', 32)}<p>No property photos were supplied.</p></div>
     </section>`}
     <section class="box stack" aria-labelledby="description-title">
       <h2 id="description-title">About this advert</h2>
       <p class="adtext">${e(a.body)}</p>
       <small>Advert reference ${e(a.id)} · Expires ${dateMarkup(a.expires)}</small>
     </section>
   </div>
   <aside class="box stack detail-contact" aria-labelledby="enquiry-title">
     <h2 id="enquiry-title">${a.kind === 'wanted' ? 'Rental budget' : 'Rent and bills'}</h2>
     <p class="ad-price">${a.kind === 'wanted' ? 'Budget of ' : ''}<strong>${money(a.rent)}</strong> a month</p>
     <p>${e(billsText[a.bills] || 'Bills to confirm')}</p>
     <p class="muted">${icon('shield', 16)} Reviewed by LetMallow</p>
     <div class="actions">${state.session.signedIn ? buttons(a.id, 'data-enquire', 'Send a free enquiry', 'primary') : `<a class="btn primary" target="_top" href="${e(dest)}">Sign in to enquire for free</a>`}
     ${external(feedback, 'Report this advert')}</div>
   </aside>
 </div>`;
}
function openSmart(){modal('Try smart search','<p>Tell us where you want to live, what kind of home you need and your monthly budget. You can change the suggested filters before you search again.</p><form class="form" id="smart-form"><label>What are you looking for?<textarea required name="query" maxlength="200" placeholder="A room in Cardiff for up to £750 a month"></textarea></label><div class="actions"><button type="button" class="link-button" data-example>Use an example</button></div><button class="btn primary">Suggest search filters</button></form>');}
function formAction(title,desc,op,data){
 const destructive = op === 'erase' || op === 'withdraw' || (op === 'moderate' && data.decision !== 'approve');
 modal(title,'<p>'+e(desc)+'</p><div class="actions dialog-actions"><button class="btn outline" data-close>Cancel</button><button class="btn '+(destructive?'danger':'primary')+'" id="confirm-action">Confirm</button></div>');
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
 if (d.filter) {
   modal('Search filters', searchForm({id: 'filter-form', inDialog: true}), 'filter-dialog');
   const form = panel.querySelector('form');
   setFields(form, resultFilters(state.view));
   form.elements.area.value = main.querySelector('#result-search').elements.area.value;
   if (d.filter === 'all') dialog.querySelector('.close').focus();
   else form.elements[d.filter].focus();
   return;
 }
 if ('toggleMap' in d) {
   if (!prefersMap) listScroll = window.scrollY;
   prefersMap = !prefersMap;
   setResultView();
   if (prefersMap) {
     const map = main.querySelector('#result-map');
     map.scrollIntoView({block: 'start'});
     map.focus({preventScroll: true});
   } else {
     window.scrollTo(0, listScroll);
     main.querySelector('#result-feed').focus({preventScroll: true});
   }
   return;
 }
 if ('retryMap' in d) {
   void mountMap(main.querySelector('#map-content'));
   return;
 }
 if (d.mapArea) {
   go(state.view, {...resultFilters(state.view), area: d.mapArea});
   return;
 }
 if(d.nav){
   dropdown.open = false;
   if(d.nav==='smart'){openSmart();return;}
   if(d.nav==='menu'){modal('Navigation', navigationLinks());desktopMenu.setAttribute('aria-expanded','true');return;}
   go(d.nav);return;
 }
 if(d.place){const p=places.find(x=>x.id===d.place);if(p)go('search',{area:label(p)});return;}
 if(d.save){const on=saved.includes(d.save);saved=on?saved.filter(x=>x!==d.save):[...saved,d.save];const persisted=store.write('places',saved);if(state.view==='saved')render();else reflectSaved();say((on?'Area removed.':'Area saved.')+(persisted?'':' This change lasts until you close the page.'));return;}
 if(d.role){state.role=d.role;render();return;}if(d.sim){simulation(d.sim);return;}
 if('example' in d){panel.querySelector('textarea').value='A flat in Cardiff for up to £1,000 a month';panel.querySelector('textarea').focus();return;}
 if ('refresh' in d) {
   if (browseViews.includes(state.view)) {
     adsRequest = loadAds().then(refreshResults);
     refreshResults();
     return;
   }
   adsRequest = loadAds();
   sessionRequest = loadSession();
   render();
   await Promise.all([adsRequest, sessionRequest]);
   render();
   return;
 }
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
 const f=ev.target;if(!['search-form','result-search','filter-form','smart-form','ad-form','msg-form'].includes(f.id))return;ev.preventDefault();
 const data=fm(f);
 if (['search-form', 'result-search', 'filter-form'].includes(f.id)) {
   const selection = {...resultFilters(state.view), ...data, area: data.area.trim()};
   const view = state.view === 'community' ? 'community' : selection.kind === 'wanted' ? 'wanted' : 'search';
   go(view, selection);
   return;
 }
 if (f.id === 'smart-form') {
   const button = f.querySelector('.primary');
   button.disabled = true;
   try {
     const {interpret} = await import('./smart-search.mjs');
     if (!f.isConnected || !dialog.open) return;
     const parsed = interpret(data.query);
     go('search', parsed);
     say(parsed.area || parsed.max || parsed.kind !== 'any' ? 'We’ve applied the suggested filters. You can change them in the results.' : 'We couldn’t suggest filters. Try adding a town, home type or monthly budget.');
   } catch {
     panel.querySelector('.error').textContent = 'Smart search could not load. Try again.';
   } finally {
     button.disabled = false;
   }
   return;
 }
 const button=f.querySelector('button[type=submit],button.primary');button.disabled=true;
 try{if(f.id==='ad-form'){await api('submit',{...data,authority:f.elements.authority.checked});go('account');say('We’ve received your advert for review.');}
 else{await api(f.dataset.mode,{id:f.dataset.id,shareContact:!!f.elements.shareContact?.checked,[f.dataset.mode==='answer'?'answer':'question']:data.message});go(state.view === 'messages' ? 'messages' : 'account');say('Message sent.');}}
 catch(err){const errBox=f.querySelector('.error')||panel.querySelector('.error');if(errBox)errBox.textContent=err.message;else say(err.message);button.disabled=false;}
});
function dismissDropdownOutside(event) {
  if (dropdown.open && !dropdown.contains(event.target)) dropdown.open = false;
}
document.addEventListener('click', dismissDropdownOutside);
document.addEventListener('focusin', dismissDropdownOutside);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !dropdown.open) return;
  dropdown.open = false;
  if (dropdown.contains(event.target)) dropdown.querySelector('summary').focus();
});
matchMedia('(min-width: 768px)').addEventListener('change', () => { dropdown.open = false; });
dialog.addEventListener('close', () => desktopMenu.removeAttribute('aria-expanded'));
window.addEventListener('popstate',()=>{leave();dropdown.open=false;prefersMap=false;render();});
dialog.addEventListener('click',ev=>{if(ev.target===dialog){const r=dialog.getBoundingClientRect();if(ev.clientX<r.left||ev.clientX>r.right||ev.clientY<r.top||ev.clientY>r.bottom)leave();}});
render();
