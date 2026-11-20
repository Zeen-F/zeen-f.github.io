// Markup follows the MIT-licensed AcadHomepage theme used by Koreyoshi01.
// See LICENSE-AcadHomepage and ASSET_CREDITS.md for upstream attribution.
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tr = (value, lang) => typeof value === 'object' && value !== null ? value[lang] : value;
const t = (value, lang) => escape(tr(value, lang));
const rich = (value, lang) => t(value,lang).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
const labels = {
  en: { home:'Homepage',about:'About Me',research:'Research',news:'News',publications:'Publications',software:'Software',awards:'Honors and Awards',experience:'Experience',education:'Education',cv:'Academic CV',print:'Print / Save as PDF',back:'Back to homepage',skip:'Skip to content',menu:'More navigation links',paper:'paper',code:'code',project:'Read project introduction' },
  zh: { home:'主页',about:'关于我',research:'研究兴趣',news:'近况',publications:'论文发表',software:'科研软件',awards:'荣誉与奖项',experience:'项目经历',education:'教育经历',cv:'学术简历',print:'打印 / 保存为 PDF',back:'返回主页',skip:'跳转到正文',menu:'更多导航链接',paper:'论文',code:'代码',project:'查看项目介绍' }
};
const anchors = {about:'about-me',research:'-research',news:'-news',publications:'-publications',software:'software',awards:'-honors-and-awards',experience:'-experience',education:'-educations'};
const emojis = {research:'🔍',news:'🔥',publications:'📝',software:'🧰',awards:'🎖',experience:'💻',education:'📖'};
const base = lang => lang==='en'?'/':'/zh/';
export const tcadPath = 'research-practice/codex-tcad-harness/';
const pagePath = page => typeof page==='object'?page.path:page==='cv'?'cv/':page==='tcad'?tcadPath:'';
export const iconLinks = '<link rel="icon" href="/assets/icons/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/assets/icons/favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="/assets/icons/favicon-192.png"><link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">';
const authors = pub => pub.authors.map(a=>a==='Zeen Fang'?`<strong>${escape(a)}</strong>`:escape(a)).join(', ');
function publicationLinks(p,lang,includePoster=true) {
  return `<p class="publication-links"><span>${escape(p.venue)}</span> <a href="${escape(p.doi)}" target="_blank" rel="noopener noreferrer">[${labels[lang].paper}]</a>${p.code?` <a href="${escape(p.code)}" target="_blank" rel="noopener noreferrer">[${labels[lang].code}]</a>`:''}${includePoster&&p.poster?` <a href="${base(lang)+p.path}">[${lang==='en'?'poster':'海报'}]</a>`:''}</p>`;
}
function projectHref(p,lang) {return p.path?base(lang)+p.path:p.url;}
function projectAnchor(p,lang,text) {
  const href=projectHref(p,lang);
  return `<a href="${escape(href)}"${href.startsWith('/')?'':' target="_blank" rel="noopener noreferrer"'}>${text}</a>`;
}
function projectTitle(p,lang) {
  return projectHref(p,lang)?projectAnchor(p,lang,t(p.title,lang)):t(p.title,lang);
}
function projectLink(p,lang) {
  return projectHref(p,lang)?`<p>${projectAnchor(p,lang,labels[lang].project+' →')}</p>`:'';
}
function heading(id,lang) {return `<h1 id="${anchors[id]}">${emojis[id]} ${labels[lang][id]}</h1>`;}
function masthead(lang,page) {
  const l=labels[lang], home=base(lang), alternate=base(lang==='en'?'zh':'en')+pagePath(page);
  return `<div class="masthead"><div class="masthead__inner-wrap"><div class="masthead__menu"><nav id="site-nav" class="greedy-nav" aria-label="${lang==='en'?'Main navigation':'主导航'}"><button type="button" aria-label="${l.menu}" aria-expanded="false" aria-controls="overflow-nav"><div class="navicon"></div></button><ul class="visible-links"><li class="masthead__menu-item masthead__menu-item--lg masthead__menu-home-item"><a href="${home}#about-me">${l.home}</a></li>${['about','research','news','publications','software','awards','experience','education'].map(id=>`<li class="masthead__menu-item"><a href="${home}#${anchors[id]}">${l[id]}</a></li>`).join('')}<li class="masthead__menu-item nav-language"><a class="language-switch" href="${alternate}" lang="${lang==='en'?'zh-CN':'en'}" hreflang="${lang==='en'?'zh-CN':'en'}">${lang==='en'?'中文':'EN'}</a></li></ul><ul id="overflow-nav" class="hidden-links hidden"></ul></nav></div></div></div>`;
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
  const detail=typeof page==='object'?page:null;
  const kind=detail ? (detail.kind || 'publication') : page;
  const route=base(lang)+pagePath(page);
  const title=`${tr(d.name,lang)} - ${detail?tr(detail.title,lang):kind==='cv'?labels[lang].cv:kind==='tcad'?'Codex × TCAD':'Homepage'}`;
  const project=kind==='tcad'?d.projects.find(p=>p.id==='tcad'):null;
  const description=detail?detail.description:project?project.description:d.description;
  const sharePoster=detail?detail.poster:project?.poster;
  const shareImage=kind==='software' ? softwareImage(detail,detail.steps[0].id) : sharePoster?.image || d.avatar;
  const shareImageAlt=detail?detail.imageAlt:project?.poster?.alt;
  return `<!doctype html><html lang="${lang==='en'?'en':'zh-CN'}" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${t(description,lang)}"><meta name="author" content="Zeen Fang"><meta name="theme-color" content="#ffffff"><link rel="canonical" href="${d.siteUrl}${route}"><link rel="alternate" hreflang="en" href="${d.siteUrl}/${pagePath(page)}"><link rel="alternate" hreflang="zh-CN" href="${d.siteUrl}/zh/${pagePath(page)}"><link rel="alternate" hreflang="x-default" href="${d.siteUrl}/${pagePath(page)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${t(description,lang)}"><meta property="og:url" content="${d.siteUrl}${route}"><meta property="og:type" content="${detail?'article':'website'}"><meta property="og:image" content="${d.siteUrl}${shareImage}">${sharePoster?`<meta property="og:image:width" content="${sharePoster.width}"><meta property="og:image:height" content="${sharePoster.height}"><meta property="og:image:alt" content="${t(shareImageAlt,lang)}"><meta name="twitter:card" content="summary_large_image">`:''}${iconLinks}<link rel="stylesheet" href="/assets/reference/main.css"><link rel="stylesheet" href="/assets/site.css">${kind==='tcad'?'<link rel="stylesheet" href="/assets/tcad.css">':''}${kind==='publication'?'<link rel="stylesheet" href="/assets/publication.css">':''}${kind==='home'||kind==='software'?'<link rel="stylesheet" href="/assets/software.css">':''}<script>document.documentElement.className='js';</script></head><body data-page="${kind}"><a class="skip-link" href="#main-content">${labels[lang].skip}</a>${masthead(lang,page)}${body}<script src="/assets/reference/main.min.js"></script><script src="/assets/site.js"></script>${kind==='tcad'?'<script src="/assets/tcad.js"></script>':''}</body></html>`;
}
export function renderHome(d,lang) {
  const intro=`<p><span class="anchor" id="about-me"></span></p>${d.about.map(p=>`<p>${rich(p,lang)}</p>`).join('')}`;
  const research=`${heading('research',lang)}<p>${t(d.researchIntro,lang)}</p><ul>${d.researchTopics.map(p=>`<li>${t(p,lang)}</li>`).join('')}</ul>`;
  const news=`${heading('news',lang)}<ul>${d.news.map(n=>`<li><em>${n.date}</em>: 🎉 ${n.url?`<a href="${n.url}" target="_blank" rel="noopener noreferrer">${t(n.text,lang)}</a>`:t(n.text,lang)}</li>`).join('')}</ul>`;
  const pubs=`${heading('publications',lang)}${d.publications.map(p=>`<div class="publication-card" id="${p.id}"><a class="publication-image-link image-popup" href="${p.poster?.image||p.image}" title="${t(p.imageAlt,lang)}"><img class="publication-thumb" src="${p.image}" alt="${t(p.imageAlt,lang)}" width="${p.poster?.width||1200}" height="${p.poster?.height||680}"><span class="publication-preview" aria-hidden="true"><img src="${p.image}" alt=""></span></a><div class="publication-content"><h3><a href="${p.doi}" target="_blank" rel="noopener noreferrer">${escape(p.title)}</a></h3><p class="publication-authors">${authors(p)}</p><p class="publication-desc">${t(p.description,lang)} ${t(p.contribution,lang)}</p>${publicationLinks(p,lang)}</div></div>`).join('')}`;
  const experiences=`${heading('experience',lang)}${d.projects.map(p=>`<div class="timeline-entry"><div class="timeline-text"><p class="timeline-title">${projectTitle(p,lang)}</p><p>${p.period} · ${t(p.category,lang)}</p><p>${t(p.description,lang)}</p><p>${t(p.scope,lang)}</p>${projectLink(p,lang)}</div><div class="timeline-logo"><a class="image-popup" href="${p.poster?.image||p.image}" title="${t(p.poster?.alt||p.imageAlt,lang)}"><img class="timeline-logo-img" src="${p.poster?.preview||p.image}" alt="${t(p.poster?.alt||p.imageAlt,lang)}"></a></div></div>`).join('')}`;
  return doc(d,lang,'home',`<div id="main" role="main">${sidebar(d,lang)}<article class="page" id="main-content"><div class="page__inner-wrap"><section class="page__content">${intro}${softwareIntro(d.software,lang)}${research}${news}${pubs}${softwareList(d.software,lang)}${heading('awards',lang)}${awards(d,lang)}${experiences}${heading('education',lang)}${education(d,lang)}</section></div></article></div>`);
}
export function renderCV(d,lang) {
  const l=labels[lang];
  return doc(d,lang,'cv',`<main id="main-content" class="cv-sheet"><header class="cv-header"><p>${l.cv}</p><h1>${t(d.name,lang)} <span>${t(d.name,lang==='en'?'zh':'en')}</span></h1><p>${t(d.role,lang)} · ${t(d.affiliation,lang)}</p><p><a href="mailto:${d.email}">${d.email}</a> · <a href="${d.github}">GitHub</a></p><div class="cv-actions"><button type="button" onclick="window.print()">${l.print}</button><a href="${base(lang)}">${l.back}</a></div></header><section><h2>${l.about}</h2>${d.about.map(p=>`<p>${rich(p,lang)}</p>`).join('')}</section><section><h2>${l.education}</h2>${education(d,lang)}</section><section><h2>${l.publications}</h2><ol>${d.publications.map(p=>`<li><h3><a href="${p.doi}">${escape(p.title)}</a></h3><p>${authors(p)}</p>${publicationLinks(p,lang)}<p>${t(p.contribution,lang)}</p></li>`).join('')}</ol></section><section><h2>${l.experience}</h2>${d.projects.map(p=>`<article><h3>${projectTitle(p,lang)} · ${p.period}</h3><p>${t(p.description,lang)}</p><p>${t(p.scope,lang)}</p>${projectLink(p,lang)}</article>`).join('')}</section><section><h2>${l.awards}</h2>${awards(d,lang)}</section></main>`);
}

