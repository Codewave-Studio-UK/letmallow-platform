import {shell} from '../public/market/shell.mjs';

export default async function Page({searchParams}: {searchParams: Promise<{view?: string}>}) {
  const {view} = await searchParams;
  return <div id="rental-app" dangerouslySetInnerHTML={{__html: shell({showLanding: !view || view === 'home'})}}/>;
}
