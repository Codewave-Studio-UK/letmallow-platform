import {shell} from '../public/market/shell.mjs';
export default function Page(){return <div id="rental-app" dangerouslySetInnerHTML={{__html:shell()}}/>;}
