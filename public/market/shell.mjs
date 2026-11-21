import {places,label,feedback,date} from './domain.mjs';
import {icon} from './icons.mjs';

export {icon} from './icons.mjs';
export const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const logo = '<img src="/market/brand/letmallow-lockup.svg" alt="LetMallow" width="318" height="75">';
const alphaBadge = `<span class="alpha">${icon('flask',16)}<span>Alpha</span></span>`;
const accountIcon = `<span class="nav-avatar-icon">${icon('user',20)}</span>`;

export function navigationLinks({ includeShortcuts = false } = {}) {
  const pages = [
    ['home', 'Explore'], ['areas', 'All areas'], ['wanted', 'Wanted adverts'],
    ['post', 'Post an advert'], ['plans', 'Plans'], ['account', 'Your account'],
  ];
  if (includeShortcuts) pages.splice(3, 0, ['saved', 'Saved areas'], ['messages', 'Messages']);
  return `<nav class="panel-menu" aria-label="Pages">
    ${pages.map(([view, title]) => `<button type="button" data-nav="${view}">${title}</button>`).join('')}
  </nav><div class="menu-alpha">${alphaBadge}</div>`;
}
export function placePhoto(place, sizes, alt = place.alt) {
  const source = '/market/places/' + place.image;
  return `<img src="${e(source)}" srcset="${e(source.replace('.webp', '-480.webp'))} 480w, ${e(source)} 800w" sizes="${sizes}" alt="${e(alt)}" width="800" height="600" loading="lazy" decoding="async">`;
}

export const card=p=>`<article class="place-card"><button class="place-image" data-place="${p.id}" aria-label="Find rentals in ${e(label(p))}">${placePhoto(p, '(min-width: 1024px) 320px, (min-width: 768px) 30vw, (min-width: 640px) 46vw, calc(100vw - 24px)')}</button><button class="save-place" data-save="${p.id}" aria-label="Save ${e(label(p))}" aria-pressed="false">${icon('heart',16)}</button><button class="place-caption" data-place="${p.id}"><span><small>${p.nation}</small><strong>${e(label(p))}</strong></span><span class="round-arrow">${icon('arrow',16)}</span></button></article>`;

export function locationField(id) {
  return `<label class="search-field location">${icon('pin',20)}<span><b>Location</b><input name="area" maxlength="80" placeholder="Town, city or island" list="${id}-towns" autocomplete="off"></span></label><datalist id="${id}-towns">${places.map(p=>`<option value="${e(label(p))}">`).join('')}<option value="Isles of Scilly"><option value="Swansea"></datalist>`;
}

export function searchForm({id = 'search-form', inDialog = false} = {}) {
  return `<form class="${inDialog ? 'form filters-form' : 'search-form'}" id="${id}">${locationField(id)}<label class="search-field">${icon('home',20)}<span><b>Property type</b><select name="kind"><option value="any">All properties</option><option value="room">Rooms</option><option value="flat">Flats</option><option value="house">Houses</option><option value="wanted">Wanted adverts</option></select></span>${icon('down',16)}</label><label class="search-field">${icon('wallet',20)}<span><b>Monthly budget</b><select name="max"><option value="">Any budget</option>${[500,750,1000,1250,1500,2000,2500,3000].map(n=>'<option value="'+n+'">Up to £'+n.toLocaleString('en-GB')+'</option>').join('')}</select></span>${icon('down',16)}</label><button type="submit" class="btn primary">${inDialog ? 'Apply filters' : icon('search',20) + ' Search'}</button>${inDialog ? '<button type="reset" class="link-button">Clear filters</button>' : ''}</form>`;
}
export function dateMarkup(seconds) {
  const timestamp = new Date(seconds * 1000).toISOString();
  return `<time datetime="${timestamp}">${date(seconds)}</time>`;
}

