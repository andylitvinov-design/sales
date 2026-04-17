import fs from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const PROJECTS_ROOT = "/Users/andriilitvinov/projects";
const URL_ROOT = "http://127.0.0.1:8877/";
const cwd = process.cwd();

function fail(message) {
  console.error(message);
  process.exit(1);
}

function runCommand(command, args, label, options = {}) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: "pipe",
    ...options
  });

  return {
    label,
    command: [command, ...args].join(" "),
    status: result.status ?? 1,
    stdout: result.stdout?.trim() ?? "",
    stderr: result.stderr?.trim() ?? ""
  };
}

function normalizeTarget(input) {
  if (!input) {
    return path.resolve(cwd, "landing-services-bwa-v2.html");
  }

  if (/^https?:\/\//.test(input)) {
    return input;
  }

  if (path.isAbsolute(input)) {
    return input;
  }

  return path.resolve(cwd, input);
}

async function resolvePage(input) {
  const target = normalizeTarget(input);

  if (/^https?:\/\//.test(target)) {
    const slug = new URL(target).pathname.split("/").pop()?.replace(/\.html$/, "") || "page";
    return {
      htmlPath: null,
      pageUrl: target,
      slug,
      cssPaths: []
    };
  }

  const htmlPath = target;
  const html = await fs.readFile(htmlPath, "utf8").catch(() => null);
  if (!htmlPath.endsWith(".html") || html == null) {
    fail(`HTML file not found: ${htmlPath}`);
  }

  const relativeToProjects = path.relative(PROJECTS_ROOT, htmlPath);
  if (relativeToProjects.startsWith("..")) {
    fail(`HTML file must be inside ${PROJECTS_ROOT}: ${htmlPath}`);
  }

  const cssMatches = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+\.css(?:\?[^"']*)?)["']/gi)];
  const cssPaths = cssMatches
    .map((match) => match[1].split("?")[0])
    .filter((href) => !/^https?:\/\//.test(href))
    .map((href) => path.resolve(path.dirname(htmlPath), href));

  return {
    htmlPath,
    pageUrl: new URL(relativeToProjects.replace(/\\/g, "/"), URL_ROOT).toString(),
    slug: path.basename(htmlPath, ".html"),
    cssPaths
  };
}

async function runPlaywrightAudit(pageUrl, slug, reportsDir) {
  const viewports = [
    { name: "desktop", width: 1440, height: 1024 },
    { name: "mobile", width: 390, height: 844 }
  ];

  const browser = await chromium.launch({
    channel: "chrome",
    headless: true
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  const results = [];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(`${pageUrl}${pageUrl.includes("?") ? "&" : "?"}qa=${Date.now()}-${viewport.name}`, {
      waitUntil: "networkidle"
    });

    const metrics = await page.evaluate(() => {
      const hero = document.querySelector(".hero");
      const header = document.querySelector(".site-header");
      const body = document.body;
      const doc = document.documentElement;
      const heroRect = hero?.getBoundingClientRect();
      const headerRect = header?.getBoundingClientRect();

      return {
        title: document.title,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        heroHeight: heroRect?.height ?? null,
        heroFitsViewport: heroRect ? heroRect.height <= window.innerHeight : null,
        headerHeight: headerRect?.height ?? null,
        horizontalOverflow: Math.max(body.scrollWidth, doc.scrollWidth) > window.innerWidth,
        heroButtons: Array.from(document.querySelectorAll(".hero-actions a")).map((a) => ({
          text: a.textContent?.trim(),
          width: a.getBoundingClientRect().width
        }))
      };
    });

    const screenshotPath = path.join(reportsDir, `${slug}-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    results.push({
      name: viewport.name,
      screenshot: screenshotPath,
      ...metrics
    });
  }

  await browser.close();

  const outputPath = path.join(reportsDir, `${slug}-playwright.json`);
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));

  return {
    label: "playwright",
    status: 0,
    outputPath,
    results
  };
}

async function main() {
  const page = await resolvePage(process.argv[2]);
  const reportsDir = path.resolve(cwd, "reports");
  await fs.mkdir(reportsDir, { recursive: true });

  const localBin = (name) => path.resolve(cwd, "node_modules", ".bin", name);
  const summary = {
    target: process.argv[2] ?? "landing-services-bwa-v2.html",
    pageUrl: page.pageUrl,
    slug: page.slug,
    checks: [],
    findings: []
  };

  if (page.htmlPath) {
    summary.checks.push(runCommand(localBin("html-validate"), [page.htmlPath], "html-validate"));
  }

  for (const cssPath of page.cssPaths) {
    summary.checks.push(runCommand(localBin("stylelint"), [cssPath], `stylelint:${path.basename(cssPath)}`));
  }

  summary.checks.push(
    runCommand(localBin("pa11y"), [page.pageUrl], "pa11y"),
    runCommand(
      localBin("linkinator"),
      [page.pageUrl, "--recurse=false", "--skip", "mailto:.*,tel:.*"],
      "linkinator"
    ),
    runCommand(
      localBin("lighthouse"),
      [
        page.pageUrl,
        "--only-categories=accessibility,best-practices,seo",
        "--output=json",
        "--output-path",
        path.join(reportsDir, `${page.slug}-lighthouse.json`),
        "--chrome-flags=--headless=new --no-sandbox"
      ],
      "lighthouse"
    )
  );

  summary.checks.push(await runPlaywrightAudit(page.pageUrl, page.slug, reportsDir));

  const lighthousePath = path.join(reportsDir, `${page.slug}-lighthouse.json`);
  try {
    const lighthouseJson = JSON.parse(await fs.readFile(lighthousePath, "utf8"));
    summary.lighthouse = {
      accessibility: lighthouseJson.categories.accessibility.score,
      bestPractices: lighthouseJson.categories["best-practices"].score,
      seo: lighthouseJson.categories.seo.score
    };
  } catch {
    summary.lighthouse = null;
  }

  const playwrightCheck = summary.checks.find((check) => check.label === "playwright");
  if (playwrightCheck?.results) {
    for (const result of playwrightCheck.results) {
      if (result.horizontalOverflow) {
        summary.findings.push({
          severity: "error",
          viewport: result.name,
          message: "Horizontal overflow detected."
        });
      }

      if (result.name === "desktop" && result.heroFitsViewport === false) {
        summary.findings.push({
          severity: "error",
          viewport: result.name,
          message: "Desktop hero does not fit within the viewport."
        });
      }

      if (result.name === "mobile" && result.heroFitsViewport === false) {
        summary.findings.push({
          severity: "warning",
          viewport: result.name,
          message: "Mobile hero is taller than the viewport."
        });
      }
    }
  }

  summary.ok =
    summary.checks.every((check) => check.status === 0) &&
    !summary.findings.some((finding) => finding.severity === "error");

  const summaryPath = path.join(reportsDir, `${page.slug}-quality-summary.json`);
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  console.log(JSON.stringify({ summaryPath, summary }, null, 2));

  if (!summary.ok) {
    process.exit(1);
  }
}

await main();
