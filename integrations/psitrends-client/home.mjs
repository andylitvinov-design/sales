export const home = {
 en: {
  title:'Alchemy of the Soul | Personal Consultations · PsiTrends', h1:'Alchemy of the Soul',
  lead:'Personal consultations for deeper self-exploration, inner change and clarity.',
  description:'Personal consultations with Andrey Litvinov in Toronto and online. Explore Alchemy of the Soul, Reiki Yggdrasil studies and experiential workshops.',
  byline:'Andrey Litvinov · Toronto + Online', paths:'Three ways to explore.', pathsNote:'A personal question. A deeper study. A shared experience.',
  cards:[['Personal Consultations','Alchemy of the Soul','Individual work with repeating patterns, relationships, inner conflict and important decisions.','Explore consultations','consultations'],['Training','Reiki Yggdrasil · Mysteries','A separate path for structured study, symbolic exploration and experiential learning.','Explore training','training'],['Workshops','Constellations · Mysteries','Group experiences and seminars, with room for reflection and shared discovery.','View workshops','workshops']],
  introTitle:'Start with what matters to you.',intro:'You do not need to know which method to choose. Bring a question, an experience or something you would like to understand more deeply.',
  topics:['A repeating life pattern','A difficult relationship','Uncertainty or inner conflict','An important decision','A feeling of being stuck','A wish to understand yourself'],
  approach:'A conversation, not a fixed formula.',approachText:'Andrey’s integrative approach may draw on imagery and hypnotherapy, systemic work, inner parts, archetypal exploration or body-oriented experience. You discuss what is appropriate together, at a pace you can influence.',
  aboutTitle:'Meet Andrey.',aboutText:'Andrey Litvinov brings together individual consultation, systemic and symbolic approaches, and a long-standing interest in experiential learning. Work begins with your question—not with a list of methods.',
  trainingTitle:'Training & Initiations',trainingIntro:'For those who want to go deeper: study, practice and reflection, distinct from individual consultations.',
  studies:[['Reiki Yggdrasil','Explore the tradition and its approach to practice. Ask about current study formats and prerequisites.'],['Mysteries','Ancient mystery traditions, archetypal themes and symbolic exploration. Discover the background before choosing a program.']],
  trainingCta:'Ask about training',resources:'Explore the Academy & resources',
  workshopsTitle:'Workshops & Seminars',workshopsIntro:'Experiential work in a group setting. Ask about the next available format, location and participation requirements.',
  workshops:[['Systemic / Family Constellations','Explore relationships, roles and different perspectives through a shared experiential format.'],['Mysteries workshops','Study and experience symbolic and archetypal themes through guided group work.']],
  dates:'Dates are confirmed directly. No upcoming schedule is published here yet.',workshopCta:'Ask about workshops',
  final:'What would you like to explore?',finalText:'Start with a short message. Discuss your question, Toronto or online, and whether a session feels appropriate. Fees and availability are agreed before booking.',
 },
 ru:{
  title:'Алхимия души | Индивидуальные консультации · PsiTrends',h1:'Алхимия души',
  lead:'Индивидуальные консультации для самопознания, внутренних изменений и ясности.',
  description:'Индивидуальные консультации Андрея Литвинова в Торонто и онлайн. Алхимия души, обучение Рейки Иггдрасиль и практические семинары.',
  byline:'Андрей Литвинов · Торонто и онлайн',paths:'Три пути исследования.',pathsNote:'Личный вопрос. Глубокое изучение. Совместный опыт.',
  cards:[['Консультации','Алхимия души','Индивидуальная работа с повторяющимися сценариями, отношениями, внутренними противоречиями и важными решениями.','О консультациях','consultations'],['Обучение','Reiki Yggdrasil · Мистерии','Отдельный путь для последовательного изучения традиций, символической работы и практики.','Об обучении','training'],['Семинары','Расстановки · Мистерии','Групповой опыт, практические занятия и пространство для совместного исследования.','О семинарах','workshops']],
  introTitle:'Начните с того, что важно вам.',intro:'Не обязательно заранее выбирать метод. Приходите с вопросом, переживанием или желанием лучше понять себя.',
  topics:['Повторяющийся сценарий','Сложности в отношениях','Неопределённость или внутренний конфликт','Важное решение','Ощущение, что вы застряли','Желание глубже понять себя'],
  approach:'Живой диалог, а не готовая схема.',approachText:'В работе могут сочетаться гипноз и образы, системный подход, исследование внутренних частей и архетипов, символические и телесно-ориентированные практики. Подходящий способ и темп вы обсуждаете вместе.',
  aboutTitle:'Знакомство с Андреем.',aboutText:'Андрей Литвинов объединяет индивидуальное консультирование, системные и символические подходы с интересом к обучению через личный опыт. Отправная точка — ваш вопрос, а не перечень методов.',
  trainingTitle:'Обучение и посвящения',trainingIntro:'Для тех, кто хочет погрузиться глубже: изучение, практика и осмысление опыта. Это отдельное направление, не часть индивидуальной консультации.',
  studies:[['Рейки Иггдрасиль','Познакомьтесь с традицией и её подходом к практике. Уточните актуальные форматы обучения и условия участия.'],['Мистерии','Древние мистериальные традиции, архетипы и символическая работа. Изучите основу перед выбором программы.']],
  trainingCta:'Спросить об обучении',resources:'Академия и библиотека материалов',
  workshopsTitle:'Семинары и практикумы',workshopsIntro:'Исследование через групповой опыт. Уточните ближайшие форматы, место проведения и условия участия.',
  workshops:[['Системные и семейные расстановки','Исследуйте отношения, роли и разные точки зрения в пространстве групповой работы.'],['Мистериальные семинары','Изучение символических и архетипических тем через совместную практику и осмысление.']],
  dates:'Даты уточняются лично. Подтверждённое расписание пока не опубликовано.',workshopCta:'Спросить о семинарах',
  final:'Что вы хотели бы исследовать?',finalText:'Начните с короткого сообщения. Обсудите свой вопрос, формат — Торонто или онлайн — и уместность сессии. Стоимость и время согласовываются до записи.',
 }
};

