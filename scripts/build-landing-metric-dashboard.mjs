import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { chromium } from "playwright";

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, "reports");
const URL_ROOT = "http://127.0.0.1:8877/sales/";
const OUTPUT_PATH = path.join(REPORTS_DIR, "landing-metric-dashboard-data.json");
const PAGE_PATTERN = /^landing-(?!metric-dashboard).*\.html$/i;

const METRIC_MODEL = [
  {
    id: "clarity",
    label: "Clarity",
    weight: 22,
    why: "Shows whether the promise is understandable in seconds and whether the page is ready for cold traffic."
  },
  {
    id: "cta",
    label: "CTA System",
    weight: 16,
    why: "Measures how clearly the page drives one primary next step without branching into chaos."
  },
  {
    id: "proof",
    label: "Proof",
    weight: 14,
    why: "Checks whether the page earns trust with results, specificity, process, credibility, or grounded evidence."
  },
  {
    id: "offer",
    label: "Offer Depth",
    weight: 14,
    why: "Captures whether the page explains formats, fit, pricing, objections, and what happens next."
  },
  {
    id: "hierarchy",
    label: "Scannability",
    weight: 12,
    why: "Tests whether the page is easy to scan, section by section, without copy overload."
  },
  {
    id: "focus",
    label: "Focus",
    weight: 10,
    why: "Flags friction from too many navigation exits, too many CTA variants, or weak decision guidance."
  },
  {
    id: "technical",
    label: "Technical",
    weight: 12,
    why: "Combines layout stability, markup quality, audit results, and accessibility/search hygiene."
  }
];

const GENERIC_CTA_RE = /\b(learn more|read more|more|submit|send|далее|подробнее|узнать больше)\b/i;
const ACTION_CTA_RE = /\b(start|get|book|request|talk|write|contact|apply|see|choose|начать|запис|напис|получ|выбрать|обсуд|остав)\b/i;
const PRICE_RE = /(?:€|\$|£|donation|\d+\s?(?:€|\$|£|eur|usd|руб|₽|мес))/i;
const PROOF_RE = /(result|results|proof|review|testimonial|case|clients?|experience|faq|process|отзыв|результат|опыт|кейс|довер|вопрос|как проходит|процесс)/i;
const OFFER_RE = /(format|pricing|price|offer|package|plan|faq|fit|кому подходит|формат|стоим|тариф|пакет|кому подходит|как выбрать|вопрос)/i;

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "pipe"
  });

  return {
    status: result.status ?? 1,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? ""
  };
}

function tokens(input) {
  return new Set(
    (input ?? "")
      .toLowerCase()
      .match(/\p{L}+/gu)?.filter((token) => token.length >= 3) ?? []
  );
}

function overlapRatio(a, b) {
  const setA = tokens(a);
  const setB = tokens(b);

  if (!setA.size || !setB.size) {
    return 0;
  }

  let matches = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      matches += 1;
    }
  }

  return matches / Math.max(setA.size, setB.size);
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function statusFromScore(score) {
  if (score >= 85) return "strong";
  if (score >= 70) return "workable";
  if (score >= 55) return "at-risk";
  return "weak";
}

function severityWeight(severity) {
  if (severity === "critical") return 4;
  if (severity === "high") return 3;
  if (severity === "medium") return 2;
  return 1;
}

function createIssue(category, severity, message) {
  return { category, severity, message };
}

function summarizeIssues(issues) {
  return issues.reduce(
    (acc, issue) => {
      acc.total += 1;
      acc[issue.severity] += 1;
      return acc;
    },
    { total: 0, critical: 0, high: 0, medium: 0, low: 0 }
  );
}

