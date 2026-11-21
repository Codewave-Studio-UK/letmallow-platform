import {label, money, normalise, places} from './domain.mjs';
import {e, icon} from './shell.mjs';

const width = 420;
const height = 520;
const coordinates = {
  london: [-0.1187, 51.5019],
  manchester: [-2.2487, 53.4753],
  cardiff: [-3.1676, 51.4826],
  bristol: [-2.5833, 51.45],
  anglesey: [-4.36, 53.28],
  'isle-of-wight': [-1.30, 50.68],
};
const placeNames = new Map(places.map(place => [normalise(label(place)), place.id]));
placeNames.set('ynys mon', 'anglesey');
placeNames.set('caerdydd', 'cardiff');

export function mapArea(value) {
  const parts = String(value).split(',');
  for (const part of parts) {
    const id = placeNames.get(normalise(part));
    if (id) return id;
  }
}

export function mapAreas(filter, adverts) {
  const selected = mapArea(filter.area);
  const groups = new Map();
  for (const advert of adverts) {
    const area = mapArea(advert.area);
    if (!area) continue;
    if (!groups.has(area)) groups.set(area, []);
    groups.get(area).push(advert);
  }
  return places
    .filter(place => !filter.area || place.id === selected || groups.has(place.id))
    .map(place => ({place, adverts: groups.get(place.id) || []}));
}

function point(id) {
  const [lon, lat] = coordinates[id];
  return [(lon + 7.3) * 45, (56.3 - lat) * 75];
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function createRentalMap(container) {
  container.innerHTML = `
    <p class="map-intro" id="map-help">Select an area to see matching adverts or browse rental searches. Pins show approximate areas.</p>
    <div class="map-stage" tabindex="0" role="region" aria-label="Map of England and Wales" aria-describedby="map-help map-keys">
      <span class="visually-hidden" id="map-keys">Use the arrow keys to move, plus and minus to zoom, or Home to reset.</span>
      <img class="map-image" src="/market/map/england-wales.svg" width="420" height="520" alt="">
      <div class="map-pins"></div>
      <div class="map-controls" aria-label="Map controls" role="group">
        <button type="button" data-zoom="in" aria-label="Zoom in">${icon('plus')}</button>
        <button type="button" data-zoom="out" aria-label="Zoom out">${icon('minus')}</button>
        <button type="button" data-zoom="reset">Reset</button>
      </div>
      <span class="map-credit">Natural Earth</span>
    </div>
    <p class="empty" id="map-empty" hidden>No mapped areas match this search. Check the list for adverts and rental websites.</p>
    <div class="map-info" id="map-info" hidden></div>
    <span class="visually-hidden" role="status" id="map-status"></span>`;
  const stage = container.querySelector('.map-stage');
  const image = container.querySelector('.map-image');
  image.addEventListener('error', () => {
    container.querySelector('#map-help').textContent = 'The background map is unavailable. You can still select an area.';
  });
  const pins = container.querySelector('.map-pins');
  const info = container.querySelector('#map-info');
  const empty = container.querySelector('#map-empty');
  const status = container.querySelector('#map-status');
  const zoomIn = container.querySelector('[data-zoom="in"]');
  const zoomOut = container.querySelector('[data-zoom="out"]');
  let zoom = 1;
  let centreX = width / 2;
  let centreY = height / 2;
  let scale = 1;
  let drag;
  let groups = [];
  let selected;
  let community = false;
  let loadState = {};

  function draw() {
    // Map and pins use the same projection. Buttons stay the same size at every zoom.
    scale = Math.min(stage.clientWidth / width, stage.clientHeight / height) * zoom;
    if (!scale) return;
    const left = stage.clientWidth / 2 - centreX * scale;
    const top = stage.clientHeight / 2 - centreY * scale;
    image.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    for (const pin of pins.children) {
      const [x, y] = point(pin.dataset.pin);
      const px = left + x * scale;
      const py = top + y * scale;
      pin.style.left = px + 'px';
      pin.style.top = py + 'px';
      pin.hidden = px < 12 || px > stage.clientWidth - 12 || py < 12 || py > stage.clientHeight - 12;
    }
    zoomIn.disabled = zoom === 4;
    zoomOut.disabled = zoom === 1;
  }

  function zoomMap(action) {
    if (action === 'reset') {
      zoom = 1;
      centreX = width / 2;
      centreY = height / 2;
    } else {
      zoom = clamp(action === 'in' ? zoom * 1.5 : zoom / 1.5, 1, 4);
    }
    draw();
  }

  function pan(x, y) {
    centreX = clamp(centreX + x, 0, width);
    centreY = clamp(centreY + y, 0, height);
    draw();
  }

  function showArea(id, announce = false) {
    selected = id;
    for (const pin of pins.children) pin.setAttribute('aria-pressed', String(pin.dataset.pin === selected));
    const group = groups.find(entry => entry.place.id === id);
    info.hidden = !group;
    if (!group) return;
    const name = label(group.place);
    const count = group.adverts.length;
    const list = count ? `<ul>${group.adverts.slice(0, 3).map(ad => `<li><button class="link-button" type="button" data-ad="${e(ad.id)}">${e(ad.title)} · ${money(ad.rent)}/month</button></li>`).join('')}</ul>` : '';
    const summary = loadState.loading ? 'Loading community adverts…' : loadState.failed ? 'Community adverts are unavailable'
      : count === 1 ? '1 matching community advert' : count + ' matching community adverts';
    info.innerHTML = `<h3>${e(name)}</h3><p>${summary}</p>${list}
      <button class="btn outline" type="button" data-map-area="${e(name)}">${community ? 'Filter adverts to' : 'Search in'} ${e(name)}</button>`;
    if (announce) status.textContent = name + '. ' + summary + '.';
  }

  function update(filter, adverts, view, state) {
    loadState = state;
    const next = mapAreas(filter, adverts);
    const previous = groups.map(group => group.place.id).join();
    groups = next;
    community = view === 'community';
    const ids = groups.map(group => group.place.id).join();
    if (ids !== previous) {
      pins.innerHTML = groups.map(({place}) => `<button class="map-pin" type="button" data-pin="${place.id}" data-label="${e(label(place))}" aria-label="${e(label(place))}" aria-pressed="false">${e(label(place))}</button>`).join('');
    }
    empty.hidden = groups.length > 0;
    const area = mapArea(filter.area);
    showArea(selected || area);
    draw();
  }

  const observer = new ResizeObserver(draw);
  observer.observe(stage);
  stage.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button?.dataset.zoom) zoomMap(button.dataset.zoom);
    if (button?.dataset.pin) showArea(button.dataset.pin, true);
  });
  stage.addEventListener('keydown', event => {
    if (event.target !== stage) return;
    const movement = {ArrowLeft: [-25, 0], ArrowRight: [25, 0], ArrowUp: [0, -25], ArrowDown: [0, 25]}[event.key];
    if (movement) pan(...movement);
    else if (['+', '=', '-', 'Home'].includes(event.key)) zoomMap(event.key === 'Home' ? 'reset' : event.key === '-' ? 'out' : 'in');
    else return;
    event.preventDefault();
  });
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0 || event.target.closest('button') || !scale) return;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
    stage.setPointerCapture(event.pointerId);
  });
  stage.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId || !scale) return;
    pan((drag.x - event.clientX) / scale, (drag.y - event.clientY) / scale);
    drag = {id: drag.id, x: event.clientX, y: event.clientY};
  });
  stage.addEventListener('lostpointercapture', () => { drag = undefined; });

  return {update, destroy() { observer.disconnect(); }};
}
