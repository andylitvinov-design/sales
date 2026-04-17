import fs from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const slug = process.argv[2];
const title = process.argv[3] || "Новый лендинг";

if (!slug) {
  console.error("Usage: npm run page:new -- <slug> [title]");
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slug)) {
  console.error("Slug must use lowercase latin letters, numbers, and hyphens only.");
  process.exit(1);
}

const htmlPath = path.resolve(cwd, `${slug}.html`);
const cssPath = path.resolve(cwd, `${slug}.css`);

for (const target of [htmlPath, cssPath]) {
  try {
    await fs.access(target);
    console.error(`File already exists: ${target}`);
    process.exit(1);
  } catch {
    // file does not exist
  }
}

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="Короткое описание страницы для SEO и превью.">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Короткое описание страницы для шаринга.">
  <meta property="og:type" content="website">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${slug}.css?v=1">
</head>
<body>
  <a class="skip-link" href="#main">Перейти к содержанию</a>

  <header class="site-header">
    <div class="shell header-row">
      <a class="brand" href="#top">Brand</a>
      <nav class="nav" aria-label="Основная навигация">
        <a href="#offer">Оффер</a>
        <a href="#details">Детали</a>
        <a href="#contact">Контакт</a>
      </nav>
      <a class="button button-ghost" href="#contact">Основной CTA</a>
    </div>
  </header>

  <main id="main">
    <section id="top" class="hero">
      <div class="shell hero-layout">
        <div class="hero-copy">
          <p class="eyebrow">Категория / формат</p>
          <h1>Один сильный оффер без перегруза на первом экране.</h1>
          <p class="hero-text">
            Коротко объясните, что это за страница, для кого она и какой конкретный следующий шаг вы предлагаете.
          </p>
          <div class="hero-actions">
            <a class="button button-solid" href="#contact">Главный CTA</a>
            <a class="button button-outline" href="#details">Второй шаг</a>
          </div>
        </div>

        <aside class="hero-panel" aria-label="Ключевое предложение">
          <p class="panel-kicker">Рекомендуемый старт</p>
          <h2>Ключевой формат</h2>
          <p class="panel-text">Коротко объясните, почему именно этот вход лучше всего для нового посетителя.</p>
          <ul class="panel-list">
            <li>пункт 1</li>
            <li>пункт 2</li>
          </ul>
          <a class="button button-solid panel-cta" href="#contact">Начать</a>
        </aside>
      </div>
    </section>

    <section id="offer" class="content-section">
      <div class="shell">
        <p class="section-label">Оффер</p>
        <h2>Один смысловой блок на один экран.</h2>
        <p class="section-text">Каждая секция должна выполнять одну задачу: объяснить, доказать, углубить или конвертировать.</p>
      </div>
    </section>

    <section id="details" class="content-section content-section-alt">
      <div class="shell">
        <p class="section-label">Детали</p>
        <h2>Добавьте доказательства и снимите возражения.</h2>
        <p class="section-text">Отзывы, кейсы, процесс, FAQ, ограничения, условия старта.</p>
      </div>
    </section>

    <section id="contact" class="cta-section">
      <div class="shell cta-box">
        <div class="cta-copy">
          <p class="section-label">Контакт</p>
          <h2>Финальный блок с одним главным действием.</h2>
          <p>После создания страницы прогоните: <code>npm run page:audit -- ${slug}.html</code></p>
        </div>
        <div class="cta-actions">
          <a class="button button-solid" href="#">Главный CTA</a>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
`;

const css = `:root {
  --bg: #f4efe7;
  --surface: rgba(255, 251, 246, 0.92);
  --ink: #161817;
  --muted: #5f625f;
  --line: rgba(22, 24, 23, 0.1);
  --accent: #113934;
  --accent-soft: #dce9e2;
  --sand: #b77337;
  --max: 1180px;
  --radius-xl: 34px;
  --radius-lg: 24px;
  --shadow: 0 26px 70px rgba(16, 25, 24, 0.1);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  color: var(--ink);
  font-family: "Sora", sans-serif;
  background: linear-gradient(180deg, #faf7f1 0%, var(--bg) 100%);
}
a { color: inherit; text-decoration: none; }
p, li { line-height: 1.7; }
:focus-visible { outline: 3px solid rgba(17, 57, 52, 0.28); outline-offset: 4px; }

.shell { width: min(var(--max), calc(100% - 32px)); margin: 0 auto; }
.brand, h1, h2, .section-label, .panel-kicker { font-family: "Instrument Serif", serif; }

.skip-link {
  position: absolute;
  top: -48px;
  left: 16px;
  z-index: 100;
  padding: 10px 14px;
  border-radius: 999px;
  color: #fff;
  background: var(--accent);
}
.skip-link:focus-visible { top: 12px; }

.site-header {
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(14px);
  background: rgba(250, 247, 241, 0.82);
  border-bottom: 1px solid rgba(22, 24, 23, 0.06);
}
.header-row {
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.nav { display: flex; flex-wrap: wrap; gap: 18px; }
.nav a { color: var(--muted); font-weight: 600; }

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 12px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 700;
}
.button-solid {
  color: #fbf8f1;
  background: linear-gradient(135deg, #0d302c, var(--accent));
}
.button-outline, .button-ghost {
  border-color: var(--line);
  background: rgba(255, 255, 255, 0.4);
}

.hero, .content-section, .cta-section { padding: 56px 0; }
.hero-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) 360px;
  gap: 30px;
  align-items: start;
}
.eyebrow, .section-label, .panel-kicker {
  margin: 0 0 12px;
  color: var(--sand);
  font-size: 0.96rem;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
h1 {
  margin: 0;
  max-width: 10ch;
  font-size: clamp(2.8rem, 5vw, 4.8rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}
h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}
.hero-text, .section-text, .panel-text, .cta-copy p { color: var(--muted); }
.hero-actions, .cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 20px;
}
.hero-panel, .cta-box {
  padding: 20px;
  border-radius: var(--radius-xl);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow);
}
.panel-list { margin: 12px 0 0; padding-left: 20px; display: grid; gap: 6px; }
.panel-cta { width: 100%; margin-top: 14px; }
.content-section-alt { background: rgba(255, 255, 255, 0.28); }
#top, #offer, #details, #contact { scroll-margin-top: 96px; }

@media (max-width: 1080px) {
  .hero-layout { grid-template-columns: 1fr; }
}

@media (max-width: 720px) {
  .header-row {
    min-height: auto;
    padding: 14px 0;
    flex-direction: column;
    align-items: flex-start;
  }
  .button,
  .hero-actions .button,
  .cta-actions .button {
    width: 100%;
  }
}
`;

await fs.writeFile(htmlPath, html);
await fs.writeFile(cssPath, css);

const url = `http://127.0.0.1:8877/sales/${slug}.html`;
console.log(
  JSON.stringify(
    {
      created: [htmlPath, cssPath],
      url,
      next: [
        `Open: ${url}`,
        `Audit: npm run page:audit -- ${slug}.html`
      ]
    },
    null,
    2
  )
);
