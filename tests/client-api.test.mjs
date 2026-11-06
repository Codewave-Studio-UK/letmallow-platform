import {test} from 'node:test';
import assert from 'node:assert/strict';
import {requestMarketplace} from '../public/market/client-api.mjs';
import {marketStore} from '../market/store.mjs';

test('marketplace client keeps writes same-origin and does not retry a denied request', async()=>{
 let attempts=0;
 await assert.rejects(requestMarketplace('enquire',{id:'synthetic'},{send:async(url,request)=>{
  attempts++;
  assert.equal(url,'/api/enquire');
  assert.equal(request.method,'POST');
  assert.equal(request.credentials,'same-origin');
  assert.equal(request.cache,'no-store');
  assert.deepEqual(JSON.parse(request.body),{id:'synthetic'});
  assert(request.signal instanceof AbortSignal);
  return Response.json({error:'Sign in to continue.'},{status:401});
 }}),/Sign in to continue/);
 assert.equal(attempts,1);
});

test('slow reads expire and a timed-out write asks the user to check their account', async()=>{
 const hold=setTimeout(()=>{},1000);
 let attempts=0;
 const stalled=async(url,{signal})=>new Promise((resolve,reject)=>{
  attempts++;
  signal.addEventListener('abort',()=>reject(signal.reason),{once:true});
 });
 try{
  await assert.rejects(requestMarketplace('homes',undefined,{send:stalled,timeoutMs:5}),/provider search links/);
  await assert.rejects(requestMarketplace('submit',{synthetic:true},{send:stalled,timeoutMs:5}),/Check Your account/);
  assert.equal(attempts,2);
 }finally{clearTimeout(hold);}
});

test('unavailable or non-JSON services do not expose transport details',async()=>{
 for(const send of [async()=>new Response('<html>Proxy failure</html>'),async()=>Response.json(null),async()=>{throw new TypeError('internal host details');}]){
  await assert.rejects(requestMarketplace('homes',undefined,{send}),error=>error.message.includes('marketplace service is unavailable')&&!error.message.includes('internal host'));
 }
 assert.deepEqual(await requestMarketplace('homes',undefined,{send:async()=>Response.json({ads:[]})}),{ads:[]});
});

test('an invalid database selection or a failing Neon writer never falls back to D1',async()=>{
 let d1Calls=0;
 const binding={prepare(){d1Calls++;throw Error('D1 must not be touched');}};
 for(const backend of ['','neonn','NEON'])assert.throws(()=>marketStore({DATABASE_BACKEND:backend},binding),/Unsupported database backend/);
 assert.throws(()=>marketStore({DATABASE_BACKEND:'neon'},binding));
 const db=marketStore({DATABASE_BACKEND:'neon',DATABASE_URL:'postgresql://demo:example@ep-test.eu-west-2.aws.neon.tech/demo'},binding,async()=>new Response(null,{status:503}));
 await assert.rejects(db.rows('SELECT id FROM ads'),/Neon query failed/);
 assert.equal(d1Calls,0);
 assert.equal(typeof marketStore({},binding).rows,'function');
 assert.equal(typeof marketStore({DATABASE_BACKEND:'d1'},binding).run,'function');
});
