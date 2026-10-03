// Markup follows the MIT-licensed AcadHomepage theme used by Koreyoshi01.
// See LICENSE-AcadHomepage and ASSET_CREDITS.md for upstream attribution.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr = (value, lang) => typeof value === 'object' && value !== null ? value[lang] : value;
const t = (value, lang) => escape(tr(value, lang));
const rich = (value, lang) => t(value,lang).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
const labels = {
  en: { home:'Homepage',about:'About Me',research:'Research',news:'News',publications:'Publications',awards:'Honors and Awards',experience:'Experience',education:'Education',cv:'Academic CV',print:'Print / Save as PDF',back:'Back to homepage',skip:'Skip to content',menu:'More navigation links',paper:'paper',code:'code',project:'Read project introduction' },
  zh: { home:'主页',about:'关于我',research:'研究兴趣',news:'近况',publications:'论文发表',awards:'荣誉与奖项',experience:'项目经历',education:'教育经历',cv:'学术简历',print:'打印 / 保存为 PDF',back:'返回主页',skip:'跳转到正文',menu:'更多导航链接',paper:'论文',code:'代码',project:'查看项目介绍' }
};
const anchors = {about:'about-me',research:'-research',news:'-news',publications:'-publications',awards:'-honors-and-awards',experience:'-experience',education:'-educations'};
const emojis = {research:'🔍',news:'🔥',publications:'📝',awards:'🎖',experience:'💻',education:'📖'};
const base = lang => lang==='en'?'/':'/zh/';
const authors = pub => pub.authors.map(a=>a==='Zeen Fang'?`<strong>${escape(a)}</strong>`:escape(a)).join(', ');
function publicationLinks(p,lang) {
  return `<p class="publication-links"><span>${escape(p.venue)}</span> <a href="${escape(p.doi)}" target="_blank" rel="noopener noreferrer">[${labels[lang].paper}]</a>${p.code?` <a href="${escape(p.code)}" target="_blank" rel="noopener noreferrer">[${labels[lang].code}]</a>`:''}</p>`;
}
function projectTitle(p,lang) {
  return p.url?`<a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">${t(p.title,lang)}</a>`:t(p.title,lang);
}
function projectLink(p,lang) {
  return p.url?`<p><a href="${escape(p.url)}" target="_blank" rel="noopener noreferrer">${labels[lang].project} ↗</a></p>`:'';
}
function heading(id,lang) {return `<h1 id="${anchors[id]}">${emojis[id]} ${labels[lang][id]}</h1>`;}
function masthead(lang,page) {
  const l=labels[lang], home=base(lang), alternate=base(lang==='en'?'zh':'en')+(page==='cv'?'cv/':'');
  return `<div class="masthead"><div class="masthead__inner-wrap"><div class="masthead__menu"><nav id="site-nav" class="greedy-nav" aria-label="${lang==='en'?'Main navigation':'主导航'}"><button type="button" aria-label="${l.menu}" aria-expanded="false" aria-controls="overflow-nav"><div class="navicon"></div></button><ul class="visible-links"><li class="masthead__menu-item masthead__menu-item--lg masthead__menu-home-item"><a href="${home}#about-me">${l.home}</a></li>${['about','research','news','publications','awards','experience','education'].map(id=>`<li class="masthead__menu-item"><a href="${home}#${anchors[id]}">${l[id]}</a></li>`).join('')}<li class="masthead__menu-item nav-language"><a class="language-switch" href="${alternate}" lang="${lang==='en'?'zh-CN':'en'}" hreflang="${lang==='en'?'zh-CN':'en'}">${lang==='en'?'中文':'EN'}</a></li></ul><ul id="overflow-nav" class="hidden-links hidden"></ul></nav></div></div></div>`;
}
function sidebar(d,lang) {
  const l=labels[lang];
  const contact=[{url:`mailto:${d.email}`,icon:'fas fa-envelope',label:d.email},{url:d.github,icon:'fab fa-github',label:'Github'},{url:base(lang)+'cv/',icon:'fas fa-file-alt',label:l.cv}];
  return `<div class="sidebar sticky"><div itemscope itemtype="https://schema.org/Person" class="profile_box"><div class="author__avatar"><img src="${d.avatar}" class="author__avatar" alt="${t(d.name,lang)}" width="560" height="840"></div><div class="author__content"><h3 class="author__name">${t(d.name,lang)}</h3><p class="author__bio">${t(d.sidebarBio,lang)}</p></div><div class="author__urls-wrapper"><ul class="author__urls social-icons"><li><div style="white-space:normal;margin-bottom:1em">${t(d.sidebarNote,lang)}</div></li><li><i class="fa fa-fw fa-map-marker" aria-hidden="true"></i> ${t(d.location,lang)}</li>${contact.map(c=>`<li><a href="${c.url}"><i class="${c.icon} fa-fw" aria-hidden="true"></i> ${escape(c.label)}</a></li>`).join('')}</ul><div class="author__urls_sm">${contact.map(c=>`<a href="${c.url}" aria-label="${escape(c.label)}" title="${escape(c.label)}"><i class="${c.icon} fa-fw" aria-hidden="true"></i></a>`).join('')}</div></div></div></div>`;
}
function education(d,lang) {
  return d.education.map(e=>`<div class="timeline-entry"><div class="timeline-text"><p class="timeline-date">${escape(e.period)}${lang==='en'?' (expected)':'（预计）'}</p><p>${t(e.school,lang)}</p><p>${t(e.degree,lang)}</p></div><div class="timeline-logo">${e.logo?`<img class="timeline-logo-img timeline-logo-img-large" src="${e.logo}" alt="${t(e.school,lang)}">`:'<span class="timeline-logo-text">CSU</span>'}</div></div>`).join('');
}
function awards(d,lang) {return `<ul>${d.awards.map(a=>`<li><em>${escape(a.year)}</em>: 🎖️ <strong>${t(a.title,lang)}</strong>, ${t(a.note,lang)}</li>`).join('')}</ul>`;}
function doc(d,lang,page,body) {
  const home=base(lang),route=home+(page==='cv'?'cv/':''),title=`${tr(d.name,lang)} - ${page==='cv'?labels[lang].cv:'Homepage'}`;
  return `<!doctype html><html lang="${lang==='en'?'en':'zh-CN'}" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${t(d.description,lang)}"><meta name="author" content="Zeen Fang"><meta name="theme-color" content="#ffffff"><link rel="canonical" href="${d.siteUrl}${route}"><link rel="alternate" hreflang="en" href="${d.siteUrl}${page==='cv'?'/cv/':'/'}"><link rel="alternate" hreflang="zh-CN" href="${d.siteUrl}/zh/${page==='cv'?'cv/':''}"><link rel="alternate" hreflang="x-default" href="${d.siteUrl}${page==='cv'?'/cv/':'/'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${t(d.description,lang)}"><meta property="og:url" content="${d.siteUrl}${route}"><meta property="og:type" content="website"><meta property="og:image" content="${d.siteUrl}${d.avatar}"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/reference/main.css"><link rel="stylesheet" href="/assets/site.css"><script>document.documentElement.className='js';</script></head><body data-page="${page}"><a class="skip-link" href="#main-content">${labels[lang].skip}</a>${masthead(lang,page)}${body}<script src="/assets/reference/main.min.js"></script><script src="/assets/site.js"></script></body></html>`;
}
export function renderHome(d,lang) {
  const intro=`<p><span class="anchor" id="about-me"></span></p>${d.about.map(p=>`<p>${rich(p,lang)}</p>`).join('')}`;
  const research=`${heading('research',lang)}<p>${t(d.researchIntro,lang)}</p><ul>${d.researchTopics.map(p=>`<li>${t(p,lang)}</li>`).join('')}</ul>`;
  const news=`${heading('news',lang)}<ul>${d.news.map(n=>`<li><em>${n.date}</em>: 🎉 ${n.url?`<a href="${n.url}" target="_blank" rel="noopener noreferrer">${t(n.text,lang)}</a>`:t(n.text,lang)}</li>`).join('')}</ul>`;
  const pubs=`${heading('publications',lang)}${d.publications.map(p=>`<div class="publication-card" id="${p.id}"><a class="publication-image-link image-popup" href="${p.image}" title="${t(p.imageAlt,lang)}"><img class="publication-thumb" src="${p.image}" alt="${t(p.imageAlt,lang)}" width="1200" height="680"><span class="publication-preview" aria-hidden="true"><img src="${p.image}" alt=""></span></a><div class="publication-content"><h3><a href="${p.doi}" target="_blank" rel="noopener noreferrer">${escape(p.title)}</a></h3><p class="publication-authors">${authors(p)}</p><p class="publication-desc">${t(p.description,lang)} ${t(p.contribution,lang)}</p>${publicationLinks(p,lang)}</div></div>`).join('')}`;
  const experiences=`${heading('experience',lang)}${d.projects.map(p=>`<div class="timeline-entry"><div class="timeline-text"><p class="timeline-title">${projectTitle(p,lang)}</p><p>${p.period} · ${t(p.category,lang)}</p><p>${t(p.description,lang)}</p><p>${t(p.scope,lang)}</p>${projectLink(p,lang)}</div><div class="timeline-logo"><a class="image-popup" href="${p.image}" title="${t(p.imageAlt,lang)}"><img class="timeline-logo-img" src="${p.image}" alt="${t(p.imageAlt,lang)}"></a></div></div>`).join('')}`;
  return doc(d,lang,'home',`<div id="main" role="main">${sidebar(d,lang)}<article class="page" id="main-content"><div class="page__inner-wrap"><section class="page__content">${intro}${research}${news}${pubs}${heading('awards',lang)}${awards(d,lang)}${experiences}${heading('education',lang)}${education(d,lang)}</section></div></article></div>`);
}
export function renderCV(d,lang) {
  const l=labels[lang];
  return doc(d,lang,'cv',`<main id="main-content" class="cv-sheet"><header class="cv-header"><p>${l.cv}</p><h1>${t(d.name,lang)} <span>${t(d.name,lang==='en'?'zh':'en')}</span></h1><p>${t(d.role,lang)} · ${t(d.affiliation,lang)}</p><p><a href="mailto:${d.email}">${d.email}</a> · <a href="${d.github}">GitHub</a></p><div class="cv-actions"><button type="button" onclick="window.print()">${l.print}</button><a href="${base(lang)}">${l.back}</a></div></header><section><h2>${l.about}</h2>${d.about.map(p=>`<p>${rich(p,lang)}</p>`).join('')}</section><section><h2>${l.education}</h2>${education(d,lang)}</section><section><h2>${l.publications}</h2><ol>${d.publications.map(p=>`<li><h3><a href="${p.doi}">${escape(p.title)}</a></h3><p>${authors(p)}</p>${publicationLinks(p,lang)}<p>${t(p.contribution,lang)}</p></li>`).join('')}</ol></section><section><h2>${l.experience}</h2>${d.projects.map(p=>`<article><h3>${projectTitle(p,lang)} · ${p.period}</h3><p>${t(p.description,lang)}</p><p>${t(p.scope,lang)}</p>${projectLink(p,lang)}</article>`).join('')}</section><section><h2>${l.awards}</h2>${awards(d,lang)}</section></main>`);
}
