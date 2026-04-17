const DATA_URL = `reports/landing-metric-dashboard-data.json?v=${Date.now()}`;

const summaryGrid = document.getElementById("summaryGrid");
const pageList = document.getElementById("pageList");
const pageDetail = document.getElementById("pageDetail");
const metricModel = document.getElementById("metricModel");
const problemMap = document.getElementById("problemMap");
const generatedAt = document.getElementById("generatedAt");
const freshnessNote = document.getElementById("freshnessNote");
const refreshHint = document.getElementById("refreshHint");
const priorityStrip = document.getElementById("priorityStrip");
const compareForm = document.getElementById("compareForm");
const compareResult = document.getElementById("compareResult");

const GENERIC_CTA_RE = /\b(learn more|read more|more|submit|send|далее|подробнее|узнать больше)\b/i;
const ACTION_CTA_RE = /\b(start|get|book|request|talk|write|contact|apply|see|choose|начать|запис|напис|получ|выбрать|обсуд|остав)\b/i;
const PRICE_RE = /(?:€|\$|£|donation|\d+\s?(?:€|\$|£|eur|usd|руб|₽|мес))/i;

let state = {
  data: null,
  selectedSlug: null
};

function statusClass(score) {
  if (score >= 85) return "strong";
  if (score >= 70) return "workable";
  if (score >= 55) return "at-risk";
  return "weak";
}

function statusLabel(status) {
  return (
    {
      strong: "сильный",
      workable: "рабочий",
      "at-risk": "риск",
      weak: "слабый"
    }[status] || status
  );
}

function metricLabel(label) {
  return (
    {
      Clarity: "Ясность оффера",
      "CTA System": "Система CTA",
      Proof: "Доверие и доказательства",
      "Offer Depth": "Глубина оффера",
      Scannability: "Сканируемость",
      Focus: "Фокус",
      Technical: "Техническое состояние"
    }[label] || label
  );
}

