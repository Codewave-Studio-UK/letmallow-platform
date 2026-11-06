export class HttpError extends Error{constructor(status,message){super(message);this.status=status;}}
export function assert(ok,status,msg){if(!ok)throw new HttpError(status,msg);}
export const DAY=86400;
export function validateAd(v){
 const txt=(n,min,max)=>{const s=typeof v[n]==='string'?v[n].trim():'';assert(s.length>=min&&s.length<=max&&!/[\u0000-\u0008\u000B-\u001F]/.test(s),400,'Check the '+n+' field.');return s;};
 assert(['room','flat','house','wanted'].includes(v.kind)&&['England','Wales'].includes(v.nation),400,'Choose a supported type and nation.');
 assert(v.authority===true,400,'Confirm you can publish this advert.');
 const rent=Number(v.rent);
 assert(Number.isInteger(rent)&&rent>0&&rent<=100000,400,'Enter a monthly amount between £1 and £100,000.');
 const area=txt('area',2,80),title=txt('title',5,90),body=txt('body',25,1200);
 assert(!/[\w.+-]+@[\w.-]+\.[a-z]{2,}|https?:\/\/|(?:\+44|\b0)\s*\d[\d\s()-]{8,}\d/i.test(title+' '+area+' '+body),400,'Keep personal contact details and links out of the public text.');
 assert(['Included','Excluded','Part included','To confirm'].includes(v.bills),400,'Choose a bills option.');
 let proof='';
 if(v.proof){let u;try{u=new URL(v.proof)}catch{throw new HttpError(400,'Check the advert link.');}
 assert(u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&/^(www\.)?(spareroom\.co\.uk|openrent\.co\.uk|rightmove\.co\.uk|zoopla\.co\.uk|onthemarket\.com)$/.test(u.hostname)&&u.pathname.length>1&&u.href.length<700,400,'Use a public advert link from a supported provider.');proof=u.origin+u.pathname;}
 return {kind:v.kind,category:v.kind==='wanted'?'wanted':'offer',nation:v.nation,area,title,rent,body,bills:v.bills,proof};
}
export async function readBounded(req,limit){
 const reader=req.body?.getReader();if(!reader)return '';let out='',n=0;const decoder=new TextDecoder();
 while(true){const {done,value}=await reader.read();if(done)break;n+=value.byteLength;if(n>limit){await reader.cancel();throw new HttpError(413,'Request too large.');}out+=decoder.decode(value,{stream:true});}
 return out+decoder.decode();
}