export function renderTcad(d,lang,article) {
  const poster=d.projects.find(p=>p.id==='tcad').poster;
  const full=lang==='en'?'View full-size poster':'查看完整海报';
  const download=lang==='en'?'Download PNG':'下载 PNG 原图';
  const posterSection=`<section class="practice-poster" id="poster" aria-labelledby="poster-heading"><h2 id="poster-heading">${t(poster.title,lang)}</h2><figure><a class="image-popup" href="${escape(poster.image)}" title="${t(poster.alt,lang)}"><img src="${escape(poster.preview)}" width="${poster.width}" height="${poster.height}" alt="${t(poster.alt,lang)}" loading="lazy" decoding="async"></a><figcaption>${t(poster.caption,lang)}</figcaption></figure><div class="practice-poster-actions"><a class="image-popup" href="${escape(poster.image)}" title="${t(poster.alt,lang)}">${full}</a><a href="${escape(poster.image)}?download=1" download="codex-tcad-harness-poster.png">${download} ↓</a></div></section>`;
  const hero=article.match(/^\s*<header\b[^>]*\bclass="practice-hero"[^>]*>[\s\S]*?<\/header>/);
  if(!hero) throw new Error(`Missing TCAD hero in ${lang} article`);
  const body=article.slice(0,hero[0].length)+posterSection+article.slice(hero[0].length);
  const sections=lang==='en'?[['poster','Project poster'],['harness','Workflow'],['decisions','Decisions'],['evidence','Evidence'],['receipts','Traceability'],['roles','Roles']]:[['poster','项目海报'],['harness','研究流程'],['decisions','关键决策'],['evidence','仿真证据'],['receipts','证据追溯'],['roles','职责分工']];
  const navigation=`<nav class="project-section-nav" aria-label="${lang==='en'?'Project sections':'项目介绍目录'}">${sections.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</nav>`;
  return doc(d,lang,'tcad',`<main id="main-content" class="project-detail"><p class="project-back"><a href="${base(lang)}#-experience">← ${labels[lang].back}</a></p>${navigation}<article class="practice-detail-article" id="practice-article">${body}</article><p class="project-back"><a href="${base(lang)}#-experience">← ${labels[lang].back}</a></p></main>`);
}

