import {validateAd,assert,DAY,readBounded,HttpError} from './rules.mjs';
import {contactQuestions,contactReplies} from '../public/market/domain.mjs';
import {checkout,webhook,ready} from './stripe.mjs';
const fields='id,kind,nation,area,title,rent,body,bills,created,expires';
const reply=(obj,status=200)=>Response.json(obj,{status,headers:{'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'}});
export async function handle(req,{db,user,env={},now=Math.floor(Date.now()/1000),send=fetch}){
 try{
 const op=new URL(req.url).pathname.split('/').pop(),admin=!!(user&&env.REVIEWER_EMAIL&&env.REVIEWER_EMAIL.toLowerCase()===user.email.toLowerCase());
 if(req.method==='GET'&&op==='session')return reply({signedIn:!!user,reviewer:admin,stripe:ready(env)});
 if(req.method==='GET'&&op==='homes')return reply({ads:await db.rows("SELECT "+fields+" FROM ads WHERE status='live' AND expires>? ORDER BY created DESC LIMIT 500",[now])});
 if(req.method==='POST'&&op==='stripe-webhook')return reply(await webhook(req,db,env,now));
 assert(user,401,'Sign in to continue.');
 if(req.method==='GET'&&op==='account'){
  const [ads,inbox,sent,passes]=await Promise.all([
   db.rows('SELECT '+fields+',status FROM ads WHERE owner=? AND expires>? ORDER BY created DESC LIMIT 60',[user.id,now-30*DAY]),
   db.rows('SELECT e.id,e.question,e.answer,e.contact,a.title FROM enquiries e JOIN ads a ON e.ad=a.id WHERE a.owner=? AND e.created>? ORDER BY e.created DESC LIMIT 150',[user.id,now-60*DAY]),
   db.rows('SELECT e.id,e.question,e.answer,e.contact,a.title FROM enquiries e JOIN ads a ON e.ad=a.id WHERE e.sender=? AND e.created>? ORDER BY e.created DESC LIMIT 150',[user.id,now-60*DAY]),db.rows('SELECT product,expires FROM passes WHERE owner=? AND expires>?',[user.id,now])]);return reply({ads,inbox,sent,passes,reviewer:admin});
 }
 if(req.method==='GET'&&op==='queue'){assert(admin,403,'Only authorised reviewers can review adverts.');return reply({ads:await db.rows("SELECT "+fields+",proof,status FROM ads WHERE status IN ('pending','live') AND expires>? ORDER BY created DESC LIMIT 150",[now])});}
 assert(req.method==='POST',405,'This action is unavailable. Go back to LetMallow and try again.');assert(req.headers.get('origin')===new URL(req.url).origin,403,'We couldn’t confirm this request. Go back to LetMallow and try again.');
 assert((req.headers.get('content-type')||'').startsWith('application/json'),415,'We couldn’t read this request. Reload the page and try again.');
 let b;try{b=JSON.parse(await readBounded(req,8192));}catch(e){if(e instanceof HttpError)throw e;throw new HttpError(400,'We couldn’t read this request. Reload the page and try again.');}
 assert(b&&typeof b==='object'&&!Array.isArray(b),400,'We couldn’t read this request. Reload the page and try again.');
 if(op==='submit'){
  const a=validateAd(b),id=crypto.randomUUID();
  await db.batch([['DELETE FROM enquiries WHERE created<?',[now-60*DAY]],['DELETE FROM ads WHERE expires<?',[now-30*DAY]],['DELETE FROM passes WHERE expires<?',[now]],['DELETE FROM orders WHERE created<?',[now-65*DAY]],["UPDATE ads SET status='expired' WHERE expires<=? AND owner=? AND status IN ('live','pending')",[now,user.id]]]);
  const n=await db.run("INSERT INTO ads (id,owner,category,kind,nation,area,title,rent,body,bills,proof,status,created,expires) VALUES (?,?,?,?,?,?,?,?,?,?,?,'pending',?,?) ON CONFLICT DO NOTHING",[id,user.id,a.category,a.kind,a.nation,a.area,a.title,a.rent,a.body,a.bills,a.proof,now,now+30*DAY]);assert(n===1,409,'You already have an advert of this type, either published or waiting for review. Withdraw it before posting another.');return reply({id,status:'pending'},201);
 }
 if(op==='withdraw'){const n=await db.run('DELETE FROM ads WHERE id=? AND owner=?',[String(b.id),user.id]);assert(n===1,404,'We couldn’t find this advert. Check your account to see if it’s still there.');return reply({withdrawn:true});}
 if(op==='moderate'){assert(admin,403,'Only authorised reviewers can review adverts.');assert(['approve','reject','unpublish'].includes(b.decision),400,'Choose whether to approve, reject or unpublish the advert.');assert(b.decision!=='approve'||b.checked===true,400,'Confirm you’ve checked the advert before approving it.');
  const from=b.decision==='unpublish'?'live':'pending',to=b.decision==='approve'?'live':'rejected';
  const n=await db.run('UPDATE ads SET status=? WHERE id=? AND status=? AND expires>?',[to,String(b.id),from,now]);assert(n===1,409,'This advert has changed or expired. Reload the review queue before trying again.');return reply({status:to});}
 if(op==='enquire'){assert(contactQuestions.includes(b.question),400,'Choose a question to send.');
  const id=String(b.id);const n=await db.run("INSERT INTO enquiries (id,ad,sender,question,answer,created) SELECT ?,id,?,?,'',? FROM ads WHERE id=? AND owner<>? AND status='live' AND expires>? AND (SELECT COUNT(*) FROM enquiries WHERE sender=? AND created>?)<20 ON CONFLICT DO NOTHING",[crypto.randomUUID(),user.id,b.question,now,id,user.id,now,user.id,now-3600]);
  assert(n===1,409,'We couldn’t send your enquiry. Check that the advert is still open and that you haven’t contacted the advertiser about it already. You can only enquire about someone else’s advert. You can send up to 20 enquiries an hour.');return reply({sent:true},201);}
 if(op==='answer'){assert(contactReplies.includes(b.answer),400,'Choose a reply.');const contact=b.shareContact===true?user.email:'';const n=await db.run('UPDATE enquiries SET answer=?,contact=? WHERE id=? AND ad IN (SELECT id FROM ads WHERE owner=?)',[b.answer,contact,String(b.id),user.id]);assert(n===1,404,'We couldn’t find this enquiry. Check your inbox before replying again.');return reply({answered:true});}
 if(op==='erase'){assert(b.confirm===true,400,'Confirm you want to delete your LetMallow records.');await db.batch([['DELETE FROM enquiries WHERE sender=?',[user.id]],['DELETE FROM ads WHERE owner=?',[user.id]],['DELETE FROM passes WHERE owner=?',[user.id]],['DELETE FROM orders WHERE owner=?',[user.id]]]);return reply({deleted:true});}
 if(op==='checkout')return reply(await checkout(db,user,b,env,new URL(req.url).origin,now,send));
 throw new HttpError(404,'We couldn’t find that page.');
 }catch(e){return reply({error:e instanceof HttpError?e.message:'LetMallow is temporarily unavailable. Try again in a moment.'},e instanceof HttpError?e.status:503);}
}
