import { readFile, mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const data = JSON.parse(await readFile(path.join(root, 'data/profile.json'), 'utf8'));
const out = path.join(root, 'dist');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr = (value, lang) => typeof value === 'object' && value !== null ? value[lang] : value;
const t = (value, lang) => escape(tr(value, lang));
const labels = {
  zh: { about:'关于我', news:'近况', publications:'论文', projects:'项目', education:'教育', awards:'荣誉', contact:'联系', cv:'简历', cards:'图文', list:'列表', paper:'论文', code:'代码', skip:'跳转到正文', connect:'欢迎交流器件仿真、电路建模与模拟集成电路学习。', print:'打印 / 保存为 PDF', back:'返回主页', updated:'更新于', cvTitle:'学术简历', nav:'主导航', view:'论文显示方式', figure:'论文图表：原论文作者，CC BY 4.0。' },
  en: { about:'About', news:'News', publications:'Publications', projects:'Projects', education:'Education', awards:'Honours', contact:'Contact', cv:'CV', cards:'Cards', list:'List', paper:'Paper', code:'Code', skip:'Skip to content', connect:'I welcome conversations about device simulation, circuit modeling, and learning analog IC design.', print:'Print / Save as PDF', back:'Back to homepage', updated:'Updated', cvTitle:'Academic CV', nav:'Main navigation', view:'Publication view', figure:'Publication figures: original authors, CC BY 4.0.' }
};
function links(pub, lang) {
  return `<div class="item-links"><a href="${escape(pub.doi)}">${labels[lang].paper}</a>${pub.code ? `<a href="${escape(pub.code)}">${labels[lang].code}</a>` : ''}</div>`;
}
function authors(pub) { return pub.authors.map(a => a === 'Zeen Fang' ? `<strong>${escape(a)}</strong>` : escape(a)).join(', '); }
function section(id, body, lang, number) { return `<section class="content-section" id="${id}" aria-labelledby="${id}-heading"><div class="section-heading"><h2 id="${id}-heading">${labels[lang][id]}</h2><span class="section-number" aria-hidden="true">${number}</span></div>${body}</section>`; }
function pubList(lang) { return `<ol>${data.publications.map(p=>`<li><h3><a href="${p.doi}">${escape(p.title)}</a></h3><p class="authors">${authors(p)}</p><p class="venue">${escape(p.venue)}</p>${links(p,lang)}</li>`).join('')}</ol>`; }
function education(lang) { return `<div class="education-list">${data.education.map(e=>`<article class="education-item"><p class="period">${escape(e.period)}</p><div><h3>${t(e.school,lang)}</h3><p>${t(e.degree,lang)}</p><p class="role-note">${t(e.note,lang)}</p></div></article>`).join('')}</div>`; }
function awards(lang) { return `<ul class="awards-list">${data.awards.map(a=>`<li><span class="award-year">${a.year}</span><div><strong>${t(a.title,lang)}</strong><p>${t(a.note,lang)}</p></div></li>`).join('')}</ul>`; }
function document(lang, page, body) {
  const l = labels[lang], home = lang === 'en' ? '/' : '/zh/';
  const currentPath = home + (page === 'cv' ? 'cv/' : '');
  const alternate = (lang === 'en' ? '/zh/' : '/') + (page === 'cv' ? 'cv/' : '');
  const title = `${tr(data.name,lang)} · ${page === 'cv' ? l.cvTitle : lang === 'zh' ? '微电子 · 学术主页' : 'Microelectronics'}`;
  return `<!doctype html>
<html lang="${lang === 'zh' ? 'zh-CN' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${t(data.description,lang)}"><meta name="author" content="Zeen Fang"><meta name="theme-color" content="#254b62"><link rel="canonical" href="${data.siteUrl}${currentPath}"><link rel="alternate" hreflang="zh-CN" href="${data.siteUrl}/zh/${page === 'cv'?'cv/':''}"><link rel="alternate" hreflang="en" href="${data.siteUrl}${page === 'cv'?'/cv/':'/'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${t(data.description,lang)}"><meta property="og:type" content="website"><meta property="og:url" content="${data.siteUrl}${currentPath}"><meta property="og:image" content="${data.siteUrl}${data.avatar}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css"><script src="/assets/site.js" defer></script></head>
<body data-page="${page}"><a class="skip-link" href="#main-content">${l.skip}</a><header class="site-header"><div class="header-inner"><a class="brand" href="${home}">Zeen Fang<span class="brand-note"> / MICROELECTRONICS</span></a><nav class="main-nav" aria-label="${l.nav}">${['publications','projects','education','awards'].map(id=>`<a href="${home}#${id}">${l[id]}</a>`).join('')}<a href="${home}cv/">${l.cv}</a></nav><a class="language-switch" href="${alternate}" lang="${lang==='zh'?'en':'zh-CN'}" hreflang="${lang==='zh'?'en':'zh-CN'}">${lang==='zh'?'EN':'中文'}</a></div></header>${body}<footer class="site-footer"><div class="footer-inner"><p>© 2026 Zeen Fang · ${l.updated} ${data.updated}</p><p><a href="https://github.com/Zeen-F/zeen-f.github.io">GitHub</a> · Layout inspired by <a href="https://github.com/WD7ang/WowPage">WowPage</a></p><p class="figure-credit">${l.figure}</p></div></footer></body></html>`;
}
function home(lang) {
  const l = labels[lang];
  const body = `<div class="page-shell"><aside class="profile" aria-label="${lang==='zh'?'个人信息':'Profile'}"><img class="avatar" src="${data.avatar}" width="560" height="840" alt="${lang==='zh'?'方泽恩的个人照片':'Portrait of Zeen Fang'}" fetchpriority="high"><h1>${t(data.name,lang)}</h1><p class="name-secondary">${t(data.name,lang==='zh'?'en':'zh')}</p><p class="profile-role">${t(data.role,lang)}</p><p class="profile-affiliation">${t(data.affiliation,lang)}</p><p class="profile-status">${t(data.status,lang)}</p><ul class="profile-links"><li><a href="mailto:${data.email}">Email <span aria-hidden="true">↗</span></a></li><li><a href="${data.github}">GitHub <span aria-hidden="true">↗</span></a></li><li><a href="${lang==='en'?'/cv/':'/zh/cv/'}">${l.cv} <span aria-hidden="true">↗</span></a></li></ul><div class="profile-focus">${data.interests.map(i=>`<span>${t(i,lang)}</span>`).join('')}</div></aside><main id="main-content">
  ${section('about',`<div class="intro">${data.about.map(p=>`<p>${t(p,lang)}</p>`).join('')}</div>`,lang,'01')}
  ${section('news',`<ul class="news-list">${data.news.map(n=>`<li><time datetime="${n.date.replace('.','-')}">${n.date}</time><div>${n.url?`<a href="${n.url}">${t(n.text,lang)}</a>`:t(n.text,lang)}</div></li>`).join('')}</ul>`,lang,'02')}
  ${section('publications',`<div class="publication-tools" role="group" aria-label="${l.view}" hidden><button type="button" data-view="cards" aria-pressed="true">${l.cards}</button><button type="button" data-view="list" aria-pressed="false">${l.list}</button></div><div class="publications-grid">${data.publications.map(p=>`<article class="publication-card" id="${p.id}"><a class="publication-image" href="${p.doi}" aria-label="${escape(p.title)}"><img src="${p.image}" alt="${t(p.imageAlt,lang)}" width="1200" height="680" loading="lazy"></a><div class="publication-body"><p class="eyebrow">${t(p.role,lang)} / 2026</p><h3><a href="${p.doi}">${escape(p.title)}</a></h3><p class="authors">${authors(p)}</p><p class="venue">${escape(p.venue)}</p><p class="description">${t(p.description,lang)}</p><p class="role-note">${t(p.contribution,lang)}</p>${links(p,lang)}</div></article>`).join('')}</div><div class="publication-list" hidden>${pubList(lang)}</div>`,lang,'03')}
  ${section('projects',`<div class="project-grid">${data.projects.map(p=>`<article class="project-card" id="project-${p.id}"><a class="project-image" href="${p.image}" aria-label="${t(p.imageAlt,lang)}"><img src="${p.image}" alt="${t(p.imageAlt,lang)}" width="1200" height="680" loading="lazy"></a><div class="project-body"><p class="eyebrow">${p.period} / ${t(p.category,lang)}</p><h3>${t(p.title,lang)}</h3><p class="description">${t(p.description,lang)}</p><p class="role-note">${t(p.scope,lang)}</p></div></article>`).join('')}</div>`,lang,'04')}
  ${section('education',education(lang),lang,'05')}
  ${section('awards',awards(lang),lang,'06')}
  ${section('contact',`<div class="contact-panel"><p>${l.connect}</p><a href="mailto:${data.email}">${data.email} ↗</a></div>`,lang,'07')}
  </main></div>`;
  return document(lang,'home',body);
}
function cv(lang) {
  const l = labels[lang];
  const body = `<main id="main-content" class="cv-sheet"><header class="cv-header"><p class="eyebrow">${l.cvTitle}</p><h1>${t(data.name,lang)} <span>${t(data.name,lang==='zh'?'en':'zh')}</span></h1><p>${t(data.role,lang)} · ${t(data.affiliation,lang)}</p><p><a href="mailto:${data.email}">${data.email}</a> · <a href="${data.github}">GitHub</a></p><div class="cv-actions"><button type="button" onclick="window.print()">${l.print}</button><a href="${lang==='en'?'/':'/zh/'}">${l.back}</a></div></header><section><h2>${l.about}</h2>${data.about.map(p=>`<p>${t(p,lang)}</p>`).join('')}</section><section><h2>${l.education}</h2>${education(lang)}</section><section><h2>${l.publications}</h2>${pubList(lang)}</section><section><h2>${l.projects}</h2>${data.projects.map(p=>`<article><h3>${t(p.title,lang)} · ${p.period}</h3><p>${t(p.description,lang)}</p><p class="role-note">${t(p.scope,lang)}</p></article>`).join('')}</section><section><h2>${l.awards}</h2>${awards(lang)}</section></main>`;
  return document(lang,'cv',body);
}
await rm(out, {recursive:true, force:true});
await mkdir(out,{recursive:true});
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
for (const lang of ['zh','en']) {
  const prefix = lang==='en'?'':'zh/';
  await mkdir(path.join(out,prefix,'cv'),{recursive:true});
  await writeFile(path.join(out,prefix,'index.html'),home(lang));
  await writeFile(path.join(out,prefix,'cv/index.html'),cv(lang));
}
await writeFile(path.join(out,'.nojekyll'),'');
await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${data.siteUrl}/sitemap.xml\n`);
await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/zh/','/cv/','/zh/cv/'].map(p=>`<url><loc>${data.siteUrl}${p}</loc><lastmod>${data.updated}</lastmod></url>`).join('')}</urlset>`);
await writeFile(path.join(out,'404.html'),`<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>404 · Zeen Fang</title><link rel="stylesheet" href="/assets/site.css"><main class="cv-sheet"><h1>页面未找到 / Page not found</h1><p><a href="/">返回主页 / Home →</a></p></main></html>`);
console.log('Built Chinese and English homepages, CV pages, sitemap and 404 page.');
