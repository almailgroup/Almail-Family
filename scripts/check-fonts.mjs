/* =============================================================================
   check-fonts.mjs — stop a missing glyph reaching the site
   -----------------------------------------------------------------------------
   The English pages are served a cut-down Arabic face holding only the
   characters they were shown to need (see scripts/subset-arabic.py). Add a
   section whose eyebrow uses a letter the cut does not have and that letter
   would fall back to whatever Arabic font the reader's machine happens to
   have — or to nothing.

   So the built pages are checked against the set the cut was made from, and
   the build FAILS rather than warns: a warning in a build that keeps going is
   a warning nobody reads.
   ========================================================================== */
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const isArabic = (c) => (c >= 0x0600 && c <= 0x06ff) || (c >= 0xfb50 && c <= 0xfeff);

let charset;
try {
  charset = new Set([...(await readFile(join(root, "assets/fonts/arabic-ui.charset"), "utf8")).trim()]);
} catch {
  console.log("check-fonts: no cut recorded yet — run `npm run fonts`. Skipped.");
  process.exit(0);
}

async function pages(dir = root, base = "") {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".") || e.name === "partials") continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await pages(join(dir, e.name), rel)));
    else if (e.name.endsWith(".html")) out.push(rel);
  }
  return out;
}

const missing = new Map();
for (const rel of await pages()) {
  /* The BODY only. A page's <head> carries Arabic too — the bilingual <title>
     and the og:title beside it — and none of it is ever drawn with the page's
     fonts: a tab and a search result are painted by the browser and by Google
     in their own. Counting those would grow the cut to serve text no webfont
     ever touches. */
  const full = await readFile(join(root, rel), "utf8");
  const body = full.slice(Math.max(0, full.indexOf("<body")));
  const html = body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "");
  for (const ch of html) {
    if (isArabic(ch.codePointAt(0)) && !charset.has(ch)) {
      if (!missing.has(ch)) missing.set(ch, rel);
    }
  }
}

if (missing.size) {
  console.error(`check-fonts: ${missing.size} Arabic character(s) on the English pages are ` +
                "not in the cut-down face:");
  for (const [ch, where] of missing) console.error(`   ${ch}  U+${ch.codePointAt(0).toString(16).toUpperCase()}  first seen in ${where}`);
  console.error("Run `npm run fonts` to rebuild the cut, then build again.");
  process.exit(1);
}
console.log(`check-fonts: ${charset.size} Arabic characters, all covered.`);
