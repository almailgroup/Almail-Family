/* =============================================================================
   prerender.mjs — put the content into the HTML
   -----------------------------------------------------------------------------
   Every list and every article on this site is drawn by JavaScript out of
   content/*.js. A browser runs it; a crawler mostly does not, and a chat app
   building a link preview never does. Measured before this existed, the served
   HTML held 333 characters of the journal, 507 of the directory, 74 of any
   article — the site Google was asked to rank was about four thousand
   characters across eight pages.

   So the same pages are opened in a real browser at build time and what it
   draws is written back into the files. No second implementation of any
   renderer: the browser runs the very code the reader's browser runs, which is
   the only way the two cannot drift apart.

   It does two things:

     fills a container   #post-grid, #timeline and the rest are filled in
                         place, between @pre markers so the next run replaces
                         rather than nests.
     gives each item a   /post/<slug>/ and /member/<id>/ become real pages
     page                with their own title, description and text. The
                         ?p= and ?id= forms still work — site.js reads the
                         path only when no query is given — so nothing
                         already shared or indexed breaks.

   Chromium is found by $CHROME or by looking in the usual places. WITHOUT IT
   THIS STEP SKIPS RATHER THAN FAILS, leaving the last good output in place: a
   stale page is a smaller problem than a build that will not run, and the
   warning says plainly what happened.
   ========================================================================== */
import { createServer } from "node:http";
import { readdir, readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://almailfamily.com";

/* --- the browser ---------------------------------------------------------- */
const CANDIDATES = [
  process.env.CHROME,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
].filter(Boolean);
const CHROME = CANDIDATES.find((p) => existsSync(p));

if (!CHROME) {
  console.log("prerender: no Chromium found — skipped. " +
              "Set $CHROME to build the pre-rendered HTML.");
  process.exit(0);
}

/* --- a static server, so the browser sees the site as it will be served ---- */
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".ico": "image/x-icon", ".xml": "application/xml",
  ".json": "application/json", ".txt": "text/plain" };