function metricFillClass(score) {
  if (score < 55) return "metric-fill is-weak";
  if (score < 70) return "metric-fill is-risk";
  return "metric-fill";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function hoursSince(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return (Date.now() - date.getTime()) / 3600000;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderSummary(data) {
  generatedAt.textContent = `Снимок: ${formatDate(data.generatedAt)}`;
  const ageHours = hoursSince(data.generatedAt);
  if (ageHours == null) {
    freshnessNote.textContent = "Актуальность: неизвестно.";
  } else if (ageHours <= 24) {
    freshnessNote.textContent = "Актуальность: свежий снимок.";
  } else if (ageHours <= 72) {
    freshnessNote.textContent = `Актуальность: снимок стареет (${Math.round(ageHours)} ч назад).`;
  } else {
    freshnessNote.textContent = `Актуальность: снимок устарел (${Math.round(ageHours)} ч назад).`;
  }
  refreshHint.textContent = "Обновление: npm run dashboard:build";

  const metricAverages = data.metricModel.map((metric) => {
    const average = Math.round(
      data.pages.reduce((sum, page) => {
        const match = page.metricBreakdown.find((item) => item.id === metric.id);
        return sum + (match?.score ?? 0);
      }, 0) / Math.max(data.pages.length, 1)
    );

    return {
      ...metric,
      average
    };
  });

  const riskiestPage = [...data.pages].sort((a, b) => a.overall - b.overall)[0];
  const keyMetrics = metricAverages.filter((metric) => ["clarity", "cta", "proof"].includes(metric.id));
  const weakestMetric = [...metricAverages].sort((a, b) => a.average - b.average)[0];

  const cards = [
    {
      label: "Общий балл",
      value: `${data.summary.averageScore}/100`,
      caption: "Средний взвешенный балл по всем лендингам"
    },
    {
      label: "Худшая страница",
      value: `${riskiestPage?.overall ?? "—"}/100`,
      caption: riskiestPage?.file ?? "Страница не найдена"
    },
    {
      label: "Критичные страницы",
      value: `${data.summary.criticalPages}/${data.summary.pageCount}`,
      caption: "Требуют первоочередных исправлений"
    }
  ].concat(
    keyMetrics.map((metric) => ({
      label: metricLabel(metric.label),
      value: `${metric.average}/100`,
      caption: "Среднее значение ключевого фактора"
    }))
  );

  summaryGrid.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <span class="summary-label">${escapeHtml(String(card.label))}</span>
          <div class="summary-value">${escapeHtml(String(card.value))}</div>
          <p class="summary-caption">${escapeHtml(String(card.caption))}</p>
        </article>
      `
    )
    .join("");

  const correctionCandidates = [...data.pages]
    .map((page) => ({
      page,
      weakest: [...page.metricBreakdown].sort((a, b) => a.score - b.score)[0]
    }))
    .sort((a, b) => a.weakest.score - b.weakest.score)
    .slice(0, 4);

  priorityStrip.innerHTML = `
    <article class="summary-card priority-card">
      <p class="eyebrow">Главная зона исправления</p>
      <h3>${escapeHtml(metricLabel(weakestMetric.label))} — самая слабая метрика в портфеле</h3>
      <p class="summary-caption">
        Среднее значение всего ${weakestMetric.average}/100. Это первая метрика, которую нужно усиливать на системном уровне.
      </p>
      <ul class="priority-list">
        ${correctionCandidates
          .filter((item) => item.weakest.id === weakestMetric.id)
          .slice(0, 3)
          .map(
            (item) => `
              <li>
                <strong>${escapeHtml(item.page.file)}</strong>: поднять ${escapeHtml(metricLabel(item.weakest.label))} с
                ${item.weakest.score}/100.
              </li>
            `
          )
          .join("") || `<li>Явного одиночного аутлайера нет, значит исправлять нужно сразу в нескольких страницах.</li>`}
      </ul>
    </article>
    <article class="summary-card priority-card">
      <p class="eyebrow">Внедрить в первую очередь</p>
      <h3>Очередь приоритетных исправлений</h3>
      <ul class="priority-list">
        ${correctionCandidates
          .map(
            (item) => `
              <li>
                <strong>${escapeHtml(item.page.file)}</strong>: ${escapeHtml(metricLabel(item.weakest.label))}
                ${item.weakest.score}/100.
              </li>
            `
          )
          .join("")}
      </ul>
    </article>
  `;
}

function renderPageList() {
  const pages = [...state.data.pages].sort((a, b) => a.overall - b.overall);

  pageList.innerHTML = pages
    .map((page) => {
      const weakestMetric = [...page.metricBreakdown].sort((a, b) => a.score - b.score)[0];
      const activeClass = page.slug === state.selectedSlug ? " is-active" : "";

      return `
        <button class="page-row${activeClass}" type="button" data-slug="${escapeHtml(page.slug)}">
          <span class="score-pill score-${statusClass(page.overall)}">${page.overall}/100</span>
          <span>
            <strong>${escapeHtml(page.title)}</strong>
            <p class="page-row-note">${escapeHtml(page.file)} · самая слабая метрика: ${escapeHtml(metricLabel(weakestMetric.label))} (${weakestMetric.score}/100)</p>
          </span>
          <span class="issue-stack">
            <span class="status-pill status-${statusClass(page.overall)}">${escapeHtml(statusLabel(page.status))}</span>
            <span class="issue-pill issue-critical">${page.issueSummary.critical} критичных</span>
          </span>
        </button>
      `;
    })
    .join("");

  pageList.querySelectorAll("[data-slug]").forEach((element) => {
    element.addEventListener("click", () => {
      state.selectedSlug = element.getAttribute("data-slug");
      renderPageList();
      renderDetail();
    });
  });
}

function renderDetail() {
  const page = state.data.pages.find((item) => item.slug === state.selectedSlug) ?? state.data.pages[0];
  if (!page) {
    pageDetail.innerHTML = "";
    return;
  }

  const topIssues = page.topIssues.length
    ? `
      <ul class="issue-list">
        ${page.topIssues
          .map(
            (issue) => `
              <li>
                <span class="issue-pill issue-${escapeHtml(issue.severity)}">${escapeHtml(issue.severity)}</span>
                ${escapeHtml(metricLabel(issue.category))}: ${escapeHtml(issue.message)}
              </li>
            `
          )
          .join("")}
      </ul>
    `
    : "<p class='meta-note'>Критичных замечаний не найдено.</p>";

  const signals = [
    `Hero на десктопе помещается в экран: ${page.observed.desktopHeroFits}`,
    `Hero на мобильном помещается в экран: ${page.observed.mobileHeroFits}`,
    `Переполнение по горизонтали на десктопе: ${page.observed.desktopOverflow}`,
    `Переполнение по горизонтали на мобильном: ${page.observed.mobileOverflow}`,
    `Уникальных основных CTA: ${page.observed.distinctPrimaryCtas}`,
    `Пунктов навигации: ${page.observed.navCount}`,
    `FAQ-элементов: ${page.observed.faqCount}`,
    `Секций: ${page.observed.sectionCount}`,
    `Полный аудит доступен: ${page.checks.hasFullAudit}`,
    `HTML проходит валидацию: ${page.checks.htmlOk}`,
    `CSS проходит валидацию: ${page.checks.cssOk}`
  ];

  pageDetail.innerHTML = `
    <div class="detail-grid">
      <section class="detail-header">
        <div class="detail-meta">
          <span class="score-pill score-${statusClass(page.overall)}">${page.overall}/100</span>
          <span class="status-pill status-${statusClass(page.overall)}">${escapeHtml(statusLabel(page.status))}</span>
          <a class="detail-link" href="${escapeHtml(page.pageUrl)}" target="_blank" rel="noopener noreferrer">Открыть страницу</a>
        </div>
        <div>
          <h3>${escapeHtml(page.title)}</h3>
          <p class="meta-note">${escapeHtml(page.file)}</p>
        </div>
        <article class="breakdown-card">
          <p class="eyebrow">Оценки по категориям</p>
          <div class="metric-bars">
            ${page.metricBreakdown
              .map(
                (metric) => `
                  <div class="metric-row">
                    <span>${escapeHtml(metricLabel(metric.label))}</span>
                    <div class="metric-track">
                      <div class="${metricFillClass(metric.score)}" style="width:${metric.score}%"></div>
                    </div>
                    <strong>${metric.score}/100</strong>
                  </div>
                `
              )
              .join("")}
          </div>
        </article>
      </section>

      <section class="issues-card">
        <p class="eyebrow">Главные проблемы</p>
        <h3>Что тянет страницу вниз</h3>
        ${topIssues}
      </section>

      <section class="signals-card">
        <p class="eyebrow">Сигналы</p>
        <h3>На чём основана оценка</h3>
        <ul class="signal-list">
          ${signals.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

function renderMetricModel(data) {
  metricModel.innerHTML = data.metricModel
    .map(
      (metric) => `
        <article class="metric-card">
          <div class="metric-top">
            <div>
              <h3 class="metric-name">${escapeHtml(metricLabel(metric.label))}</h3>
              <p class="metric-why">${escapeHtml(metric.why)}</p>
            </div>
            <span class="metric-weight">${metric.weight}%</span>
          </div>
        </article>
      `
    )
    .join("");
}

function renderProblemMap(data) {
  const header = data.metricModel
    .map((metric) => `<th scope="col">${escapeHtml(metricLabel(metric.label))}</th>`)
    .join("");

  const rows = [...data.pages]
    .sort((a, b) => a.overall - b.overall)
    .map((page) => {
      const cells = page.metricBreakdown
        .map((metric) => {
          const bucket = statusClass(metric.score);
          const heatClass =
            bucket === "strong"
              ? "heat-strong"
              : bucket === "workable"
                ? "heat-workable"
                : bucket === "at-risk"
                  ? "heat-risk"
                  : "heat-weak";

          return `<td class="heat-cell ${heatClass}">${metric.score}</td>`;
        })
        .join("");

      return `
        <tr>
          <th scope="row">${escapeHtml(page.file)}</th>
          ${cells}
        </tr>
      `;
    })
    .join("");

  problemMap.innerHTML = `
    <div class="heatmap-grid">
      <table>
        <thead>
          <tr>
            <th scope="col">Страница</th>
            ${header}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function normalizeUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function stripTags(value) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ");
}

function wordCount(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function detectStatus(score) {
  return score >= 85 ? "strong" : score >= 70 ? "workable" : score >= 55 ? "at-risk" : "weak";
}

function quickIssue(category, severity, message) {
  return { category, severity, message };
}

function extractQuickScanModel(raw, url, mode) {
  const isHtml = /<html[\s>]/i.test(raw) || /<!doctype html/i.test(raw);
  const text = isHtml ? stripTags(raw).replace(/\s+/g, " ").trim() : raw.replace(/\s+/g, " ").trim();

  if (isHtml) {
    const doc = new DOMParser().parseFromString(raw, "text/html");
    const title = doc.title?.trim() || url;
    const h1 = doc.querySelector("h1")?.textContent?.trim() || "";
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
    const heroText =
      doc.querySelector(".hero")?.textContent?.replace(/\s+/g, " ").trim() ||
      doc.querySelector("main section")?.textContent?.replace(/\s+/g, " ").trim() ||
      "";
    const allText = doc.body?.textContent?.replace(/\s+/g, " ").trim() || text;
    const ctaTexts = Array.from(doc.querySelectorAll("a, button"))
      .map((item) => item.textContent?.replace(/\s+/g, " ").trim() || "")
      .filter(Boolean);
    const headings = Array.from(doc.querySelectorAll("h2, h3"))
      .map((item) => item.textContent?.replace(/\s+/g, " ").trim() || "")
      .filter(Boolean);
    const detailCount = doc.querySelectorAll("details").length;
    const navCount = doc.querySelectorAll("header nav a, nav a").length;
    const bullets = doc.querySelectorAll("li").length;

    return { isHtml, mode, url, title, h1, metaDescription, heroText, allText, ctaTexts, headings, detailCount, navCount, bullets };
  }

  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const title = lines.find((line) => line.startsWith("Title:"))?.replace(/^Title:\s*/i, "").trim() || url;
  const heading = lines.find((line) => /^#{1,2}\s+/.test(line))?.replace(/^#{1,2}\s+/, "").trim() || "";
  const ctaTexts = lines.filter((line) => ACTION_CTA_RE.test(line)).slice(0, 12);
  const headings = lines.filter((line) => /^#{1,4}\s+/.test(line)).map((line) => line.replace(/^#{1,4}\s+/, ""));
  const bullets = lines.filter((line) => /^[-*]\s+/.test(line)).length;
  const detailCount = lines.filter((line) => /faq|question|вопрос/i.test(line)).length;
  const navCount = 0;

  return {
    isHtml,
    mode,
    url,
    title,
    h1: heading,
    metaDescription: "",
    heroText: lines.slice(0, 12).join(" "),
    allText: text,
    ctaTexts,
    headings,
    detailCount,
    navCount,
    bullets
  };
}

function evaluateQuickScan(model, metricModelData) {
  const issues = [];

  let clarity = 100;
  if (!model.h1) {
    clarity -= 28;
    issues.push(quickIssue("Clarity", "high", "Не найден ясный H1 или главный заголовок."));
  }
  if (wordCount(model.h1) < 4 || wordCount(model.h1) > 22) {
    clarity -= 12;
    issues.push(quickIssue("Clarity", "medium", "Главный заголовок выглядит слишком слабым или слишком длинным для первого экрана."));
  }
  if (wordCount(model.heroText) < 20) {
    clarity -= 12;
    issues.push(quickIssue("Clarity", "medium", "Объяснение оффера на первом экране слишком слабое."));
  }

  let cta = 100;
  const distinctCtas = [...new Set(model.ctaTexts)];
  const actionCtas = distinctCtas.filter((text) => ACTION_CTA_RE.test(text));
  if (!actionCtas.length) {
    cta -= 32;
    issues.push(quickIssue("CTA System", "high", "Не найден явный CTA на действие."));
  }
  if (distinctCtas.some((text) => GENERIC_CTA_RE.test(text))) {
    cta -= 14;
    issues.push(quickIssue("CTA System", "medium", "Тексты CTA слишком общие, а не результат-ориентированные."));
  }
  if (actionCtas.length > 3) {
    cta -= 16;
    issues.push(quickIssue("CTA System", "high", "Слишком много разных CTA конкурируют за первое действие."));
  }

  let proof = 100;
  const proofHits = (model.allText.match(/testimonial|review|case study|results|clients|trusted|experience|отзыв|результат|кейс|опыт|довер/gi) || []).length;
  if (proofHits < 2) {
    proof -= 26;
    issues.push(quickIssue("Proof", "high", "Сигналы доверия и доказательства пользы слабы или почти отсутствуют."));
  }

  let offer = 100;
  const offerHits = (model.allText.match(/pricing|price|plan|package|faq|format|process|стоим|тариф|формат|как выбрать|вопрос/gi) || []).length;
  if (offerHits < 3) {
    offer -= 24;
    issues.push(quickIssue("Offer Depth", "high", "Оффер раскрыт слишком поверхностно."));
  }
  if (!PRICE_RE.test(model.allText)) {
    offer -= 10;
    issues.push(quickIssue("Offer Depth", "medium", "Не найдено цены или даже явного сигнала о цене."));
  }

  let hierarchy = 100;
  if (model.headings.length < 3) {
    hierarchy -= 18;
    issues.push(quickIssue("Scannability", "medium", "Слишком мало структурных заголовков для полноценной аргументации лендинга."));
  }
  if (model.bullets < 4) {
    hierarchy -= 10;
    issues.push(quickIssue("Scannability", "low", "Страница выглядит недостаточно удобной для быстрого сканирования."));
  }

  let focus = 100;
  if (model.navCount > 5) {
    focus -= 12;
    issues.push(quickIssue("Focus", "medium", "Навигация, вероятно, создаёт слишком много выходов со страницы."));
  }
  if (distinctCtas.length > 4) {
    focus -= 18;
    issues.push(quickIssue("Focus", "high", "Страница просит слишком много разных действий."));
  }

  let technical = 62;
  if (model.mode === "direct-html") {
    technical += 8;
  }
  if (model.isHtml && /lang=/i.test(model.allText) === false) {
    technical -= 4;
  }
  issues.push(quickIssue("Technical", "low", "Быстрое сравнение не запускает Lighthouse, Pa11y, Playwright и проверку ссылок."));

  const scores = {
    clarity: Math.max(0, clarity),
    cta: Math.max(0, cta),
    proof: Math.max(0, proof),
    offer: Math.max(0, offer),
    hierarchy: Math.max(0, hierarchy),
    focus: Math.max(0, focus),
    technical: Math.max(0, technical)
  };

  const overall = Math.round(
    metricModelData.reduce((sum, metric) => sum + (scores[metric.id] * metric.weight) / 100, 0)
  );

  return {
    overall,
    status: detectStatus(overall),
    issues,
    metricBreakdown: metricModelData.map((metric) => ({
      ...metric,
      score: scores[metric.id]
    }))
  };
}

async function fetchQuickScanSource(targetUrl) {
  try {
    const direct = await fetch(targetUrl, { mode: "cors" });
    if (direct.ok) {
      return {
        raw: await direct.text(),
        mode: "direct-html"
      };
    }
  } catch {}

  const proxyUrl = `https://r.jina.ai/http://${targetUrl.replace(/^https?:\/\//i, "")}`;
  const proxied = await fetch(proxyUrl);
  if (!proxied.ok) {
    throw new Error("Failed to fetch page content for quick scan.");
  }

  return {
    raw: await proxied.text(),
    mode: "proxy-text"
  };
}

function renderQuickScan(result, url, fetchMode) {
  const issueItems = result.issues
    .sort((a, b) => {
      const order = { high: 3, medium: 2, low: 1 };
      return (order[b.severity] || 0) - (order[a.severity] || 0);
    })
    .slice(0, 6);

  scanResult.innerHTML = `
    <article class="scan-card">
      <div class="detail-meta">
        <span class="score-pill score-${statusClass(result.overall)}">${result.overall}/100</span>
        <span class="status-pill status-${statusClass(result.overall)}">${escapeHtml(result.status)}</span>
        <a class="detail-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Open scanned page</a>
      </div>
      <p class="meta-note">Mode: ${escapeHtml(fetchMode === "direct-html" ? "direct HTML scan" : "proxy text scan")}.</p>
      <div class="metric-bars">
        ${result.metricBreakdown
          .map(
            (metric) => `
              <div class="metric-row">
                <span>${escapeHtml(metric.label)}</span>
                <div class="metric-track">
                  <div class="${metricFillClass(metric.score)}" style="width:${metric.score}%"></div>
                </div>
                <strong>${metric.score}/100</strong>
              </div>
            `
          )
          .join("")}
      </div>
      <ul class="issue-list">
        ${issueItems
          .map(
            (issue) => `
              <li>
                <span class="issue-pill issue-${escapeHtml(issue.severity)}">${escapeHtml(issue.severity)}</span>
                ${escapeHtml(issue.category)}: ${escapeHtml(issue.message)}
              </li>
            `
          )
          .join("")}
      </ul>
    </article>
  `;
}

function compareMetricRows(left, right) {
  return left.metricBreakdown
    .map((metric) => {
      const other = right.metricBreakdown.find((item) => item.id === metric.id);
      const delta = metric.score - (other?.score ?? 0);
      const winner =
        delta > 0 ? "A" : delta < 0 ? "B" : "ничья";

      return `<li><strong>${escapeHtml(metricLabel(metric.label))}</strong>: A ${metric.score}/100, B ${other?.score ?? 0}/100, победитель ${winner}</li>`;
    })
    .join("");
}

function renderCompareResult(left, right, leftUrl, rightUrl) {
  const scoreDelta = left.overall - right.overall;
  const winner =
    scoreDelta > 0
      ? { label: "Побеждает лендинг A", score: left.overall, url: leftUrl }
      : scoreDelta < 0
        ? { label: "Побеждает лендинг B", score: right.overall, url: rightUrl }
        : { label: "Ничья", score: left.overall, url: leftUrl };

  compareResult.innerHTML = `
    <div class="compare-grid">
      <article class="compare-card">
        <p class="eyebrow">Лендинг A</p>
        <h3 class="compare-name">${escapeHtml(leftUrl)}</h3>
        <div class="compare-score">
          <span class="score-pill score-${statusClass(left.overall)}">${left.overall}/100</span>
          <span class="status-pill status-${statusClass(left.overall)}">${escapeHtml(statusLabel(left.status))}</span>
        </div>
        <ul class="compare-metrics">
          ${left.metricBreakdown
            .map((metric) => `<li><strong>${escapeHtml(metricLabel(metric.label))}</strong>: ${metric.score}/100</li>`)
            .join("")}
        </ul>
      </article>
      <article class="winner-card">
        <p class="eyebrow">Решение</p>
        <h3 class="compare-name">${escapeHtml(winner.label)}</h3>
        <div class="compare-score">
          <span class="score-pill score-${statusClass(winner.score)}">${winner.score}/100</span>
          <a class="detail-link" href="${escapeHtml(winner.url)}" target="_blank" rel="noopener noreferrer">Открыть победителя</a>
        </div>
        <p class="summary-caption">
          Разница по общему баллу: ${Math.abs(scoreDelta)}/100.
        </p>
        <ul class="compare-metrics">
          ${compareMetricRows(left, right)}
        </ul>
      </article>
      <article class="compare-card">
        <p class="eyebrow">Лендинг B</p>
        <h3 class="compare-name">${escapeHtml(rightUrl)}</h3>
        <div class="compare-score">
          <span class="score-pill score-${statusClass(right.overall)}">${right.overall}/100</span>
          <span class="status-pill status-${statusClass(right.overall)}">${escapeHtml(statusLabel(right.status))}</span>
        </div>
        <ul class="compare-metrics">
          ${right.metricBreakdown
            .map((metric) => `<li><strong>${escapeHtml(metricLabel(metric.label))}</strong>: ${metric.score}/100</li>`)
            .join("")}
        </ul>
      </article>
    </div>
  `;
}

function wireCompare(data) {
  compareForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const urlA = normalizeUrl(document.getElementById("compareUrlA").value);
    const urlB = normalizeUrl(document.getElementById("compareUrlB").value);
    if (!urlA || !urlB) return;

    const button = compareForm.querySelector("button");
    button.disabled = true;
    button.textContent = "Сравниваю...";
    compareResult.innerHTML = `<p class="meta-note">Получаю обе страницы и считаю их по одной и той же метрике…</p>`;

    try {
      const [sourceA, sourceB] = await Promise.all([
        fetchQuickScanSource(urlA),
        fetchQuickScanSource(urlB)
      ]);

      const resultA = evaluateQuickScan(extractQuickScanModel(sourceA.raw, urlA, sourceA.mode), data.metricModel);
      const resultB = evaluateQuickScan(extractQuickScanModel(sourceB.raw, urlB, sourceB.mode), data.metricModel);
      renderCompareResult(resultA, resultB, urlA, urlB);
    } catch (error) {
      compareResult.innerHTML = `<p class="meta-note">Сравнение не удалось: ${escapeHtml(String(error.message ?? error))}</p>`;
    } finally {
      button.disabled = false;
      button.textContent = "Сравнить";
    }
  });
}

async function bootstrap() {
  const response = await fetch(DATA_URL);
  const data = await response.json();
  state.data = data;
  state.selectedSlug = [...data.pages].sort((a, b) => a.overall - b.overall)[0]?.slug ?? null;

  renderSummary(data);
  renderMetricModel(data);
  renderProblemMap(data);
  renderPageList();
  renderDetail();
  wireCompare(data);
}

bootstrap().catch((error) => {
  pageDetail.innerHTML = `<p class="meta-note">Не удалось загрузить данные дашборда: ${escapeHtml(String(error.message ?? error))}</p>`;
});
