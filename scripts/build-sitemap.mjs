/* =============================================================================
   build-sitemap.mjs — the map Google is given
   -----------------------------------------------------------------------------
   Lists every indexable page, taken from the canonical each one already
   declares, so a page cannot appear here under a URL it does not claim for
   itself. Pages marked noindex — the 404 and the /home/ redirect — are left
   out, as is anything with no canonical.

   lastmod comes from git: the date that page's file was last committed, which
   is the honest answer and needs no upkeep. Outside a git checkout it is left
   off rather than guessed, since a wrong lastmod is worse than none.

   A page can also keep itself out with <meta name="sitemap" content="exclude">.
   /post/ and /member/ do: bare, they are only a "not found", and they carry
   real content solely as /post/?p=... and /member/?id=..., which are rendered
   by JavaScript from content/*.js and so carry no text for a crawler yet.
   Listing either would invite Google to index an empty page. Neither is
   noindex, because that would bar the real article and member URLs too —
   they are the same document with a query string.
   ========================================================================== */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function pages(dir = root, base = "") {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...(await pages(join(dir, e.name), rel)));
    else if (e.name.endsWith(".html")) out.push(rel);
  }
  return out;
}

function lastCommitted(rel) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", rel],
                           { cwd: root, encoding: "utf8" }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : "";
  } catch { return ""; }
}

const entries = [];
for (const rel of (await pages()).sort()) {
  const html = await readFile(join(root, rel), "utf8");
  if (/name="robots"\s+content="noindex"/.test(html)) continue;
  if (/name="sitemap"\s+content="exclude"/.test(html)) continue;
  const loc = (html.match(/<link rel="canonical" href="([^"]*)"/) || [, ""])[1];
  if (!loc) continue;
  entries.push({ loc, lastmod: lastCommitted(rel) });
}

/* The homepage first, then the rest alphabetically — a sitemap is read by
   machines, but it is also read by whoever has to debug one. */
entries.sort((a, b) =>
  a.loc.replace(/\/$/, "").length - b.loc.replace(/\/$/, "").length ||
  a.loc.localeCompare(b.loc));

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries.map((e) =>
    "  <url>\n" +
    `    <loc>${e.loc}</loc>\n` +
    (e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : "") +
    "  </url>\n").join("") +
  "</urlset>\n";

await writeFile(join(root, "sitemap.xml"), xml);
console.log(`sitemap: ${entries.length} url(s).`);
