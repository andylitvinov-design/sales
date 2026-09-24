import {authorProfiles,pages,shared,routes} from './content.mjs';
import {home,renderHome} from './home.mjs';
import {renderReviews} from './reviews.mjs';
import {renderAcademy} from './academy.mjs';
import {renderArchivePreview,renderEvents} from './events.mjs';
import catalog from './academy-catalog.json' with {type:'json'};
export const sourceName=(key,locale)=>`psitrends-client-${key}${locale==='ru'?'-ru':''}`;
export const routeFor=(key,locale)=>locale==='ru'?`/ru${routes[key]}`:routes[key];
const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function render(key,locale,{source=false,production=false}={}){
 const c=key==='home'?{...pages[locale][key],...home[locale]}:pages[locale][key],s={...shared[locale],...{final:home[locale].final,finalText:home[locale].finalText}},other=locale==='en'?'ru':'en';
 const link=(k,l=locale)=>source?`${sourceName(k,l)}.html`:routeFor(k,l);
 const asset=path=>source?`integrations/psitrends-client/${path.startsWith('events/')?'events-assets/':''}${path}`:`/psitrends-client-assets/${path}`;
 const portrait=asset(['home','about'].includes(key)?'andy-library-desk.png':'andrey.jpg');
 const css=source?`${sourceName(key,locale)}.css?v=6`:'/psitrends-client-assets/psitrends-client.css?v=6';
 const js=source?'psitrends-client.js?v=6':'/psitrends-client-assets/psitrends-client.js?v=6';
 const atmosphere=asset('archway.webp');
 const heritage=source?'output/psitrends-local-copy-assets/photo_2023-01-27_06-22-45.jpg':'/images/photo_2023-01-27_06-22-45.jpg';
 const arrow='<span class="link-arrow" aria-hidden="true"></span>';
 const homeAnchor=id=>`${key==='home'?'':link('home')}#${id}`;
 const navItems=[['consultations',locale==='en'?'Consultations':'Консультации'],['training',locale==='en'?'Training':'Обучение'],['workshops',locale==='en'?'Workshops':'Семинары']];
 const canonical=`https://psitrends.com${routeFor(key,locale)}`;
 const message=locale==='ru'?'Здравствуйте, Андрей! Хочу обсудить индивидуальную сессию.':'Hi Andrey, I would like to ask about an individual session.';
 const cta=()=>`<a class="button" data-contact="whatsapp" href="https://wa.me/14376066502?text=${encodeURIComponent(message)}">${esc(s.cta)} ${arrow}</a>`;
 const section=(title,text,id='')=>`<section class="section shell"${id?` id="${id}"`:''}><div class="section-heading"><p class="eyebrow">${esc(s.labels[key])}</p><h2>${esc(title)}</h2></div><div class="section-copy"><p>${esc(text)}</p></div></section>`;
 const services=()=>`<div class="service-links">${['hypnotherapy','constellations'].map(k=>`<a class="service-link" href="${link(k)}"><span>${esc(s.labels[k])}</span>${arrow}</a>`).join('')}</div>`;
 const authorProfile=()=>{
  const profile=authorProfiles[locale];
  return `<section class="author-profile shell" id="explore"><article class="reading-column"><section class="profile-chapter"><h2>${esc(profile.experienceTitle)}</h2><ol class="profile-list profile-experience">${profile.experience.map(item=>`<li>${esc(item)}</li>`).join('')}</ol></section><section class="profile-chapter"><h2>${esc(profile.studiesTitle)}</h2><ol class="profile-list profile-studies">${profile.studies.map(([title,text])=>`<li><h3>${esc(title)}</h3><p>${esc(text)}</p></li>`).join('')}</ol></section><section class="profile-chapter"><h2>${esc(profile.tantricTitle)}</h2><p>${esc(profile.tantricIntro)}</p>${profile.psychotherapy.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}<p>${esc(profile.bodywork.intro)}</p><ul class="profile-bodywork">${profile.bodywork.schools.map(school=>`<li>${esc(school)}</li>`).join('')}</ul>${profile.narrative.map(paragraph=>`<p>${esc(paragraph)}</p>`).join('')}</section></article></section>${renderReviews(locale,{source})}<section class="author-explore shell" aria-labelledby="explore-work-title"><div><p class="eyebrow">PsiTrends</p><h2 id="explore-work-title">${esc(profile.exploreTitle)}</h2></div><nav class="author-explore-links" aria-label="${esc(profile.exploreTitle)}"><a href="${link('hypnotherapy')}">${esc(profile.explore.sessions)} <span aria-hidden="true">↗</span></a><a href="#contact">${esc(profile.explore.workshops)} <span aria-hidden="true">↗</span></a><a href="${link('academy')}">${esc(profile.explore.academy)} <span aria-hidden="true">↗</span></a></nav>${cta()}</section>`;
 };
 const hero=key==='about'?authorProfiles[locale].hero:c;
 let body=key==='about'?authorProfile():key==='events'?renderEvents(locale,{asset,escape:esc}):section(c.introTitle,c.intro,'explore');
 if(key==='home')body+=`<section class="section shell"><div class="section-heading"><p class="eyebrow">${locale==='en'?'Individual practice':'Индивидуальная практика'}</p><h2>${esc(c.serviceTitle)}</h2></div>${services()}</section>`;
 if(key!=='about'&&c.detail)body+=section(c.detailTitle,c.detail);
 if(['home','hypnotherapy','constellations'].includes(key))body+=`<section class="process-band" id="process"><div class="shell"><p class="eyebrow">${locale==='en'?'A shared process':'Совместная работа'}</p><h2>${esc(s.processTitle)}</h2><p class="intro">${esc(s.processIntro)}</p><ol class="process-list">${s.process.map(([title,text],i)=>`<li><span class="step-number" aria-hidden="true">0${i+1}</span><div><h3>${esc(title)}</h3><p>${esc(text)}</p></div></li>`).join('')}</ol></div></section>`;
 if(c.business)body+=section(c.businessTitle,c.business,'business');
 if(key!=='about'&&c.support)body+=section(c.supportTitle,c.support);
 if(c.links)body+=`<section class="section shell"><div class="section-heading"><p class="eyebrow">${locale==='en'?'Learning archive':'Архив материалов'}</p><h2>${esc(c.libraryTitle)}</h2></div><div class="library-list">${c.links.map(([title,desc,path])=>`<a href="https://psitrends.com${path}"><h3>${esc(title)} ${arrow}</h3><p>${esc(desc)}</p></a>`).join('')}</div></section>`;
 if(c.faq)body+=`<section class="section shell"><div class="section-heading"><p class="eyebrow">${locale==='en'?'Before you decide':'Перед выбором'}</p><h2>${locale==='en'?'A few practical questions.':'Несколько практических вопросов.'}</h2></div><div class="faq">${c.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div></section>`;
 if(key!=='academy'&&key!=='events'&&key!=='about')body+=section(s.expectationsTitle,s.expectations);
 if(key==='home')body+=`<section class="academy-band"><div class="shell"><p class="eyebrow">PsiTrends Academy</p><h2>${esc(c.academyTitle)}</h2><p>${esc(c.academyText)}</p><a class="text-link" href="${link('academy')}">${esc(s.labels.academy)} ${arrow}</a></div></section>`;
 if(key==='about')body+=renderArchivePreview(locale,{asset,escape:esc,href:link('events')});
 if(key==='academy')body+=`<section class="shell related"><h2>${locale==='en'?'Explore individual sessions.':'Индивидуальные сессии.'}</h2>${services()}</section>`;
 if(key==='home')body=renderHome(locale,{link,cta,assets:{portrait,atmosphere,heritage},escape:esc,services});
 if(key==='home')body+=renderReviews(locale,{source});
 if(key==='academy')body=renderAcademy(locale,catalog,esc,{source})+body;
 return `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="data:,">
<title>${esc(c.title)}</title>
<meta name="description" content="${esc(c.description)}">
<meta name="robots" content="${production?'index, follow':'noindex, nofollow'}">
${production?`<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en-GB" href="https://psitrends.com${routeFor(key,'en')}">
<link rel="alternate" hreflang="ru-RU" href="https://psitrends.com${routeFor(key,'ru')}">
`:''}
<meta property="og:title" content="${esc(c.title)}">
<meta property="og:description" content="${esc(c.description)}">
<meta property="og:type" content="website">
${production?`<meta property="og:url" content="${canonical}">`:""}
<link rel="stylesheet" href="${css}">
<script src="${js}" defer></script>
${production?`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':['hypnotherapy','constellations'].includes(key)?'Service':'WebPage',name:c.title,url:canonical,inLanguage:locale,...(['hypnotherapy','constellations'].includes(key)?{provider:{'@type':'Person',name:'Andrey Litvinov',url:'https://psitrends.com/about'},areaServed:{'@type':'City',name:'Toronto'}}:{})})}</script>`:''}
</head>
<body data-analytics-mode="${production?'consent':'off'}" data-page="${key}" data-locale="${locale}">
<a class="skip-link" href="#main">${esc(s.skip)}</a>
<header class="site-header"><div class="shell header-top"><a class="brand" href="${link('home')}">PsiTrends<span>Holistic House</span></a><nav class="nav" id="primary-nav" aria-label="${esc(s.nav)}">${navItems.map(([id,label])=>`<a href="${homeAnchor(id)}">${label}</a>`).join('')}${['about','events','contact'].map(k=>`<a href="${link(k)}"${k===key?' aria-current="page"':''}>${locale==='en'&&k==='about'?'About':esc(s.labels[k])}</a>`).join('')}</nav><div class="header-controls"><span class="current-language" title="${locale==='en'?'Current language: English':'Текущий язык: русский'}">${locale.toUpperCase()}</span><a class="language" href="${link(key,other)}" lang="${other}" hreflang="${other}" aria-label="${esc(s.switch)}">${other.toUpperCase()}</a><button class="menu-toggle" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="${locale==='en'?'Open menu':'Открыть меню'}"><span></span><span></span></button></div></div></header>
<main id="main">
${key==='events'?'':`<section class="hero${key==='home'?' hero--home':''}"><div class="shell hero-layout"><div class="hero-copy"><p class="eyebrow">${esc(key==='academy'?(locale==='en'?'Methods · Books · Traditions':'Методы · Книги · Традиции'):s.eyebrow)}</p><h1>${esc(hero.h1)}</h1>${key==='about'?hero.intro.map(p=>`<p class="lead">${esc(p)}</p>`).join(''):`<p class="lead">${esc(c.lead)}</p><p class="byline">${esc(home[locale].byline)}</p><div class="hero-actions">${cta()}</div><p class="small">${esc(s.note)}</p>`}<a class="text-link hero-more" href="#explore">${locale==='en'?'Explore the approach':'Узнать о подходе'} <span class="link-arrow link-arrow--down" aria-hidden="true"></span></a></div>${key==='home'?`<div class="hero-visual"><figure class="hero-portrait"><img src="${portrait}" width="1079" height="1057" alt="${esc(s.portrait)}" fetchpriority="high"></figure><figure class="hero-atmosphere"><img src="${atmosphere}" width="1200" height="800" alt="" loading="lazy"></figure></div>`:`<figure class="portrait ${key==='about'?'':'atmosphere'}"><img src="${key==='about'?portrait:atmosphere}" width="${key==='about'?1079:1536}" height="${key==='about'?1057:1024}" alt="${key==='about'?esc(s.portrait):''}" fetchpriority="high">${key==='about'?`<figcaption>${esc(s.caption)}</figcaption>`:''}</figure>`}</div></section>`}
${body}
<section class="contact-band" id="contact"><div class="shell contact-layout"><div><p class="eyebrow">${esc(s.labels.contact)}</p><h2>${esc(s.final)}</h2><p>${esc(s.finalText)}</p></div><div class="contact-actions">${cta()}<p>${esc(s.fallback)} <a data-contact="telegram" href="https://t.me/AndyTherapist">${esc(s.telegram)}</a></p><p><a data-contact="call" href="tel:+14376066502">${esc(s.phone)}&nbsp;+1&nbsp;437&nbsp;606&nbsp;6502</a></p></div></div></section>
</main>
<footer class="shell footer"><p class="footer-brand">PsiTrends <span>· Holistic House</span></p><p>${esc(s.footer)}</p><a class="text-link" href="${link('academy')}">${esc(home[locale].resources)}</a><details id="privacy"><summary>${esc(s.privacy)}</summary><p>${esc(s.privacyText)}</p></details><details id="analytics-choice"><summary>${esc(s.analytics)}</summary><p>${esc(s.analyticsText)}</p><div class="consent-buttons"><button type="button" data-analytics="allow">${esc(s.allow)}</button><button type="button" data-analytics="deny">${esc(s.deny)}</button></div><p id="analytics-status" role="status">${esc(s.off)}</p></details></footer>
</body>
</html>
`;
}
