import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { optimize as optimizeSvg } from "svgo";

const cwd = process.cwd();
const inputs = process.argv.slice(2);

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (inputs.length === 0 || inputs.includes("--help")) {
  console.log("Usage: npm run assets:optimize -- <file> [file...]");
  console.log("Supports: .png .jpg .jpeg .webp .avif .svg");
  process.exit(0);
}

async function optimizeRaster(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const source = sharp(filePath, { animated: false }).rotate();
  const metadata = await source.metadata();
  const width = metadata.width && metadata.width > 1600 ? 1600 : metadata.width;

  let pipeline = source;
  if (width) {
    pipeline = pipeline.resize({ width, withoutEnlargement: true });
  }

  if (ext === ".png") {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 82 });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({ quality: 82, effort: 6 });
  } else if (ext === ".avif") {
    pipeline = pipeline.avif({ quality: 55, effort: 8 });
  } else {
    pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
  }

  await pipeline.toFile(filePath + ".tmp");
  await fs.rename(filePath + ".tmp", filePath);
}

async function optimizeVector(filePath) {
  const source = await fs.readFile(filePath, "utf8");
  const result = optimizeSvg(source, {
    path: filePath,
    multipass: true,
    js2svg: { pretty: true, indent: 2 },
    plugins: [
      "preset-default",
      "removeDimensions",
      {
        name: "addAttributesToSVGElement",
        params: {
          attributes: [{ focusable: "false" }]
        }
      }
    ]
  });

  if ("data" in result) {
    await fs.writeFile(filePath, result.data);
  }
}

async function main() {
  const results = [];

  for (const input of inputs) {
    const target = path.resolve(cwd, input);
    const ext = path.extname(target).toLowerCase();

    await fs.access(target).catch(() => fail(`File not found: ${target}`));

    const before = (await fs.stat(target)).size;

    if ([".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(ext)) {
      await optimizeRaster(target);
    } else if (ext === ".svg") {
      await optimizeVector(target);
    } else {
      fail(`Unsupported file type: ${target}`);
    }

    const after = (await fs.stat(target)).size;
    results.push({
      file: target,
      before,
      after,
      saved: before - after
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

await main();
