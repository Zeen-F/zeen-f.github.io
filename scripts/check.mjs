import {readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url);
const data=JSON.parse(await readFile(new URL('../data/profile.json',import.meta.url),'utf8'));
const siteUrl='https://zeen-f.github.io';
const projectPath='research-practice/codex-tcad-harness/';
const tcadPoster=data.projects.find(p=>p.id==='tcad').poster;
const pages=['index.html','zh/index.html','cv/index.html','zh/cv/index.html',`${projectPath}index.html`,`zh/${projectPath}index.html`,...data.publications.flatMap(p=>[`${p.path}index.html`,`zh/${p.path}index.html`])];
let links=0;
for(const page of pages) {
  const html=await readFile(new URL(page,root),'utf8');
  const chinese=page.startsWith('zh/');
  const isProject=page.includes(projectPath);
  const publication=data.publications.find(p=>page.includes(p.path));
  const pathname='/'+page.replace(/index\.html$/,'');
  assert.match(html,chinese?/<html lang="zh-CN"[ >]/:/<html lang="en"[ >]/);
  assert.doesNotMatch(html,/claudecode\.christmas/,'Project navigation must remain on this site');
  assert.ok(html.includes(`<link rel="canonical" href="${siteUrl}${pathname}">`));
  assert.ok(html.includes('href="/assets/icons/favicon-32.png"'));
  assert.doesNotMatch(html,/assets\/favicon\.svg/,'The old ZF icon must no longer be referenced');
  if(publication) {
    const p=publication;
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    assert.ok(html.includes(`class="language-switch" href="/${chinese?'':'zh/'}${p.path}"`),'Language switch must retain the paper route');
    assert.ok(html.includes(`href="${p.doi}"`));
    assert.ok(html.includes(`src="${p.poster.image}"`),'The complete original poster must be displayed');
    assert.ok(html.includes(`href="${p.poster.image}?download=1" download="${p.id}-paper-poster.png"`),'PNG download must bypass the theme image-popup selector');
    assert.ok(html.includes(`<meta property="og:image" content="${siteUrl}${p.poster.image}">`));
    assert.match(html,chinese?/AI 辅助概览图/:/AI-assisted overview/);
    assert.match(html,chinese?/并非器件实测|亦非芯片实测/:/not device measurements|not a silicon measurement/);
  } else if(isProject) {
    assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
    assert.ok(html.includes(`class="language-switch" href="/${chinese?'':'zh/'}${projectPath}"`),'Language switch must retain the project route');
    for(const id of ['poster','poster-heading','harness','decisions','evidence','receipts','roles','extension-heading']) assert.ok(html.includes(`id="${id}"`),`Missing project section ${id}`);
    assert.ok(html.includes('href="#poster"'),'The project contents must link to the poster');
    const posterPosition=html.indexOf('<section class="practice-poster"');
    assert.ok(posterPosition>html.indexOf('</header>')&&posterPosition<html.indexOf('starting-point-heading'),'The poster must appear after the hero and before the original article sections');
    assert.ok(html.includes(`src="${tcadPoster.preview}"`),'The project poster preview must be displayed');
    assert.ok(html.includes(`class="image-popup" href="${tcadPoster.image}"`),'The original project poster must open in the image viewer');
    assert.ok(html.includes(`href="${tcadPoster.image}?download=1" download="codex-tcad-harness-poster.png"`),'Project PNG download must bypass the theme image-popup selector');
    assert.ok(html.includes(`<meta property="og:image" content="${siteUrl}${tcadPoster.image}">`),'The project share image must use the poster');
    assert.match(html,chinese?/AI 辅助项目概览/:/AI-assisted project overview/);
    assert.match(html,chinese?/原始 TCAD 仿真证据、提取方法与结果边界完整保留在下文/:/original TCAD simulation evidence, extraction methods, and limits of the results are preserved below/);
    assert.match(html,/156\.4185/);
    assert.match(html,/68\.3489/);
    assert.match(html,chinese?/暂缓/:/HOLD/);
    assert.match(html,/practice-package-card--method/);
    assert.equal((html.match(/<img\b/g)||[]).length,3,'The project poster and both original evidence figures must be present');
    for(const image of ['tcad-h-diamond-structure.png','tcad-h21-ft-extraction.png']) assert.ok(html.includes(`src="/assets/images/tcad-detail/${image}"`),`Original evidence figure must be retained: ${image}`);
  } else {
    assert.match(html,/10\.3390\/electronics15112333/);
    assert.match(html,/10\.3390\/mi17050567/);
    const projectLinks=[...html.matchAll(new RegExp(`<a href="/${chinese?'zh/':''}${projectPath}"([^>]*)>`, 'g'))];
    assert.equal(projectLinks.length,2,'Project title and introduction must link to the matching local language');
    assert.ok(projectLinks.every(([,attrs])=>!attrs.includes('target=')),'Internal project links must use the same tab');
    for(const p of data.publications) assert.ok(html.includes(`href="/${chinese?'zh/':''}${p.path}"`),'Each paper must link to its corresponding poster page');
    if(page==='index.html'||page==='zh/index.html') {
      assert.ok(html.includes(`src="${tcadPoster.preview}"`),'The homepage TCAD thumbnail must use the project poster');
      assert.ok(html.includes(`class="image-popup" href="${tcadPoster.image}"`),'The homepage TCAD thumbnail must open the original poster');
    }
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
for(const icon of ['favicon.ico','apple-touch-icon.png']) assert.deepEqual(await readFile(new URL(icon,root)),await readFile(new URL(`assets/icons/${icon}`,root)));
assert.ok((await readFile(new URL('404.html',root),'utf8')).includes('href="/assets/icons/favicon-32.png"'));
console.log(`Passed: ${pages.length} bilingual pages; ${links} local links/assets; native paper/project navigation and language switching; paper/project poster downloads; site icons; complete TCAD sections and original evidence figures; unique anchors.`);
