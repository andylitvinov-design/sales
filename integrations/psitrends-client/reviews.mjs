// Original published testimonial sections: Quix page 4 (EN), page 141 (RU).
// Preserve source media, without inventing names, quotes or outcome claims.
import {reviewArchive} from './review-archive.mjs';
export const reviews={
 en:{source:4,photos:['photo_2023-05-07_00-12-29.jpg','photo_2023-06-10_01-35-08.jpg','photo_2023-06-10_01-37-38.jpg','photo_2023-06-10_01-37-44.jpg','otzuvu/IMG_20241121_193918_816.jpg','otzuvu/IMG_20241121_193919_060.jpg','otzuvu/IMG_20241121_193919_048.jpg','otzuvu/IMG_20241121_193919_103.jpg'],videos:['Dk0LBmOivQo','1DQF5C3fX9M','OrdMvKn2Zg8','aUJde6A-9p0','fE6sD1zr1Js','itjo2_z2NGk','8dz_mJ-KkEc']},
 ru:{source:141,photos:['photo_2023-06-04_21-44-02.jpg','photo_2023-06-04_21-43-48.jpg','photo_2023-05-30_03-18-24.jpg','photo_2023-05-05_06-46-22.jpg','photo_2023-06-06_07-58-46.jpg'],videos:['ttQxUHopaUM','VABgpmn4ZYA','muOnIHllI7E','tmUqLa_Lj3E','MIVLm1GUTtM','LhY_5aUYI2s','KNtBougn3gw']}
};
export function videoCard(id,label,ru){
 const externalOnly=id==='OrdMvKn2Zg8'; // Existing video returns oEmbed 403: retain source without a broken embedded player.
 return `<article class="review-video"><div class="video-stage"><a class="video-load"${externalOnly?'':` data-video="${id}"`} href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer"><span class="play-symbol" aria-hidden="true">▶</span><span>${label}</span><small>${externalOnly?(ru?'Оригинал на YouTube · встраивание недоступно':'YouTube original · embedding unavailable'):(ru?'Загрузить видео':'Load video')}</small></a></div><a class="video-original" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">${ru?'Открыть на YouTube':'Open on YouTube'} <span class="link-arrow" aria-hidden="true"></span></a></article>`;
}
export function renderReviews(locale,{source=false}={}){
 const ru=locale==='ru';
 const ordered=[reviews[locale],reviews[ru?'en':'ru']];
 const groups=[{id:'home',ru:'Отзывы с прежней главной · RU + EN',en:'Original homepage reviews · RU + EN',sources:[4,18,105,141],photos:ordered.flatMap(x=>x.photos),videos:ordered.flatMap(x=>x.videos),files:[]},...reviewArchive];
 const mediaUrl=file=>`${source?'https://psitrends.com':''}/images/${file.split('/').map(encodeURIComponent).join('/')}`;
 const grid=items=>items.length?`<div class="review-grid">${items.join('')}</div>`:'';
 const sections=groups.map(g=>{
  const title=ru?g.ru:g.en;
  const photos=g.photos.map((file,i)=>{const url=mediaUrl(file);return `<a class="review-photo" href="${url}" target="_blank" rel="noopener noreferrer"><img src="${url}" loading="lazy" width="480" height="360" alt="${title}: ${ru?'фотоотзыв':'photo testimonial'} ${i+1}"><span>${ru?'Открыть отзыв':'Read original review'} ${i+1} <span class="link-arrow" aria-hidden="true"></span></span></a>`;});
  const videos=g.videos.map((id,i)=>videoCard(id,`${title} · ${i+1}`,ru));
  const files=g.files.map((file,i)=>{const url=mediaUrl(file);return `<article class="review-video"><video controls preload="none" playsinline aria-label="${title}: ${ru?'видеоотзыв':'video testimonial'} ${g.videos.length+i+1}"><source src="${url}" type="video/mp4"><a href="${url}">${ru?'Открыть видео':'Open video'}</a></video><a class="video-original" href="${url}" target="_blank" rel="noopener noreferrer">${ru?'Оригинальное видео с сайта':'Original website video'} ${i+1} <span class="link-arrow" aria-hidden="true"></span></a></article>`;});
  return `<section class="review-group" id="reviews-${g.id}"><h3>${title}</h3><p class="small">${g.photos.length} ${ru?'фото':'photos'} · ${g.videos.length+g.files.length} ${ru?'видео':'videos'}</p>${grid(photos)}${grid([...videos,...files])}</section>`;
 }).join('');
 return `<section class="reviews-section shell" id="reviews" aria-labelledby="reviews-title"><p class="eyebrow">${ru?'Личный опыт':'Personal experiences'}</p><h2 id="reviews-title">${ru?'Отзывы и истории участников':'Reviews &amp; participant stories'}</h2><p class="section-intro">${ru?'Общий архив отзывов на русском и английском: с прежних главных страниц, о сессиях и об обучении. 37 фото и 42 видеоматериала — оригиналы без сокращения подборки. Это индивидуальный опыт, а не обещание результата или медицинская рекомендация.':'The combined Russian and English archive: original homepage, session and course testimonials. 37 photos and 42 videos, preserved without shortening the collection. These are individual experiences, not promised outcomes or medical advice.'}</p><p class="small">${ru?'Все карточки доступны ниже без раскрытия скрытых подборок. Видео загружается по нажатию; YouTube подключается только при загрузке его плеера.':'All entries are shown below, without collapsed collections. Videos load on request; YouTube connects only when its player is loaded.'}</p><nav class="academy-jump" aria-label="${ru?'Разделы отзывов':'Review categories'}">${groups.map(g=>`<a href="#reviews-${g.id}">${ru?g.ru:g.en}</a>`).join('')}</nav>${sections}</section>`;
}
