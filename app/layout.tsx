import type {Metadata} from 'next';
import { appIconLinks } from '../public/market/icons.mjs';
export const metadata:Metadata={title:'LetMallow · Rooms and homes to rent in England and Wales',description:'Search residential rentals across England and Wales, including islands. Advertise a home or post a wanted advert.',robots:{index:false,follow:false},referrer:'no-referrer'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en-GB"><head>{appIconLinks.map(link => <link key={link.href} {...link} />)}<link rel="stylesheet" href="/market/style.css"/><link rel="preload" as="font" href="/market/fonts/nunito-latin.woff2" type="font/woff2" crossOrigin="anonymous"/></head><body>{children}<script type="module" src="/market/app.mjs"/></body></html>;}