export function renderHome(locale,{link,cta,asset,escape:e,services}) {
 const c=home[locale],ru=locale==='ru';
 const enquiry=(label,subject)=>`<a class="text-link" data-contact="whatsapp" href="https://wa.me/14376066502?text=${encodeURIComponent(ru?`Здравствуйте, Андрей! Хочу узнать о ${subject}.`:`Hi Andrey, I would like to ask about ${subject}.`)}">${e(label)} <span aria-hidden="true">↗</span></a>`;
 const pair=(items)=>items.map(([title,text])=>`<article class="study-card"><h3>${e(title)}</h3><p>${e(text)}</p></article>`).join('');
 return `<section class="path-section shell" aria-labelledby="paths-heading"><p class="eyebrow">${e(c.pathsNote)}</p><h2 id="paths-heading">${e(c.paths)}</h2><div class="path-grid">${c.cards.map(([title,sub,text,label,id],i)=>`<article class="path-card"><span class="path-number">0${i+1}</span><h3>${e(title)}</h3><p class="path-subtitle">${e(sub)}</p><p>${e(text)}</p><a class="text-link" href="#${id}">${e(label)} <span aria-hidden="true">↗</span></a></article>`).join('')}</div></section>
 <section class="consultation-section" id="consultations"><div class="shell section"><div><p class="eyebrow">${e(c.cards[0][1])} · ${e(c.cards[0][0])}</p><h2>${e(c.introTitle)}</h2><p>${e(c.intro)}</p></div><ul class="topic-list">${c.topics.map(t=>`<li>${e(t)}</li>`).join('')}</ul></div><div class="shell approach" id="explore"><div><h3>${e(c.approach)}</h3><p>${e(c.approachText)}</p></div>${services()}</div></section>
 <section class="shell about-section"><img src="${asset}" width="1075" height="1265" loading="lazy" alt="${ru?'Андрей Литвинов':'Andrey Litvinov'}"><div><p class="eyebrow">${e(c.byline)}</p><h2>${e(c.aboutTitle)}</h2><p>${e(c.aboutText)}</p><a class="text-link" href="${link('about')}">${ru?'Подробнее об Андрее':'More about Andrey'} <span aria-hidden="true">↗</span></a></div></section>
 <section class="training-section" id="training"><div class="shell"><p class="eyebrow">02 · ${ru?'Углублённое изучение':'A deeper study'}</p><h2>${e(c.trainingTitle)}</h2><p class="section-intro">${e(c.trainingIntro)}</p><div class="study-grid">${pair(c.studies)}</div><div class="section-actions">${enquiry(c.trainingCta,ru?'Рейки Иггдрасиль и мистериальном обучении':'Reiki Yggdrasil and Mysteries training')}<a class="text-link" href="${link('academy')}">${e(c.resources)} <span aria-hidden="true">↗</span></a></div></div></section>
 <section class="workshop-section shell" id="workshops"><p class="eyebrow">03 · ${ru?'Совместный опыт':'A shared experience'}</p><h2>${e(c.workshopsTitle)}</h2><p class="section-intro">${e(c.workshopsIntro)}</p><div class="study-grid">${pair(c.workshops)}</div><p class="small">${e(c.dates)}</p>${enquiry(c.workshopCta,ru?'групповых семинарах':'group workshops')}</section>
 <section class="ethics shell"><p>${ru?'Вы можете задавать вопросы, делать паузу и отказаться от упражнения. Опыт индивидуален; работа не заменяет необходимую медицинскую или психиатрическую помощь.':'You can ask questions, pause or decline any exercise. Experiences vary; this work does not replace necessary medical or mental-health care.'}</p></section>`;
}