const server = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  try {
    const body = await readFile(join(root, p));
    res.writeHead(200, { "content-type": TYPES[extname(p)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html" });
    res.end(await readFile(join(root, "404.html")).catch(() => "not found"));
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;
const url = (path) => `http://127.0.0.1:${PORT}${path}`;

/* --- render one page and hand back its DOM -------------------------------- */
async function dump(path) {
  const { stdout } = await run(CHROME, [
    "--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
    "--virtual-time-budget=8000", "--dump-dom", url(path),
  ], { maxBuffer: 64 * 1024 * 1024 });
  return stdout;
}

/* --- pull one element's contents out of a dump ----------------------------
   Depth-counted rather than regexed to a closing tag, because these contain
   nested elements of the same name and a lazy match would stop at the first
   one. */
function inner(html, id) {
  const at = html.indexOf(`id="${id}"`);
  if (at < 0) return null;
  const open = html.lastIndexOf("<", at);
  const tag = html.slice(open + 1).match(/^[a-zA-Z0-9-]+/)[0];
  const start = html.indexOf(">", at) + 1;
  const re = new RegExp(`<${tag}\\b|</${tag}>`, "gi");
  re.lastIndex = start;
  let depth = 1, m;
  while ((m = re.exec(html))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return html.slice(start, m.index);
  }
  return null;
}

/* --- write it back between markers ---------------------------------------- */
function fill(html, id, content) {
  const at = html.indexOf(`id="${id}"`);
  if (at < 0) return html;
  const start = html.indexOf(">", at) + 1;
  const block = `\n<!-- @pre ${id} — generated by scripts/prerender.mjs; ` +
                `edit content/*.js, then run \`npm run build\`. -->\n` +
                content.trim() + `\n<!-- @endpre ${id} -->\n`;

  const marker = html.indexOf(`<!-- @pre ${id} `, start);
  if (marker >= 0) {
    const end = html.indexOf(`<!-- @endpre ${id} -->`, marker);
    return html.slice(0, marker) + block.trimStart() +
           html.slice(end + `<!-- @endpre ${id} -->`.length + 1);
  }
  /* First run: the container holds only its placeholder comment. */
  const re = new RegExp(`<${html.slice(html.lastIndexOf("<", at) + 1).match(/^[a-zA-Z0-9-]+/)[0]}\\b|</`, "i");
  void re;
  return html.slice(0, start) + block + html.slice(start);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
                            .replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* --- the content, loaded the way a browser would -------------------------- */
async function content() {
  const win = {};
  for (const f of ["posts", "members"]) {
    const src = await readFile(join(root, `content/${f}.js`), "utf8");
    new Function("window", src)(win);
  }
  return { posts: win.ALMAIL?.posts || [], members: win.ALMAIL?.members || [] };
}

/* --- listing pages -------------------------------------------------------- */
const PAGES = {
  "blog/index.html":        ["/blog/",        ["post-grid"]],
  "directory/index.html":   ["/directory/",   ["member-grid"]],
  "heritage/index.html":    ["/heritage/",    ["timeline"]],
  "pictures/index.html":    ["/pictures/",    ["gallery-grid"]],
  "resources/index.html":   ["/resources/",   ["resource-list"]],
  "family-tree/index.html": ["/family-tree/", ["tree-root"]],
};

let filled = 0;
for (const [file, [path, ids]] of Object.entries(PAGES)) {
  const dom = await dump(path);
  let html = await readFile(join(root, file), "utf8");
  for (const id of ids) {
    const got = inner(dom, id);
    if (got === null || !got.trim()) continue;
    html = fill(html, id, got);
  }
  await writeFile(join(root, file), html);
  filled++;
}

/* --- one page per article and per person ---------------------------------- */
async function itemPages(kind, items, idOf, titleOf, descOf, container) {
  const template = await readFile(join(root, `${kind}/index.html`), "utf8");
  /* Clear out last run's pages, so a deleted or renamed item does not leave a
     page behind that the sitemap would go on advertising. */
  for (const e of await readdir(join(root, kind), { withFileTypes: true })) {
    if (e.isDirectory()) await rm(join(root, kind, e.name), { recursive: true, force: true });
  }

  for (const item of items) {
    const id = idOf(item);
    const dom = await dump(`/${kind}/?${kind === "post" ? "p" : "id"}=${encodeURIComponent(id)}`);
    const body = inner(dom, container);
    if (!body || !body.trim()) {
      console.warn(`prerender: ${kind}/${id} rendered nothing — skipped.`);
      continue;
    }
    const canonical = `${SITE}/${kind}/${encodeURIComponent(id)}/`;
    let html = template
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(titleOf(item))}</title>`)
      .replace(/<meta name="description" content="[^"]*">/,
               `<meta name="description" content="${esc(descOf(item))}">`)
      .replace(/<link rel="canonical" href="[^"]*">/,
               `<link rel="canonical" href="${canonical}">`)
      /* The template opts out of the sitemap; its children are the real pages
         and belong in it. */
      .replace(/[ \t]*<meta name="sitemap" content="exclude">\n/, "")
      .replace(/[ \t]*<!-- Not a page in its own right[\s\S]*?-->\n/, "")
      /* The template's "needs JavaScript" fallback is true of the template and
         false of this page, which now carries the article in its HTML. */
      .replace(/[ \t]*<noscript>[\s\S]*?<\/noscript>\n/, "")
      .replace(/[ \t]*<!-- The \w+ is injected here\. -->\n/, "");
    html = fill(html, container, body);
    const dir = join(root, kind, id);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, "index.html"), html);
  }
  return items.length;
}

const { posts, members } = await content();
const nPosts = await itemPages("post", posts,
  (p) => p.slug,
  (p) => `${p.title} — The Almail Family`,
  (p) => (p.excerpt || p.title || "").slice(0, 180),
  "article-root");
const nMembers = await itemPages("member", members,
  (m) => m.id,
  (m) => `${m.name} — The Almail Family`,
  (m) => (m.bio || m.role || m.name || "").slice(0, 180),
  "member-root");

server.close();
console.log(`prerender: ${filled} listing page(s), ${nPosts} article(s), ${nMembers} member page(s).`);