export function hero({title, description, image, action, landing = false}) {
  const variants = image?.variants ?? [640];
  const sourceSet = image ? `srcset="${variants.map(width => e(image.src.replace('.webp', '-' + width + '.webp')) + ' ' + width + 'w').join(', ')}, ${e(image.src)} ${image.width}w" sizes="${landing ? '100vw' : '(min-width: 1440px) 1392px, 95vw'}"` : '';
  const media = image ? `<img class="hero-image" src="${e(image.src)}" ${sourceSet} width="${image.width}" height="${image.height}" alt="${e(image.alt)}" decoding="async" style="--hero-position: ${e(image.position ?? '50% 50%')}; --hero-mobile-position: ${e(image.mobilePosition ?? image.position ?? '50% 50%')}" fetchpriority="high">` : '';
  const button = action ? `<button class="hero-action ${landing ? 'btn primary' : 'link-button'}" type="button" data-nav="${e(action.view)}">${e(action.label)}</button>` : '';
  return `<section class="hero ${landing ? 'hero--landing' : 'hero--compact'}${image ? '' : ' hero--no-image'}">
    ${media}
    <div class="hero-text">
      ${landing ? '' : button}
      <h1>${e(title)}</h1>
      ${description ? `<p>${e(description)}</p>` : ''}
      ${landing ? button : ''}
    </div>
  </section>`;
}

export function landing(){return `${hero({
    title: 'Find a place that feels like home.',
    description: 'Rooms, flats and houses to rent across England and Wales, from city neighbourhoods to island communities.',
    image: {
      src: '/market/brand/bedroom.webp', width: 1200, height: 675, variants: [640, 840],
      alt: 'A bright double bedroom with a grey headboard, green throw and a window onto the garden',
      position: '65% 50%', mobilePosition: '65% 50%',
    },
    action: { label: 'Try smart search', view: 'smart' },
    landing: true,
  })}<div class="search-wrap">${searchForm()}</div><section class="explore"><div class="section-head"><div><h2>Explore by location</h2><p>Open rental searches for a town, city or island.</p></div><button class="link-button" data-nav="areas">View all areas ${icon('arrow',16)}</button></div><div class="grid">${['london','cardiff','manchester','bristol'].map(id=>card(places.find(p=>p.id===id))).join('')}</div></section><section class="community"><div class="tile-icon">${icon('home',24)}</div><div><h2>Community adverts</h2><p>Find homes to rent and adverts from people looking for a home.</p></div><button class="btn outline" data-nav="community">Browse adverts ${icon('arrow',16)}</button></section>`;}
export function shell({showLanding = true} = {}) {
  return `<a class="skip" href="#content">Skip to content</a>
  <header class="site-header">
    <nav class="nav-wrap" aria-label="Main navigation">
      <a class="brand" href="/" aria-label="LetMallow home">${logo}</a>
      <div class="nav-links">
        <button class="nav-link" type="button" data-nav="home">Explore</button>
        <button class="nav-link" type="button" data-nav="wanted">Wanted adverts</button>
        <button class="nav-link" type="button" data-nav="plans">Plans</button>
      </div>
      <div class="nav-actions">
        <button class="nav-action nav-shortcut saved" type="button" data-nav="saved" aria-label="Saved areas">${icon('heart',20)}<span>Saved</span></button>
        <button class="nav-action nav-shortcut" type="button" data-nav="messages" aria-label="Messages">${icon('message',20)}<span>Messages</span></button>
        <button class="nav-action nav-avatar nav-desktop-menu" type="button" data-nav="menu" aria-label="Open account and navigation menu" aria-haspopup="dialog" aria-controls="panel">
          ${accountIcon}
        </button>
        <details class="nav-dropdown">
          <summary class="nav-action" aria-label="Navigation menu">${icon('menu',24)}</summary>
          <div class="nav-dropdown-panel">${navigationLinks({ includeShortcuts: true })}</div>
        </details>
      </div>
    </nav>
  </header>
  <main id="content" tabindex="-1">${showLanding ? landing() : ''}</main>
  <footer><div><a class="brand" href="/" aria-label="LetMallow home">${logo}</a><span>A Codewave Studio alpha</span><div class="foot-links"><button class="link-button" data-nav="privacy">Privacy and safety</button><a class="link-button" href="${feedback}" target="_blank" rel="noopener noreferrer">Feedback and reports ${icon('external',16)}</a></div></div></footer>
  <dialog id="panel" aria-labelledby="dialog-title"><button class="circle close" aria-label="Close dialog" data-close>${icon('close',24)}</button><div id="panel-body"></div></dialog>
  <div id="notice" role="status" aria-live="polite"></div>`;
}
