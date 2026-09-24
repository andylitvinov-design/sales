// Reviewed, previously published testimonial media. No names, quotes or results are invented.
import {reviewArchive} from './review-archive.mjs';

export const reviews={
 en:{source:4,photos:['photo_2023-05-07_00-12-29.jpg','photo_2023-06-10_01-35-08.jpg','photo_2023-06-10_01-37-44.jpg','photo_2023-06-10_01-37-38.jpg','otzuvu/IMG_20241121_193918_816.jpg','otzuvu/IMG_20241121_193919_060.jpg','otzuvu/IMG_20241121_193919_048.jpg','otzuvu/IMG_20241121_193919_103.jpg'],videos:['Dk0LBmOivQo','1DQF5C3fX9M','aUJde6A-9p0','fE6sD1zr1Js','itjo2_z2NGk','8dz_mJ-KkEc']},
 ru:{source:141,photos:['photo_2023-06-04_21-44-02.jpg','photo_2023-06-04_21-43-48.jpg','photo_2023-05-30_03-18-24.jpg','photo_2023-05-05_06-46-22.jpg','photo_2023-06-06_07-58-46.jpg'],videos:['ttQxUHopaUM','VABgpmn4ZYA','muOnIHllI7E','tmUqLa_Lj3E','MIVLm1GUTtM','LhY_5aUYI2s','KNtBougn3gw']}
};

const titles={
 ttQxUHopaUM:'Бизнес-расстановки. Отзыв',VABgpmn4ZYA:'Бизнес-консультация. Отзыв Татьяны Разумовской',muOnIHllI7E:'Экспресс-диагностика. Отзыв',tmUqLa_Lj3E:'Канал Гермеса. Отчёт Антона',MIVLm1GUTtM:'Отзыв о работе с бизнесом',LhY_5aUYI2s:'Бизнес-консультация. Отзыв',KNtBougn3gw:'Отзыв об экспресс-диагностике',
 Dk0LBmOivQo:'Business Constellation — testimonial','1DQF5C3fX9M':'System business consultation — example','aUJde6A-9p0':'Business consulting — testimonial',fE6sD1zr1Js:'Claire — testimonial',itjo2_z2NGk:'Testimonial about working together','8dz_mJ-KkEc':'Testimonial about readings',
 YGawtSaydpk:'Shamanic constellations — testimonials',rV7stNJJdCM:'Shamanic constellations — testimonial',EDTRXqmIu7E:'Business diagnostics — Irene’s testimonial',YNEfA9ukv1A:'Канал Зевса. Отчёт Ивана','G4Q-Wn1jUck':'Канал Венеры. Отчёт Милы',MABlg7Bkasc:'Канал Афродиты. Отчёт Анны',kQyEsipnzEE:'Канал Гермеса. Отчёт Ольги',i5tCw2ZsntI:'Экспресс-диагностика. Отчёт Яны',HmGC4KZ53aE:'Архетипическая гомеопатия. Кейс Антона','4NrryHcEF1A':'Psychic Alchemy — testimonial',
 hYwRNMxIMjc:'Family constellations — testimonial',XvMdX5czoOc:'Video testimonial — part 1',hjmVJrgEsZ8:'Video testimonial — part 2',u275Zz78vhs:'Video testimonial — part 3',wN_SNwZ1Epo:'Reiki Yggdrasil course — testimonial','3Apc8P1Yudc':'Reiki Yggdrasil course — testimonial 2','3msoUyWr6bY':'Video testimonial — part 4','0G_xvbuClII':'Video testimonial — part 5',Hk9XpeUI0BQ:'Video testimonial — part 6','p29qu8-dtZk':'Video testimonial — part 8',Nx8DwWk27VY:'Video testimonial — part 7',
 qM_nFUkYJ1k:'Тантра Рейки. Отзыв Алёны',hVJr0YfLLaQ:'Курс МААТ. Отчёт Оли',dArVIoSKXIQ:'Курс МААТ. Отчёт Ольги',IYXE7Lw_Bq4:'Курс МААТ. Отчёт Марины'
};

const ruArchive={
 photos:[...reviewArchive[0].photos,...reviewArchive[2].photos,...reviewArchive[3].photos],
 videos:['YNEfA9ukv1A','G4Q-Wn1jUck','MABlg7Bkasc','kQyEsipnzEE','i5tCw2ZsntI','HmGC4KZ53aE','qM_nFUkYJ1k','hVJr0YfLLaQ','dArVIoSKXIQ','IYXE7Lw_Bq4'],
 files:[
  {file:'video_2023-12-05_19-16-19.mp4',poster:'Снимок экрана 2023-12-05 191732.png',title:'Видеоотзыв участника сессии'},
  {file:'video_2024-01-16_11-06-01.mp4',poster:'Снимок экрана 2024-01-16 111348.png',title:'Тантра Рейки. Видеоотзыв участницы'},
  {file:'video.mp4',poster:'Снимок экрана 2024-01-16 111728.png',title:'Тантра Рейки. Видеоотзыв участницы'}
 ]
};
const enArchive={photos:reviewArchive[1].photos,videos:['YGawtSaydpk','rV7stNJJdCM','EDTRXqmIu7E','4NrryHcEF1A',...reviewArchive[1].videos],files:[]};

