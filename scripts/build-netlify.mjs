import {cp, mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {landing,shell} from '../public/market/shell.mjs';
import {appIconLinks} from '../public/market/icons.mjs';
import {brand,canonical} from '../public/market/domain.mjs';
const {version} = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const out=new URL('../netlify-dist/',import.meta.url);
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp(new URL('../public/',import.meta.url),out,{recursive:true});
const iconLinks = appIconLinks.map(link => {
  const attributes = Object.entries(link).map(([name, value]) => `${name}="${value}"`).join(' ');
  return `<link ${attributes}>`;
}).join('');
const html='<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="rental-host" content="netlify"><meta name="letmallow-version" content="'+version+'"><meta name="robots" content="noindex,nofollow"><meta name="referrer" content="no-referrer"><meta name="description" content="Find a room, flat or house in England and Wales, including islands."><title>'+brand+' · Rooms and homes to rent in England and Wales</title>'+iconLinks+'<link rel="stylesheet" href="/market/style.css"><link rel="preload" as="font" href="/market/fonts/nunito-latin.woff2" type="font/woff2" crossorigin><script type="module" src="/market/app.mjs"></script></head><body>'+shell({showLanding:false})+'<template id="landing-content">'+landing()+'</template><script>{const view = new URLSearchParams(location.search).get("view"); if (!view || view === "home") document.getElementById("content").append(document.getElementById("landing-content").content.cloneNode(true));}</script></body></html>';
await writeFile(new URL('index.html',out),html);
await writeFile(new URL('_redirects',out),'/api/homes '+canonical+'/api/homes 200\n');
await writeFile(new URL('_headers',out),'/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: no-referrer\n  X-Robots-Tag: noindex, nofollow\n');
console.log('Built Netlify public front end. Account actions use the canonical authenticated service.');
