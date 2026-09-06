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
 * Run after the CSS is built (npm run build does this in order). Idempotent:
 * any existing ?v= is stripped before the current one is applied.
 */
import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Matches href/src pointing at our own assets/ or content/ files.
const REF = /\b(href|src)="((?:assets|content)\/[^"?#]+)(\?v=[a-f0-9]+)?"/g;

const hashes = new Map();
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

const pages = (await readdir(root)).filter((f) => f.endsWith(".html"));
let stamped = 0, changed = 0;
const missing = new Set();

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
    parts.push(before.slice(last, match.index), v ? `${attr}="${ref}?v=${v}"` : `${attr}="${ref}"`);
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
