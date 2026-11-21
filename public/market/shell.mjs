import {places,label,feedback,money} from './domain.mjs';
import {icon} from './icons.mjs';

export {icon} from './icons.mjs';
export const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const logo = `<picture>
  <source media="(prefers-color-scheme: dark)" srcset="/market/brand/letmallow-lockup-dark-bg.svg">
  <img src="/market/brand/letmallow-lockup.svg" alt="LetMallow" width="318" height="75">
</picture>`;

export const card=p=>`<article class="place-card"><button class="place-image" data-place="${p.id}" aria-label="Find rentals in ${e(label(p))}"><img src="/market/places/${p.image}" alt="${e(p.alt)}" width="800" height="600" loading="lazy"></button><button class="save-place" data-save="${p.id}" aria-label="Save ${e(label(p))}" aria-pressed="false">${icon('heart',16)}</button><button class="place-caption" data-place="${p.id}"><span><small>${p.nation}</small><strong>${e(label(p))}</strong></span><span class="round-arrow">${icon('arrow',16)}</span></button></article>`;
export function searchForm({ compact = false } = {}) {
  const budgets = [500, 750, 1000, 1250, 1500, 2000, 2500, 3000];
  return `<form class="search-form${compact ? ' search-form--compact' : ''}" id="search-form" aria-label="Rental search">
    <label class="search-field location">${icon('pin')}<span><b>Location</b><input id="search-area" name="area" maxlength="80" placeholder="Town, city or island" list="towns" autocomplete="off"></span></label>
    <datalist id="towns">${places.map(p => '<option value="' + e(label(p)) + '">').join('')}<option value="Isles of Scilly"><option value="Swansea"></datalist>
    <label class="search-field search-filter">${icon('home')}<span><b>Property type</b><select name="kind"><option value="any">All properties</option><option value="room">Rooms</option><option value="flat">Flats</option><option value="house">Houses</option><option value="wanted">Wanted ads</option></select></span>${icon('down',16)}</label>
    <label class="search-field search-filter">${icon('wallet')}<span><b>Monthly budget</b><select name="max"><option value="">Any budget</option>${budgets.map(n => '<option value="' + n + '">Up to ' + money(n) + '</option>').join('')}</select></span>${icon('down',16)}</label>
    <button type="submit" class="btn primary">${icon('search')} Search</button>
  </form>`;
}
export function landing() {
  return `<section class="hero">
    <img class="hero-image" src="/market/brand/bedroom.webp" width="1200" height="675" alt="A bright double bedroom with a grey headboard, green throw and a window onto the garden" fetchpriority="high">
    <div class="hero-text">
      <h1>Find a place that feels like home.</h1>
      <p>Rooms, flats and houses to rent across England and Wales, from city neighbourhoods to island communities.</p>
      <button class="smart" type="button" data-nav="smart">Try smart search</button>
    </div>
  </section>
  <div class="search-wrap">${searchForm()}</div>
  <section class="explore">
    <div class="section-head">
      <div><h2>Explore by location</h2><p>Go straight to live rental searches in each area.</p></div>
      <button class="link-button" data-nav="areas">View all areas ${icon('arrow',16)}</button>
    </div>
    <div class="grid">${['london','cardiff','manchester','bristol'].map(id=>card(places.find(p=>p.id===id))).join('')}</div>
  </section>
  <section class="community">
    <div class="tile-icon">${icon('home',24)}</div>
    <div><h2>Community adverts</h2><p>Browse adverts submitted directly by landlords and renters.</p></div>
    <button class="btn outline" data-nav="community">Browse adverts ${icon('arrow',16)}</button>
  </section>`;
}

export function shell(){return `<a class="skip" href="#content">Skip to content</a><header><div class="nav-wrap"><a class="brand" href="/" aria-label="LetMallow home">${logo}</a><nav aria-label="Main navigation"><button data-nav="home" class="nav-link current">Explore</button><button data-nav="wanted" class="nav-link">Wanted ads</button><button data-nav="plans" class="nav-link">Plans</button></nav><div class="nav-actions"><button class="saved" data-nav="saved" aria-label="Saved areas">${icon('heart',20)}<span>Saved</span></button><button class="btn primary post" data-nav="post">${icon('plus',16)} Post an advert</button><button class="circle account" data-nav="account" aria-label="Your account">${icon('user',20)}</button><button class="circle mobile" data-nav="menu" aria-label="Open navigation">${icon('menu',24)}</button></div></div></header><main id="content" tabindex="-1">${landing()}</main><footer><div><a class="brand" href="/" aria-label="LetMallow home">${logo}</a><span>A Codewave Studio alpha</span><div class="foot-links"><button data-nav="privacy">Privacy &amp; safety</button><a href="${feedback}" target="_blank" rel="noopener noreferrer">Feedback &amp; reports ${icon('external',16)}</a></div></div></footer><dialog id="panel" aria-labelledby="dialog-title"><button class="circle close" aria-label="Close dialog" data-close>${icon('close',20)}</button><div id="panel-body"></div></dialog><div id="notice" role="status" aria-live="polite"></div>`;}