const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const imageUrl=(file,source)=>`${source?'https://psitrends.com':''}/images/${file.split('/').map(encodeURIComponent).join('/')}`;
const thumbnailUrl=(id,source)=>`${source?'integrations/psitrends-client':'/psitrends-client-assets'}/review-thumbnails/${id}.webp`;

export function videoCard(id,label,ru,source=false){
 const title=label||titles[id]||id,play=ru?'Воспроизвести видео':'Play video';
 return `<article class="review-video"><div class="video-stage"><a class="video-load video-poster" data-video="${id}" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer" aria-label="${escape(play)}: ${escape(title)}"><img class="video-thumbnail" src="${thumbnailUrl(id,source)}" loading="lazy" width="480" height="360" alt=""><span class="play-button" aria-hidden="true">▶</span></a></div><h4>${escape(title)}</h4><a class="video-original" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">${ru?'Открыть на YouTube':'Open on YouTube'} <span class="link-arrow" aria-hidden="true"></span></a></article>`;
}

function nativeCard(video,ru,source){
 const url=imageUrl(video.file,source),poster=imageUrl(video.poster,source);
 return `<article class="review-video"><video controls preload="none" playsinline poster="${poster}" aria-label="${escape(video.title)}"><source src="${url}" type="video/mp4"><a href="${url}">${ru?'Открыть видео':'Open video'}</a></video><h4>${escape(video.title)}</h4><a class="video-original" href="${url}" target="_blank" rel="noopener noreferrer">${ru?'Оригинальное видео с сайта':'Original website video'} <span class="link-arrow" aria-hidden="true"></span></a></article>`;
}

function gallery(items){return items.length?`<div class="review-grid">${items.join('')}</div>`:'';}
function section(id,title,videos,photos,files,ru,source){
 const videoCards=videos.map(id=>videoCard(id,titles[id],ru,source));
 const photoCards=photos.map(file=>{const url=imageUrl(file,source);return `<a class="review-photo" href="${url}" target="_blank" rel="noopener noreferrer"><img src="${url}" loading="lazy" width="480" height="360" alt="${escape(title)}: ${ru?'фотоотзыв':'photo testimonial'}"><span>${ru?'Открыть фотоотзыв':'Open photo testimonial'} <span class="link-arrow" aria-hidden="true"></span></span></a>`;});
 return `<section class="review-group" id="${id}"><h3>${title}</h3>${videos.length||files.length?`<h4 class="review-kind">${ru?'Видеоотзывы':'Video testimonials'}</h4>${gallery([...videoCards,...files.map(v=>nativeCard(v,ru,source))])}`:''}${photos.length?`<h4 class="review-kind">${ru?'Фотоотзывы':'Photo testimonials'}</h4>${gallery(photoCards)}`:''}</section>`;
}

export function renderReviews(locale,{source=false}={}){
 const ru=locale==='ru';
 const groups=ru?[
  {id:'reviews-ru',title:'Отзывы на русском',videos:[...reviews.ru.videos,...ruArchive.videos],photos:[...reviews.ru.photos,...ruArchive.photos],files:ruArchive.files},
  {id:'reviews-en',title:'Отзывы на английском',videos:[...reviews.en.videos,...enArchive.videos],photos:[...reviews.en.photos,...enArchive.photos],files:[]}
 ]:[{id:'reviews-en',title:'Testimonials in English',videos:[...reviews.en.videos,...enArchive.videos],photos:[...reviews.en.photos,...enArchive.photos],files:[]}];
 const videoSections=groups.map(g=>section(`${g.id}-video`,g.title,g.videos,[],g.files,ru,source)).join('');
 const photoSections=groups.map(g=>section(`${g.id}-photo`,g.title,[],g.photos,[],ru,source)).join('');
 return `<section class="reviews-section shell" id="reviews" aria-labelledby="reviews-title"><p class="eyebrow">${ru?'Личный опыт':'Personal experiences'}</p><h2 id="reviews-title">${ru?'Отзывы и истории участников':'Reviews and participant stories'}</h2><p class="section-intro">${ru?'Сохранённые оригинальные отзывы о сессиях и обучении. Видео размещены первыми, затем фото. Это индивидуальный опыт, а не обещание результата или медицинская рекомендация.':'Preserved original testimonials about sessions and learning. Videos are shown first, then photos. These are individual experiences, not promised outcomes or medical advice.'}</p><p class="small">${ru?'На русской странице сначала собраны отзывы на русском, затем — на английском. Плеер YouTube загружается только после нажатия Play.':'This English page contains English-language reviews only. The YouTube player loads only after you press Play.'}</p><nav class="academy-jump" aria-label="${ru?'Разделы отзывов':'Review categories'}"><a href="#reviews-video">${ru?'Видеоотзывы':'Video testimonials'}</a><a href="#reviews-photo">${ru?'Фотоотзывы':'Photo testimonials'}</a>${ru?'<a href="#reviews-ru-video">На русском</a><a href="#reviews-en-video">In English</a>':''}</nav><div id="reviews-video">${videoSections}</div><div id="reviews-photo">${photoSections}</div></section>`;
}