export function renderPublication(d,lang,p) {
  const l=labels[lang],poster=p.poster;
  const back=lang==='en'?'Back to publications':'返回论文列表';
  const full=lang==='en'?'View full-size poster':'查看完整海报';
  const download=lang==='en'?'Download PNG':'下载 PNG 原图';
  const body=`<main id="main-content" class="publication-detail"><p class="publication-back"><a href="${base(lang)}#${p.id}">← ${back}</a></p><article><header><p class="publication-kicker">${lang==='en'?'Paper overview':'论文对外海报'}</p><h1>${escape(p.title)}</h1><p class="publication-authors">${authors(p)}</p>${publicationLinks(p,lang,false)}<p>${t(p.description,lang)}</p><p class="publication-contribution">${t(p.contribution,lang)}</p></header><figure class="paper-poster"><a class="image-popup" href="${poster.image}" title="${t(p.imageAlt,lang)}"><img src="${poster.image}" width="${poster.width}" height="${poster.height}" alt="${t(p.imageAlt,lang)}"></a><figcaption>${lang==='en'?'AI-assisted overview based on the published paper.':'依据已发表论文制作的 AI 辅助概览图。'} ${t(poster.caption,lang)}</figcaption></figure><div class="poster-actions"><a class="image-popup" href="${poster.image}" title="${t(p.imageAlt,lang)}">${full}</a><a href="${poster.image}?download=1" download="${p.id}-paper-poster.png">${download} ↓</a></div><section class="poster-notes"><h2>${lang==='en'?'Figure notes':'图示说明'}</h2><ul>${poster.notes.map(n=>`<li>${t(n,lang)}</li>`).join('')}</ul></section><p class="publication-back"><a href="${base(lang)}#${p.id}">← ${back}</a></p></article></main>`;
  return doc(d,lang,p,body);
}

