import {plans} from '../public/market/domain.mjs';
import {assert,DAY,readBounded} from './rules.mjs';
export const ready=env=>/^sk_test_/.test(env.STRIPE_TEST_SECRET_KEY||'')&&/^whsec_/.test(env.STRIPE_TEST_WEBHOOK_SECRET||'');
export async function checkout(db,user,b,env,origin,now,send=fetch){
 assert(ready(env),503,'Connect Stripe sandbox to start a test checkout. The plan simulator is available.');
 assert(Object.hasOwn(plans,b.product)&&/^[a-f0-9-]{36}$/.test(b.requestId||''),400,'Invalid test order.');
 const product=plans[b.product],id=b.requestId;
 await db.run('INSERT INTO orders (id,owner,product,amount,created) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING',[id,user.id,b.product,product.amount,now]);
 const [order]=await db.rows('SELECT * FROM orders WHERE id=?',[id]);
 assert(order.owner===user.id&&order.product===b.product&&now-order.created<DAY,409,'Start a new test order.');
 const params={mode:'payment','payment_method_types[0]':'card',client_reference_id:id,'metadata[order]':id,'metadata[product]':b.product,'line_items[0][price_data][currency]':'gbp','line_items[0][price_data][unit_amount]':String(product.amount),'line_items[0][price_data][product_data][name]':product.name+' · 30-day test pass','line_items[0][quantity]':'1',success_url:origin+'/?view=plans&checkout=return',cancel_url:origin+'/?view=plans&checkout=cancel'};
 const res=await send('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:'Bearer '+env.STRIPE_TEST_SECRET_KEY,'Idempotency-Key':'rental-'+id,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params)});
 assert(res.ok,502,'Stripe could not start checkout. You can retry safely.');const out=await res.json();assert(out.livemode===false&&/^https:\/\/checkout\.stripe\.com\//.test(out.url||''),502,'Unexpected Stripe response.');return {url:out.url};
}
export async function webhook(req,db,env,now){
 assert(ready(env),503,'Stripe test mode is offline.');const raw=await readBounded(req,150000);
 const sig=(req.headers.get('stripe-signature')||'').split(','),ts=Number(sig.find(s=>s.startsWith('t='))?.slice(2));assert(Number.isInteger(ts)&&Math.abs(now-ts)<=300,400,'Invalid signature time.');
 const enc=new TextEncoder(),key=await crypto.subtle.importKey('raw',enc.encode(env.STRIPE_TEST_WEBHOOK_SECRET),{name:'HMAC',hash:'SHA-256'},false,['verify']);
 let valid=false;for(const v of sig.filter(s=>/^v1=[\da-f]{64}$/.test(s))){const bytes=Uint8Array.from(v.slice(3).match(/../g),x=>parseInt(x,16));if(await crypto.subtle.verify('HMAC',key,bytes,enc.encode(ts+'.'+raw)))valid=true;}
 assert(valid,400,'Invalid signature.');let e;try{e=JSON.parse(raw)}catch{assert(false,400,'Invalid event.');}
 assert(e.livemode===false,400,'Test events only.');
 if(!['checkout.session.completed','checkout.session.async_payment_succeeded'].includes(e.type))return {received:true};
 const s=e.data?.object;assert(s&&s.livemode===false&&s.mode==='payment'&&/^cs_test_/.test(s.id),400,'Test sessions only.');if(s.payment_status!=='paid')return {received:true};
 const [r]=await db.rows('SELECT * FROM orders WHERE id=?',[s.client_reference_id||'']);
 assert(r&&s.metadata?.order===r.id&&s.metadata.product===r.product&&s.currency==='gbp'&&Number(r.amount)===s.amount_total&&Number.isSafeInteger(e.created),400,'Checkout mismatch.');
 await db.run('INSERT INTO passes (id,order_id,owner,product,expires) VALUES (?,?,?,?,?) ON CONFLICT DO NOTHING',[s.id,r.id,r.owner,r.product,e.created+30*DAY]);return {received:true};
}
