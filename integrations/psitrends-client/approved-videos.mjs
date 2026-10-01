// Approved existing renders only. Runtime/source record: ai-projects-brain #219.
// Drive masters remain canonical; this module never generates or uploads media.
export const approvedVideos = {
  "en": {
    "home": {
      "id": "ed202847a43a96b918308aa972177b34",
      "duration": 29,
      "title": "Deeper personal work at Holistic House",
      "transcript": [
        "Holistic House is a space for deeper personal work.",
        "I help you look beneath the surface of a problem and understand the patterns behind your emotions, relationships, or important decisions.",
        "I work with systemic constellations, hypnotherapy, homeopathy, and archetypal methods — different ways of looking at the same situation.",
        "If you want to understand what is really happening and find a clearer next step, you can begin with a personal consultation."
      ],
      "poster": "home-en-v2.webp"
    },
    "services": {
      "id": "48105a2f2228e7cb3a67391e97acaf8b",
      "duration": 29,
      "title": "How I choose the right method",
      "transcript": [
        "My work is built around one idea: first understand the deeper structure of the situation, then choose the method that fits it.",
        "For business questions, I use systemic constellations to look at projects, roles, relationships, money, and decisions.",
        "For personal work, I may use hypnotherapy, imagery, homeopathy, and archetypal approaches.",
        "You do not need to choose the method in advance. We begin with your situation and decide together which direction is most useful."
      ],
      "poster": "services-en-v2.webp"
    },
    "homeopathy": {
      "id": "34df311e461509433b45929908a9097a",
      "duration": 31,
      "title": "My approach to homeopathy",
      "transcript": [
        "For me, homeopathy is not simply a list of remedies for symptoms.",
        "I look at the whole pattern of a person’s experience — emotions, reactions, repeating themes, and the way different parts of the situation connect.",
        "Homeopathy can be one of the tools I use within a broader personal exploration.",
        "On this site, the remedy library is educational. It can help you learn about different remedy patterns, but it does not replace medical diagnosis or treatment."
      ],
      "poster": "homeopathy-en-v2.webp"
    }
  },
  "ru": {
    "home": {
      "id": "388a04b39ebf215ae656bcd22d0d0847",
      "duration": 31,
      "title": "Глубокая личная работа в Holistic House",
      "transcript": [
        "Holistic House — это пространство для более глубокой личной работы.",
        "Я помогаю смотреть не только на поверхность проблемы, а исследовать паттерны, которые стоят за эмоциями, отношениями или важными решениями.",
        "В работе я использую системные расстановки, гипнотерапию, гомеопатию и архетипические методы — разные способы исследовать одну и ту же ситуацию.",
        "Если вы хотите глубже понять, что происходит, и найти более ясный следующий шаг, можно начать с личной консультации."
      ],
      "poster": "home-ru-v1.webp"
    },
    "services": {
      "id": "79c2845577865979cd95ac40a08fc01a",
      "duration": 33,
      "title": "Как я выбираю подходящий метод",
      "transcript": [
        "В основе моей работы одна идея: сначала понять более глубокую структуру ситуации, а затем выбрать подходящий метод.",
        "Для бизнес-запросов я использую системные расстановки, чтобы исследовать проекты, роли, отношения, деньги и решения.",
        "В личной работе я могу использовать гипнотерапию, образную работу, гомеопатию и архетипические подходы.",
        "Вам не нужно заранее выбирать метод. Мы начинаем с вашей ситуации и вместе определяем, какое направление сейчас будет наиболее полезным."
      ],
      "poster": "services-ru-v1.webp"
    },
    "homeopathy": {
      "id": "0f984780d06948b1e78166e6e553e4e9",
      "duration": 32,
      "title": "Мой подход к гомеопатии",
      "transcript": [
        "Для меня гомеопатия — это не просто список препаратов для отдельных симптомов.",
        "Я смотрю на целостный паттерн опыта человека: эмоции, реакции, повторяющиеся темы и то, как разные части ситуации связаны между собой.",
        "Гомеопатия может быть одним из инструментов, которые я использую в более широком исследовании ситуации.",
        "Справочник препаратов на этом сайте носит образовательный характер. Он помогает знакомиться с разными паттернами препаратов, но не заменяет медицинскую диагностику или лечение."
      ],
      "poster": "homeopathy-ru-v1.webp"
    }
  }
};
export const videoPlacements = Object.freeze({home:'home',hypnotherapy:'services',constellations:'services',about:'homeopathy'});
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function renderApprovedVideo(page,locale,{asset}={}) {
 const kind=videoPlacements[page],video=approvedVideos[locale]?.[kind];
 if(!video)return '';
 if(typeof asset!=='function')throw new Error('Local asset resolver is required');
 const ru=locale==='ru',watch=`https://app.heygen.com/share/${video.id}`;
 const play=ru?'Смотреть видео':'Watch video',transcript=ru?'Текст видео':'Transcript';
 const library=kind==='homeopathy'?`<p class="approved-video-context">${ru?'Справочник, упомянутый в видео, находится на сайте':'The remedy library mentioned in this video is on'} <a href="https://holistichouse.vercel.app/${locale}/homeopathy">Holistic House <span aria-hidden="true">↗</span></a>.</p>`:'';
 return `<figure class="approved-video" data-approved-video="${video.id}" data-approved-video-locale="${locale}" aria-label="${escape(video.title)}" lang="${locale}">
<div class="approved-video-frame"><a class="approved-video-play" data-approved-play href="${watch}" target="_blank" rel="noopener noreferrer" aria-label="${play}: ${escape(video.title)}"><img src="${asset(`approved-video-posters/${video.poster}`)}" width="1280" height="720" loading="lazy" decoding="async" alt=""><span class="approved-video-play-icon" aria-hidden="true">▶</span><span class="approved-video-duration" aria-hidden="true">0:${String(video.duration).padStart(2,'0')}</span></a></div>
<figcaption class="approved-video-caption"><details><summary>${transcript}</summary><div class="approved-video-transcript">${video.transcript.map(p=>`<p>${escape(p)}</p>`).join('')}<a href="${watch}" target="_blank" rel="noopener noreferrer">${ru?'Открыть в HeyGen':'Open in HeyGen'}</a></div></details><span class="approved-video-disclosure" title="${ru?'Видео с цифровым двойником и голосом Андрея':'Video using Andrey’s digital twin and voice'}">${ru?'ИИ-аватар':'AI avatar'}</span></figcaption>${library}</figure>`;
}