const softwareLabels = {
  zh: {
    guide: '功能截图与使用方法', download: '下载安装包', source: 'GitHub 源码', release: '对应发布说明',
    index: '本页操作', start: '开始使用', back: '返回科研软件',
    enlarge: '查看原尺寸截图', marks: '图中编号对应下方或图旁的操作。点击截图可查看原尺寸。',
    preview: '本机开发版功能', handout: '下载示例讲义（PDF，3 页）'
  },
  en: {
    guide: 'Screenshots and user guide', download: 'Download desktop app', source: 'Source on GitHub', release: 'Release notes',
    index: 'In this guide', start: 'Getting started', back: 'Back to software',
    enlarge: 'Open full-size screenshot', marks: 'The numbered marks match the instructions beside or below each image. Select an image to open it at full size.',
    preview: 'Desktop development feature', handout: 'Download the example handout (3-page PDF)'
  }
};

function softwareImage(project, name) {
  return `/assets/software/${escape(project.id)}/${escape(name)}.webp`;
}

function softwareIntro(projects, lang) {
  const link = id => {
    const project = projects.find(item => item.id === id);
    return `<a href="${base(lang)}${escape(project.path)}">${t(project.title,lang)}</a>`;
  };
  const reader = link('xireader');
  const workbench = link('knowledge-workbench');
  return lang === 'zh'
    ? `<p>为了在整理笔记时能找回论文里的原图和原话，我开发了 ${reader} 做 PDF 阅读与批注，也开发了 ${workbench} 整理有来源的科研笔记。</p>`
    : `<p>I develop ${reader} for reading and annotating papers, and ${workbench} for turning those excerpts into notes I can trace back to the original page or figure.</p>`;
}

