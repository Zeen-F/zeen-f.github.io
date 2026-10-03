import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url);
const siteUrl='https://zeen-f.github.io';
const projectPath='research-practice/codex-tcad-harness/';
const pages=['index.html','zh/index.html','cv/index.html','zh/cv/index.html',`${projectPath}index.html`,`zh/${projectPath}index.html`];
let links=0;
for(const page of pages) {
  const html=await readFile(new URL(page,root),'utf8');
  const chinese=page.startsWith('zh/');
  const isProject=page.includes(projectPath);
  const pathname='/'+page.replace(/index\.html$/,'');
  assert.match(html,chinese?/<html lang="zh-CN"[ >]/:/<html lang="en"[ >]/);
  assert.doesNotMatch(html,/claudecode\.christmas/,'Project navigation must remain on this site');
  assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}${pathname}">`));
  if(isProject) {
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    assert.ok(html.includes(`class="language-switch" href="/${chinese?'':'zh/'}${projectPath}"`),'Language switch must retain the project route');
    for(const id of ['harness','decisions','evidence','receipts','roles','extension-heading']) assert.ok(html.includes(`id="${id}"`),`Missing project section ${id}`);
    assert.match(html,/156\.4185/);
    assert.match(html,/68\.3489/);
    assert.match(html,chinese?/暂缓/:/HOLD/);
    assert.match(html,/practice-package-card--method/);
    assert.equal((html.match(/<img\b/g)||[]).length,2,'Both original evidence figures must be retained');
  } else {
    assert.match(html,/10\.3390\/electronics15112333/);
    assert.match(html,/10\.3390\/mi17050567/);
    const projectLinks=[...html.matchAll(new RegExp(`<a href="/${chinese?'zh/':''}${projectPath}"([^>]*)>`, 'g'))];
    assert.equal(projectLinks.length,2,'Project title and introduction must link to the matching local language');
    assert.ok(projectLinks.every(([,attrs])=>!attrs.includes('target=')),'Internal project links must use the same tab');
  }
  assert.doesNotMatch(html,/PhD Applicant|seeking PhD|Second-Order Memristor|Your Name|name@example|Hao Lin|hust_linhao|Huazhong University/);
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${page}: duplicate IDs`);
  for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const resolved=new URL(url,siteUrl+pathname);
    if(resolved.origin!==siteUrl) continue;
    const fragment=resolved.hash.slice(1);
    const file=resolved.pathname.endsWith('/')?resolved.pathname+'index.html':resolved.pathname;
    await access(new URL(file.slice(1),root));
    if(fragment) assert.ok((await readFile(new URL(file.slice(1),root),'utf8')).includes(`id="${fragment}"`),`${page}: missing ${url}`);
    links++;
  }
}
console.log(`Passed: ${pages.length} bilingual pages; ${links} local links/assets; internal project navigation and language switching; complete TCAD sections; unique anchors.`);
