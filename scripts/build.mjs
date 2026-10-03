import { readFile, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderHome, renderCV } from './template.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const out = path.join(root, 'dist');
await rm(out, {recursive:true, force:true});
await mkdir(out,{recursive:true});
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for (const lang of ['en','zh']) {
  const prefix = lang==='en'?'':'zh/';
  await mkdir(path.join(out,prefix,'cv'),{recursive:true});
  await writeFile(path.join(out,prefix,'index.html'),renderHome(data,lang));
  await writeFile(path.join(out,prefix,'cv/index.html'),renderCV(data,lang));
}
await writeFile(path.join(out,'.nojekyll'),'');
await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${data.siteUrl}/sitemap.xml\n`);
await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/zh/','/cv/','/zh/cv/'].map(p=>`<url><loc>${data.siteUrl}${p}</loc><lastmod>${data.updated}</lastmod></url>`).join('')}</urlset>`);
await writeFile(path.join(out,'404.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 · Zeen Fang</title><link rel="stylesheet" href="/assets/reference/main.css"><main style="max-width:50em;margin:4em auto;padding:1em"><h1>Page not found / 页面未找到</h1><p><a href="/">Home / 返回主页 →</a></p></main></html>`);
console.log('Built English and Chinese homepages and CVs using the reference theme.');
