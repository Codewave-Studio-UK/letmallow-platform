import assert from 'node:assert/strict';
import {test} from 'node:test';
import {setImmediate} from 'node:timers/promises';

async function openPage(view, send) {
  const main = {classList: {toggle() {}}, querySelector() {return null;}};
  let click;
  const globals = {
    document: {
      querySelector(selector) {
        if (selector === '#content') return main;
        if (selector === '#panel') return {addEventListener() {}};
        return null;
      },
      querySelectorAll() {return [];},
      addEventListener(event, handler) {if (event === 'click') click = handler;},
    },
    fetch: send,
    location: new URL('https://example.test/?view=' + view + '&id=synthetic'),
    matchMedia: () => ({addEventListener() {}}),
    window: {addEventListener() {}},
  };
  const originals = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  Object.assign(globalThis, globals);
  await import('../public/market/app.mjs?view=' + view);
  await setImmediate();

  return {
    content: () => main.innerHTML,
    retry() {
      const action = main.innerHTML.match(/data-(refresh(?:-ads)?)>Try again/);
      assert.ok(action);
      const dataset = action[1] === 'refresh-ads' ? {refreshAds: ''} : {refresh: ''};
      return click({target: {closest: () => ({dataset})}});
    },
    restore() {
      for (const [key, original] of originals) {
        if (original) Object.defineProperty(globalThis, key, original);
        else delete globalThis[key];
      }
    },
  };
}

test('account retry recovers without requesting community adverts', async t => {
  const requests = [];
  const page = await openPage('account', async url => {
    requests.push(url);
    if (url === '/api/homes') return new Promise(() => {});
    if (url === '/api/account') return Response.json({ads: [], inbox: [], sent: [], passes: []});
    if (requests.length === 1) return Response.json({}, {status: 503});
    return Response.json({signedIn: true, reviewer: false, stripe: false});
  });
  t.after(page.restore);

  assert.match(page.content(), /We couldn’t check if you’re signed in/);
  void page.retry();
  assert.match(page.content(), /Checking your account/);
  await setImmediate();
  assert.deepEqual(requests, ['/api/session', '/api/session', '/api/account']);
  assert.match(page.content(), /Received enquiries/);
});

test('advert retry recovers without repeating the session check', async t => {
  const requests = [];
  const page = await openPage('advert', async url => {
    requests.push(url);
    if (url === '/api/session') return Response.json({signedIn: false, reviewer: false, stripe: false});
    if (requests.length === 1) return Response.json({}, {status: 503});
    return Response.json({ads: []});
  });
  t.after(page.restore);

  assert.match(page.content(), /We couldn’t load the advert/);
  void page.retry();
  assert.match(page.content(), /Loading the advert/);
  await setImmediate();
  assert.deepEqual(requests, ['/api/homes', '/api/session', '/api/homes']);
  assert.match(page.content(), /Advert unavailable/);
});
