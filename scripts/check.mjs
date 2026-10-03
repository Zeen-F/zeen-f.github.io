import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url);
let links=0;
for(const page of ['index.html','zh/index.html','cv/index.html','zh/cv/index.html']) {
  const html=await readFile(new URL(page,root),'utf8');
  assert.match(html,page.startsWith('zh/')?/<html lang="zh-CN"[ >]/:/<html lang="en"[ >]/);
  assert.match(html,/10\.3390\/electronics15112333/);
  assert.match(html,/10\.3390\/mi17050567/);
  assert.doesNotMatch(html,/PhD Applicant|seeking PhD|Second-Order Memristor|Your Name|name@example|Hao Lin|hust_linhao|Huazhong University/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${page}: duplicate IDs`);
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if(!url.startsWith('/')) continue;
    const [pathname,fragment]=url.split('#');
    const file=pathname.endsWith('/')?pathname+'index.html':pathname;
    await access(new URL(file.slice(1),root));
    if(fragment) assert.ok((await readFile(new URL(file.slice(1),root),'utf8')).includes(`id="${fragment}"`),`${page}: missing ${url}`);
    links++;
  }
}
console.log(`Passed: 4 bilingual pages; ${links} local links/assets; publication DOIs; unique anchors; no template or outdated application copy.`);