async function readJson(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function discoverPages() {
  const entries = await fs.readdir(ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && PAGE_PATTERN.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function linkedCssPaths(htmlPath, html) {
  const matches = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css(?:\?[^"']*)?)["']/gi)];
  return matches
    .map((match) => match[1].split("?")[0])
    .filter((href) => !/^https?:\/\//.test(href))
    .map((href) => path.resolve(path.dirname(htmlPath), href));
}

async function collectDomMetrics(browser, pageName) {
  const page = await browser.newPage();
  const pageUrl = `${URL_ROOT}${pageName}`;
  const viewportResults = [];

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1024 },
    { name: "mobile", width: 390, height: 844 }
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${pageUrl}?dash=${Date.now()}-${viewport.name}`, {
      waitUntil: "networkidle"
    });

    const metrics = await page.evaluate(() => {
      const textOf = (selector) => document.querySelector(selector)?.textContent?.trim() ?? "";
      const sectionNodes = Array.from(document.querySelectorAll("main section"));
      const allLinks = Array.from(document.querySelectorAll("a[href], button"));
      const buttonLike = allLinks
        .map((element) => ({
          text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
          href: element.tagName === "A" ? element.getAttribute("href") ?? "" : "",
          className: element.getAttribute("class") ?? ""
        }))
        .filter((item) => item.text);
      const hero = document.querySelector(".hero") || sectionNodes[0] || null;
      const heroButtons = hero
        ? Array.from(hero.querySelectorAll("a[href], button")).map((element) => ({
            text: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
            href: element.tagName === "A" ? element.getAttribute("href") ?? "" : "",
            className: element.getAttribute("class") ?? "",
            width: element.getBoundingClientRect().width
          }))
        : [];
      const heroParagraphs = hero
        ? Array.from(hero.querySelectorAll("p"))
            .map((item) => item.textContent?.replace(/\s+/g, " ").trim() ?? "")
            .filter(Boolean)
        : [];
      const headingTexts = Array.from(document.querySelectorAll("h2, h3")).map((item) =>
        item.textContent?.replace(/\s+/g, " ").trim() ?? ""
      );
      const heroRect = hero?.getBoundingClientRect() ?? null;
      const headerRect = document.querySelector(".site-header")?.getBoundingClientRect() ?? null;

      return {
        title: document.title.trim(),
        lang: document.documentElement.lang ?? "",
        metaDescription: document.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "",
        h1: textOf("h1"),
        heroExists: Boolean(hero),
        heroParagraphs,
        heroButtons,
        sectionCount: sectionNodes.length,
        navCount: document.querySelectorAll("header nav a").length,
        buttonLike,
        headingTexts,
        detailCount: document.querySelectorAll("details").length,
        listItemCount: document.querySelectorAll("li").length,
        imageCount: document.querySelectorAll("img").length,
        sectionTexts: sectionNodes.map((node) => node.textContent?.replace(/\s+/g, " ").trim() ?? ""),
        heroHeight: heroRect?.height ?? null,
        heroFitsViewport: heroRect ? heroRect.height <= window.innerHeight : null,
        headerHeight: headerRect?.height ?? null,
        horizontalOverflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) > window.innerWidth
      };
    });

    viewportResults.push({ viewport: viewport.name, ...metrics });
  }

  await page.close();
  return viewportResults;
}

function distinctTexts(items) {
  return [...new Set(items.map((item) => item.text).filter(Boolean))];
}

function classifyPrimaryCtas(buttons) {
  return buttons.filter((item) => /button-solid|primary|cta/i.test(item.className) || ACTION_CTA_RE.test(item.text));
}

function pickViewport(domMetrics, name) {
  return domMetrics.find((item) => item.viewport === name) ?? null;
}

function scoreClarity(desktop) {
  let score = 100;
  const issues = [];
  const h1Words = desktop.h1.split(/\s+/).filter(Boolean).length;
  const descriptionWords = desktop.metaDescription.split(/\s+/).filter(Boolean).length;
  const heroLeadWords = desktop.heroParagraphs[0]?.split(/\s+/).filter(Boolean).length ?? 0;
  const titleOverlap = overlapRatio(desktop.title, desktop.h1);
  const descriptionOverlap = overlapRatio(desktop.metaDescription, desktop.h1);

  if (!desktop.heroExists) {
    score -= 45;
    issues.push(createIssue("Clarity", "critical", "No clear hero section was detected."));
  }

  if (!desktop.h1) {
    score -= 40;
    issues.push(createIssue("Clarity", "critical", "Missing H1 headline."));
  } else if (h1Words < 6 || h1Words > 24) {
    score -= 15;
    issues.push(createIssue("Clarity", "medium", "Headline is either too thin or too long to land quickly."));
  }

  if (!desktop.metaDescription) {
    score -= 12;
    issues.push(createIssue("Clarity", "medium", "Missing meta description weakens message consistency and SEO snippets."));
  } else if (descriptionWords < 10 || descriptionWords > 30) {
    score -= 8;
    issues.push(createIssue("Clarity", "low", "Meta description length is outside the strongest scanning range."));
  }

  if (titleOverlap < 0.2) {
    score -= 12;
    issues.push(createIssue("Clarity", "medium", "Title and headline do not align tightly enough for ad/message match."));
  }

  if (descriptionOverlap < 0.12) {
    score -= 8;
    issues.push(createIssue("Clarity", "low", "Meta description and headline are weakly aligned."));
  }

  if (heroLeadWords < 12) {
    score -= 10;
    issues.push(createIssue("Clarity", "medium", "Hero support copy is too thin to explain the promise."));
  }

  return { score: clamp(score), issues };
}

function scoreCta(desktop, mobile) {
  let score = 100;
  const issues = [];
  const allCtas = desktop.buttonLike.filter((item) => item.href || /button/i.test(item.className));
  const primaryCtas = classifyPrimaryCtas(allCtas);
  const heroPrimary = classifyPrimaryCtas(desktop.heroButtons);
  const uniqueLabels = distinctTexts(primaryCtas);

  if (!heroPrimary.length) {
    score -= 32;
    issues.push(createIssue("CTA System", "critical", "No clear primary CTA was found in the hero."));
  }

  if (desktop.heroButtons.length > 2) {
    score -= 12;
    issues.push(createIssue("CTA System", "medium", "Hero has too many CTA choices for the first decision."));
  }

  if (uniqueLabels.length > 3) {
    score -= 14;
    issues.push(createIssue("CTA System", "high", "Too many CTA variants dilute the primary next step."));
  }

  if (!primaryCtas.some((item) => GENERIC_CTA_RE.test(item.text) === false)) {
    score -= 18;
    issues.push(createIssue("CTA System", "high", "CTA copy is generic instead of outcome-oriented."));
  }

  if (mobile?.heroButtons.some((item) => item.width < 180)) {
    score -= 6;
    issues.push(createIssue("CTA System", "low", "Mobile hero CTA width looks tight for easy tapping."));
  }

  const lastHeading = desktop.headingTexts.at(-1) ?? "";
  if (!/cta|contact|start|book|write|apply|next|итог|готовы|сделать шаг|напис|запис|выбрать/i.test(lastHeading) && desktop.sectionCount > 3) {
    score -= 10;
    issues.push(createIssue("CTA System", "medium", "Bottom-of-page conversion section is weak or unclear."));
  }

  return { score: clamp(score), issues };
}

function scoreProof(desktop) {
  let score = 100;
  const issues = [];
  const proofSections = desktop.sectionTexts.filter((text) => PROOF_RE.test(text)).length;
  const specificClaims = desktop.sectionTexts.filter((text) => PRICE_RE.test(text) || /\d/.test(text)).length;

  if (proofSections === 0) {
    score -= 34;
    issues.push(createIssue("Proof", "critical", "No clear proof, trust, FAQ, or process signal was detected."));
  } else if (proofSections === 1) {
    score -= 12;
    issues.push(createIssue("Proof", "medium", "Proof exists, but only in one area of the page."));
  }

  if (desktop.imageCount === 0) {
    score -= 8;
    issues.push(createIssue("Proof", "low", "No imagery was found to support trust or presence."));
  }

  if (specificClaims < 2) {
    score -= 12;
    issues.push(createIssue("Proof", "medium", "The page lacks concrete specifics such as numbers, prices, or structured deliverables."));
  }

  return { score: clamp(score), issues };
}

function scoreOffer(desktop) {
  let score = 100;
  const issues = [];
  const offerSections = desktop.sectionTexts.filter((text) => OFFER_RE.test(text)).length;
  const hasPricing = desktop.sectionTexts.some((text) => PRICE_RE.test(text));
  const hasFaq = desktop.detailCount >= 3;
  const hasBullets = desktop.listItemCount >= 6;

  if (offerSections < 2) {
    score -= 28;
    issues.push(createIssue("Offer Depth", "high", "Offer structure is thin: fit, pricing, formats, or FAQ are missing."));
  }

  if (!hasPricing) {
    score -= 10;
    issues.push(createIssue("Offer Depth", "medium", "No clear price, range, or pricing signal was detected."));
  }

  if (!hasFaq) {
    score -= 14;
    issues.push(createIssue("Offer Depth", "medium", "FAQ or objection handling looks too weak."));
  }

  if (!hasBullets) {
    score -= 8;
    issues.push(createIssue("Offer Depth", "low", "The offer is not broken into enough scannable bullet points."));
  }

  return { score: clamp(score), issues };
}

function scoreHierarchy(desktop, mobile) {
  let score = 100;
  const issues = [];
  const longHeadings = desktop.headingTexts.filter((text) => text.split(/\s+/).filter(Boolean).length > 18).length;
  const longHeroParagraph = desktop.heroParagraphs.some((text) => text.split(/\s+/).filter(Boolean).length > 55);

  if (desktop.sectionCount < 3) {
    score -= 20;
    issues.push(createIssue("Scannability", "medium", "Page structure is too thin to build a full conversion argument."));
  }

  if (longHeadings > 1) {
    score -= 12;
    issues.push(createIssue("Scannability", "medium", "Several section headings are too long for quick scanning."));
  }

  if (longHeroParagraph) {
    score -= 10;
    issues.push(createIssue("Scannability", "medium", "Hero copy is too dense for a first-screen scan."));
  }

  if (mobile?.heroFitsViewport === false) {
    score -= 12;
    issues.push(createIssue("Scannability", "high", "Mobile hero is taller than the viewport."));
  }

  return { score: clamp(score), issues };
}

function scoreFocus(desktop, mobile) {
  let score = 100;
  const issues = [];
  const allPrimary = classifyPrimaryCtas(desktop.buttonLike);
  const uniquePrimary = distinctTexts(allPrimary);

  if (desktop.navCount > 5) {
    score -= 16;
    issues.push(createIssue("Focus", "medium", "Navigation offers too many exits for a focused landing page."));
  }

  if (uniquePrimary.length > 2) {
    score -= 18;
    issues.push(createIssue("Focus", "high", "The page asks for too many different primary actions."));
  }

  if (desktop.horizontalOverflow || mobile?.horizontalOverflow) {
    score -= 24;
    issues.push(createIssue("Focus", "critical", "Horizontal overflow breaks reading flow on at least one viewport."));
  }

  return { score: clamp(score), issues };
}

function scoreTechnical(desktop, mobile, checks, existingSummary) {
  let score = 100;
  const issues = [];

  if (checks.html.status !== 0) {
    score -= 22;
    issues.push(createIssue("Technical", "critical", "HTML validation failed."));
  }

  if (checks.css.some((result) => result.status !== 0)) {
    score -= 18;
    issues.push(createIssue("Technical", "high", "One or more linked CSS files failed stylelint."));
  }

  if (desktop.horizontalOverflow || mobile?.horizontalOverflow) {
    score -= 18;
    issues.push(createIssue("Technical", "critical", "Layout overflows horizontally."));
  }

  if (desktop.heroFitsViewport === false) {
    score -= 10;
    issues.push(createIssue("Technical", "high", "Desktop hero does not fit inside the viewport."));
  }

  if (existingSummary?.checks) {
    const byLabel = new Map(existingSummary.checks.map((check) => [check.label, check]));
    for (const label of ["pa11y", "linkinator", "lighthouse"]) {
      if (byLabel.has(label) && byLabel.get(label).status !== 0) {
        score -= 10;
        issues.push(createIssue("Technical", "high", `${label} failed in the latest full audit.`));
      }
    }
  } else {
    score -= 6;
    issues.push(createIssue("Technical", "low", "No full quality summary found; technical score uses lightweight signals only."));
  }

  if (existingSummary?.lighthouse) {
    const average =
      ((existingSummary.lighthouse.accessibility ?? 0) +
        (existingSummary.lighthouse.bestPractices ?? 0) +
        (existingSummary.lighthouse.seo ?? 0)) /
      3;
    score -= Math.round((1 - average) * 24);

    if ((existingSummary.lighthouse.accessibility ?? 1) < 0.9) {
      issues.push(createIssue("Technical", "medium", "Accessibility Lighthouse score is below 0.90."));
    }
    if ((existingSummary.lighthouse.seo ?? 1) < 0.9) {
      issues.push(createIssue("Technical", "medium", "SEO Lighthouse score is below 0.90."));
    }
  }

  return { score: clamp(score), issues };
}

async function main() {
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const pages = await discoverPages();
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const cssCache = new Map();
  const pageResults = [];

  try {
    for (const pageName of pages) {
      const slug = pageName.replace(/\.html$/i, "");
      const htmlPath = path.join(ROOT, pageName);
      const html = await fs.readFile(htmlPath, "utf8");
      const cssPaths = linkedCssPaths(htmlPath, html);
      const existingSummary = await readJson(path.join(REPORTS_DIR, `${slug}-quality-summary.json`));
      const domMetrics = await collectDomMetrics(browser, pageName);
      const desktop = pickViewport(domMetrics, "desktop");
      const mobile = pickViewport(domMetrics, "mobile");

      const htmlCheck = runCommand(path.join(ROOT, "node_modules", ".bin", "html-validate"), [htmlPath]);
      const cssChecks = [];

      for (const cssPath of cssPaths) {
        if (!cssCache.has(cssPath)) {
          cssCache.set(cssPath, runCommand(path.join(ROOT, "node_modules", ".bin", "stylelint"), [cssPath]));
        }
        cssChecks.push({ path: cssPath, ...cssCache.get(cssPath) });
      }

      const categoryResults = {
        clarity: scoreClarity(desktop),
        cta: scoreCta(desktop, mobile),
        proof: scoreProof(desktop),
        offer: scoreOffer(desktop),
        hierarchy: scoreHierarchy(desktop, mobile),
        focus: scoreFocus(desktop, mobile),
        technical: scoreTechnical(desktop, mobile, { html: htmlCheck, css: cssChecks }, existingSummary)
      };

      const overall = Math.round(
        METRIC_MODEL.reduce((sum, metric) => sum + (categoryResults[metric.id].score * metric.weight) / 100, 0)
      );
      const issues = METRIC_MODEL.flatMap((metric) => categoryResults[metric.id].issues);
      const issueSummary = summarizeIssues(issues);
      const topIssues = [...issues]
        .sort((a, b) => severityWeight(b.severity) - severityWeight(a.severity))
        .slice(0, 5);

      pageResults.push({
        slug,
        file: pageName,
        pageUrl: `${URL_ROOT}${pageName}`,
        title: desktop.title,
        overall,
        status: statusFromScore(overall),
        metricBreakdown: METRIC_MODEL.map((metric) => ({
          ...metric,
          score: categoryResults[metric.id].score
        })),
        issues,
        issueSummary,
        topIssues,
        checks: {
          htmlOk: htmlCheck.status === 0,
          cssOk: cssChecks.every((item) => item.status === 0),
          hasFullAudit: Boolean(existingSummary),
          lighthouse: existingSummary?.lighthouse ?? null
        },
        observed: {
          desktopHeroFits: desktop.heroFitsViewport,
          mobileHeroFits: mobile?.heroFitsViewport ?? null,
          desktopOverflow: desktop.horizontalOverflow,
          mobileOverflow: mobile?.horizontalOverflow ?? null,
          navCount: desktop.navCount,
          primaryCtaCount: classifyPrimaryCtas(desktop.buttonLike).length,
          distinctPrimaryCtas: distinctTexts(classifyPrimaryCtas(desktop.buttonLike)).length,
          faqCount: desktop.detailCount,
          sectionCount: desktop.sectionCount
        }
      });
    }
  } finally {
    await browser.close();
  }

  const weakestCategory = METRIC_MODEL.map((metric) => {
    const average =
      pageResults.reduce((sum, page) => {
        const match = page.metricBreakdown.find((item) => item.id === metric.id);
        return sum + (match?.score ?? 0);
      }, 0) / Math.max(pageResults.length, 1);

    return {
      id: metric.id,
      label: metric.label,
      average: Math.round(average)
    };
  }).sort((a, b) => a.average - b.average)[0];

  const strongestPage = [...pageResults].sort((a, b) => b.overall - a.overall)[0] ?? null;
  const riskiestPage = [...pageResults].sort((a, b) => a.overall - b.overall)[0] ?? null;
  const criticalPages = pageResults.filter((page) => page.issueSummary.critical > 0).length;
  const averageScore = Math.round(
    pageResults.reduce((sum, page) => sum + page.overall, 0) / Math.max(pageResults.length, 1)
  );

  const output = {
    generatedAt: new Date().toISOString(),
    source: {
      repo: ROOT,
      reportDir: REPORTS_DIR
    },
    metricModel: METRIC_MODEL,
    summary: {
      pageCount: pageResults.length,
      averageScore,
      criticalPages,
      strongestPage: strongestPage
        ? { slug: strongestPage.slug, title: strongestPage.title, overall: strongestPage.overall }
        : null,
      riskiestPage: riskiestPage
        ? { slug: riskiestPage.slug, title: riskiestPage.title, overall: riskiestPage.overall }
        : null,
      weakestCategory
    },
    pages: pageResults
  };

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ outputPath: OUTPUT_PATH, pages: pageResults.length }, null, 2));
}

await main();
