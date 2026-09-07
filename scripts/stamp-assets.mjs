#!/usr/bin/env node
/**
 * stamp-assets.mjs
 * -----------------------------------------------------------------------------
 * Fingerprints every local asset a page links to, so a browser can never serve
 * a stale stylesheet, script or font after a deploy.
 *
 *     href="assets/css/site.css"  ->  href="assets/css/site.css?v=8f3a1c9d"
 *
 * The tag is the first 8 characters of the SHA-256 of the file's own contents,
 * so it changes only when that file changes — an unchanged asset keeps its URL
 * and stays cached, which is the point.
 *
 * The built stylesheet is fingerprinted FIRST, so the url() inside its
 * @font-face rules carries the same tag the HTML preload does. If those two
 * URLs disagree the browser fetches the font twice — once for the preload it
 * then cannot match, once for the CSS — and warns that the preload went unused.
 *
 * Run after the CSS is built (npm run build does this in order). Idempotent:
 * any existing ?v= is stripped before the current one is applied.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Matches href/src pointing at our own assets/ or content/ files.
const REF = /\b(href|src)="\/((?:assets|content)\/[^"?#]+)(\?v=[a-f0-9]+)?"/g;

const hashes = new Map();
const missing = new Set();
async function tag(relPath) {
  if (hashes.has(relPath)) return hashes.get(relPath);
  let value = null;
  try {
    const file = join(root, relPath);
    if ((await stat(file)).isFile()) {
      value = createHash("sha256").update(await readFile(file)).digest("hex").slice(0, 8);
    }
  } catch {
    value = null; // referenced file is missing — leave the URL alone and report
  }
  hashes.set(relPath, value);
  return value;
}

/* -----------------------------------------------------------------------------
   1. Fingerprint the font URLs inside the built stylesheet, so that the CSS and
      the HTML preload ask for byte-identical URLs.
   -------------------------------------------------------------------------- */
const CSS_FILE = "assets/css/site.css";
const CSS_REF = /url\((["']?)\.\.\/(fonts|img)\/([^"')?#]+)(\?v=[a-f0-9]+)?\1\)/g;

{
  const cssPath = join(root, CSS_FILE);
  const before = await readFile(cssPath, "utf8");
  const parts = [];
  let last = 0, m;
  CSS_REF.lastIndex = 0;
  while ((m = CSS_REF.exec(before)) !== null) {
    const [whole, quote, dir, file] = m;
    const v = await tag(`assets/${dir}/${file}`);
    if (v === null) missing.add(`assets/${dir}/${file}`);
    parts.push(before.slice(last, m.index),
      v ? `url(${quote}../${dir}/${file}?v=${v}${quote})` : whole);
    last = m.index + whole.length;
  }
  parts.push(before.slice(last));
  const after = parts.join("");
  if (after !== before) await writeFile(cssPath, after, "utf8");
  hashes.delete(CSS_FILE); // its contents just changed — re-hash from disk
  console.log(`stamp: ${(after.match(/\?v=/g) || []).length} asset url() in the stylesheet`);
}

/* -----------------------------------------------------------------------------
   2. Fingerprint every asset the pages reference.
   -------------------------------------------------------------------------- */
async function findPages(dir, prefix = "") {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isFile() && entry.name.endsWith(".html")) out.push(rel);
    else if (entry.isDirectory() && !prefix && !["assets", "content", "partials", "scripts", "src"].includes(entry.name)) {
      out.push(...(await findPages(join(dir, entry.name), rel)));
    }
  }
  return out;
}
const pages = await findPages(root);
let stamped = 0, changed = 0;

for (const page of pages) {
  const path = join(root, page);
  const before = await readFile(path, "utf8");
  const parts = [];
  let last = 0, match;

  REF.lastIndex = 0;
  while ((match = REF.exec(before)) !== null) {
    const [whole, attr, ref] = match;
    const v = await tag(ref);
    if (v === null) missing.add(ref);
    parts.push(before.slice(last, match.index), v ? `${attr}="/${ref}?v=${v}"` : `${attr}="/${ref}"`);
    last = match.index + whole.length;
    if (v) stamped++;
  }
  parts.push(before.slice(last));
  const after = parts.join("");

  if (after !== before) {
    await writeFile(path, after, "utf8");
    changed++;
  }
}

if (missing.size) {
  console.error(`  ! referenced but missing: ${[...missing].join(", ")}`);
  process.exitCode = 1;
}
console.log(`stamp: ${stamped} reference(s) fingerprinted, ${changed} page(s) rewritten.`);
