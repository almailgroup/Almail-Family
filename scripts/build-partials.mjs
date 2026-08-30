#!/usr/bin/env node
/**
 * build-partials.mjs
 * -----------------------------------------------------------------------------
 * A 40-line static "include" step so the header and footer live in ONE place
 * while every page still ships complete HTML (good for SEO, works with JS off).
 *
 * Usage:  npm run partials
 *
 * In any .html page, wrap a region like this:
 *
 *     <!-- @partial:header -->
 *     ...generated markup, do not edit...
 *     <!-- @endpartial -->
 *
 * The contents of partials/header.html are written between the markers.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const partialsDir = join(root, "partials");

// Load every partials/<name>.html into a map keyed by <name>.
const partials = new Map();
for (const file of await readdir(partialsDir)) {
  if (file.endsWith(".html")) {
    partials.set(file.replace(/\.html$/, ""), (await readFile(join(partialsDir, file), "utf8")).trim());
  }
}

const pages = (await readdir(root)).filter((f) => f.endsWith(".html"));
let changed = 0;

for (const page of pages) {
  const path = join(root, page);
  const before = await readFile(path, "utf8");

  const after = before.replace(
    /([ \t]*)<!--\s*@partial:([a-z0-9-]+)\s*-->[\s\S]*?<!--\s*@endpartial\s*-->/gi,
    (match, indent, name) => {
      const body = partials.get(name);
      if (!body) {
        console.warn(`  ! unknown partial "${name}" in ${page}`);
        return match;
      }
      // Re-indent the partial to match where it was used.
      const indented = body.split("\n").map((l) => (l ? indent + l : l)).join("\n");
      return `${indent}<!-- @partial:${name} -->\n${indented}\n${indent}<!-- @endpartial -->`;
    }
  );

  if (after !== before) {
    await writeFile(path, after, "utf8");
    console.log(`  ✓ ${page}`);
    changed++;
  }
}

console.log(`partials: ${changed} page(s) updated, ${pages.length} scanned.`);
