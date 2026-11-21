export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export function assert(ok,status,msg){if(!ok)throw new HttpError(status,msg);}
export const DAY=86400;
export function validateAd(v){
 const txt=(n,min,max,label)=>{const s=typeof v[n]==='string'?v[n].trim():'';assert(s.length>=min&&s.length<=max&&!/[\u0000-\u0008\u000B-\u001F]/.test(s),400,'Check the '+label+'. Use '+min+' to '+max.toLocaleString('en-GB')+' characters.');return s;};
 assert(['room','flat','house','wanted'].includes(v.kind)&&['England','Wales'].includes(v.nation),400,'Choose an advert type and either England or Wales.');
 assert(v.authority===true,400,'Tick the box to confirm you can publish this advert.');
 const rent=Number(v.rent);
 assert(Number.isInteger(rent)&&rent>0&&rent<=100000,400,'Enter the monthly rent or budget in whole pounds, from £1 to £100,000.');
 const area=txt('area',2,80,'area'),title=txt('title',5,90,'advert title'),body=txt('body',25,1200,'description');
 assert(!/[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:\/\/|(?:\+44|\b0)\s*\d[\d\s()-]{8,}\d/i.test(title+' '+area+' '+body),400,'Remove email addresses, phone numbers and links from the public advert.');
 assert(['Included','Excluded','Part included','To confirm'].includes(v.bills),400,'Choose how the bills are covered.');
 let proof='';
 if(v.proof){let u;try{u=new URL(v.proof)}catch{throw new HttpError(400,'Enter the full web address of the public advert.');}
 assert(u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&/^(www\.)?(spareroom\.co\.uk|openrent\.co\.uk|rightmove\.co\.uk|zoopla\.co\.uk|onthemarket\.com)$/.test(u.hostname)&&u.pathname.length>1&&u.href.length<700,400,'Use an advert link from SpareRoom, OpenRent, Rightmove, Zoopla or OnTheMarket.');proof=u.origin+u.pathname;}
 return {kind:v.kind,category:v.kind==='wanted'?'wanted':'offer',nation:v.nation,area,title,rent,body,bills:v.bills,proof};
}
export async function readBounded(req,limit){
 const reader=req.body?.getReader();if(!reader)return '';let out='',n=0;const decoder=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;n+=value.byteLength;if(n>limit){await reader.cancel();throw new HttpError(413,'We couldn’t save that much text. Shorten it and try again.');}out+=decoder.decode(value,{stream:true});}
 return out+decoder.decode();
}
