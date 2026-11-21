import assert from 'node:assert/strict';
import {stat} from 'node:fs/promises';
import test from 'node:test';
import {mapArea, mapAreas} from '../public/market/rental-map.mjs';
import {landing} from '../public/market/shell.mjs';

test('area map groups public adverts at supported place centres only', () => {
  const bristol = {id: 'first', area: 'Clifton, Bristol'};
  const unmapped = {id: 'second', area: 'London Road'};
  assert.equal(mapArea('Yr Wyddgrug'), undefined);
  assert.equal(mapArea(unmapped.area), undefined);
  assert.equal(mapArea('Ynys Môn'), 'anglesey');
  assert.equal(mapArea('Caerdydd'), 'cardiff');
  const result = mapAreas({area: 'Bristol'}, [bristol, unmapped]);
  assert.deepEqual(result.map(group => group.place.id), ['bristol']);
  assert.deepEqual(result[0].adverts, [bristol]);
  assert.equal(mapAreas({area: 'Swansea'}, []).length, 0);
  assert.equal(mapAreas({area: ''}, []).length, 6);
});

test('landing markup includes real WebP variants and avoids eager map assets', async () => {
  const html = landing();
  assert.match(html, /bedroom-640\.webp 640w, \/market\/brand\/bedroom-840\.webp 840w/);
  const mobileSource = html.match(/<source media="\(width < 640px\)" srcset="([^"]+)"/)?.[1];
  assert.equal(mobileSource, '/market/brand/bedroom-640.webp 640w, /market/brand/bedroom-840.webp 840w');
  assert.match(html, /class="hero-image"[^>]+fetchpriority="high"/);
  assert.match(html, /london-480\.webp[^>]+loading="lazy"/);
  assert.doesNotMatch(html, /england-wales\.svg|rental-map\.mjs/);
  for (const path of new Set(html.match(/\/market\/[\w/.-]+\.webp/g))) {
    assert.ok((await stat(new URL('../public' + path, import.meta.url))).size > 0, path);
  }

  const mobileHero = await stat(new URL('../public/market/brand/bedroom-640.webp', import.meta.url));
  const fullHero = await stat(new URL('../public/market/brand/bedroom.webp', import.meta.url));
  const highDensityHero = await stat(new URL('../public/market/brand/bedroom-840.webp', import.meta.url));
  assert.ok(mobileHero.size < fullHero.size / 2);
  assert.ok(highDensityHero.size < fullHero.size / 2);
});