function softwareList(projects, lang) {
  const l = softwareLabels[lang];
  const cards = projects.map(project => {
    const href = base(lang) + escape(project.path);
    const name = t(project.title,lang);
    const cover = project.steps[0];
    return `<article class="software-card">
      <a class="software-cover" href="${href}" aria-label="${name} · ${l.guide}">
        <img src="${softwareImage(project,'cover')}" width="${cover.size[0]}" height="${cover.size[1]}" alt="${t(cover.alt,lang)}" loading="lazy" decoding="async">
      </a>
      <div><h2><a href="${href}">${name}</a></h2>
        <p>${t(project.description,lang)}</p>
        <p class="software-actions"><a href="${href}">${l.guide}</a><a href="${escape(project.repo)}">GitHub</a></p>
      </div>
    </article>`;
  });
  return heading('software',lang) + `<div class="software-list">${cards.join('')}</div>`;
}

function softwareStep(project, step, lang) {
  const l = softwareLabels[lang];
  const [width,height] = step.size;
  const name = t(step.title,lang);
  const image = softwareImage(project,step.id);
  const anchor = escape(step.id);
  const sizeClass = width < 820 ? ' compact' : '';
  return `<section id="${anchor}" class="software-step${sizeClass}" aria-labelledby="title-${anchor}">
    <h2 id="title-${anchor}">${name}</h2>
    ${step.preview ? `<p class="build-note">${l.preview}</p>` : ''}
    <div class="software-instructions">
      <figure><a href="${image}" aria-label="${l.enlarge} · ${name}">
        <img src="${image}" width="${width}" height="${height}" alt="${t(step.alt,lang)}" loading="lazy" decoding="async">
      </a></figure>
      <ol class="software-points">${step.points.map(point => `<li>${t(point,lang)}</li>`).join('')}</ol>
    </div>
  </section>`;
}

export function renderSoftware(data, lang, project) {
  const l = softwareLabels[lang];
  const back = `<a href="${base(lang)}#software">← ${l.back}</a>`;
  // Native fragment navigation also gives a chapter a shareable URL.
  const indexLink = (id, title) => `<li><a href="#${escape(id)}" data-ss-opts='{"excludeWithin":[".software-index"]}'>${title}</a></li>`;
  const toc = indexLink('start',l.start) + project.steps.map(step => indexLink(step.id,t(step.title,lang))).join('');
  const body = `<main id="main-content" class="software-guide">
    <p class="software-back">${back}</p>
    <header class="software-hero">
      <h1>${t(project.title,lang)}</h1><p>${t(project.intro,lang)}</p>
      <p class="software-actions"><a href="${escape(project.repo)}/releases">${l.download}</a><a href="${escape(project.repo)}">${l.source}</a></p>
    </header>
    <div class="software-layout">
      <nav class="software-index" aria-label="${l.index}"><strong>${l.index}</strong>
        <ul>${toc}</ul>
      </nav>
      <div class="software-chapters">
        <section id="start" class="software-start" aria-labelledby="title-start">
          <h2 id="title-start">${l.start}</h2>
          <ol>${project.install.map(line => `<li>${t(line,lang)}</li>`).join('')}</ol>
          <p><a href="/assets/software/rc-filter-handout.pdf" download>${l.handout}</a></p>
          <p class="software-version">${t(project.versionNote,lang)} <a href="${escape(project.repo)}/releases/tag/${escape(project.release)}">${l.release} · ${escape(project.release)}</a></p>
          <p class="software-legend">${l.marks}</p>
        </section>
        ${project.steps.map(step => softwareStep(project,step,lang)).join('')}
        <p class="software-related"><a href="${base(lang)}${escape(project.related.path)}">${t(project.related.label,lang)} →</a></p>
        <p class="software-back">${back}</p>
      </div>
    </div>
  </main>`;
  return doc(data,lang,{...project, kind:'software'},body);
}
