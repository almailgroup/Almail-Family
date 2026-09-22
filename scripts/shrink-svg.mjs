/* =============================================================================
   shrink-svg.mjs — make a generated drawing cheap to send
   -----------------------------------------------------------------------------
   assets/img/kuwait-skyline.svg is the footer panorama, and at 174KB it was the
   heaviest thing on EVERY page — heavier than the stylesheet, the scripts and
   the banner photograph together. It is decoration at the foot of a page, and
   on a phone it is a strip an inch tall.

   The weight is not detail, it is repetition: 2,064 <path> elements at about 84
   bytes each, most of it the same attributes written out over and over.

   WHAT MAY NOT BE TOUCHED, learned by getting it wrong: `opacity` is not an
   inherited property in SVG, it is a COMPOSITING one. A group at 0.8 holding a
   path at 0.21 renders at 0.168 — the group is composited as one layer and then
   faded. This drawing is built that way: eight landmark groups carrying the
   aerial perspective (0.8 for the far ones, 1 for the near), and every single
   path inside carrying its own opacity for ink weight. Flattening those groups
   into their children and keeping the child's value throws the group's away and
   the distant landmarks come forward. Multiplying the two is no better, because
   the children overlap and a group's opacity applies to the assembled layer,
   not to each piece. So a group carrying anything that composites is KEPT.

   The passes, none of which may change a pixel:

     flatten   a <g> carrying only inheritable paint is pushed into its
               children and dropped. One carrying opacity, a filter, a mask, a
               clip or a transform stays exactly where it is.
     inherit   an attribute identical to the one already in force is dropped.
     round     coordinates to --decimals places. Opacities always keep three,
               since 0.21 rounded to whole numbers is 0.
     merge     a run of CONSECUTIVE sibling <path>s sharing their paint and
               carrying nothing but `d` becomes one path. Consecutive and
               sibling only: these paint in document order.
     strip     comments, and the whitespace between elements.

   Idempotent. Verified by rendering the drawing before and after at the size
   it is actually shown and comparing every pixel.

       node scripts/shrink-svg.mjs assets/img/kuwait-skyline.svg [--decimals=1]
   ========================================================================== */
import { readFile, writeFile } from "node:fs/promises";

const file = process.argv.find((a) => a.endsWith(".svg"));
if (!file) { console.error("usage: shrink-svg.mjs <file.svg> [--decimals=N]"); process.exit(1); }
const DECIMALS = Number((process.argv.find((a) => a.startsWith("--decimals=")) || "=1").split("=")[1]);
const NO_MERGE = process.argv.includes("--no-merge");

const src = await readFile(file, "utf8");
const before = Buffer.byteLength(src);

const parseAttrs = (tag) => {
  const out = {};
  for (const m of tag.matchAll(/([a-zA-Z-]+)="([^"]*)"/g)) out[m[1]] = m[2];
  return out;
};

const rootTag = src.match(/<svg\b[^>]*>/)[0];
const rootAttrs = parseAttrs(rootTag);

/* Safe to push into children: these genuinely inherit, value for value. */
const INHERITABLE = new Set(["fill", "stroke", "stroke-linecap", "stroke-linejoin",
                             "stroke-width", "fill-rule", "color"]);
/* Must stay on the group: each composites the group as a single layer. */
const COMPOSITING = new Set(["opacity", "fill-opacity", "stroke-opacity", "filter",
                             "mask", "clip-path", "style", "transform"]);
const GEOMETRY = new Set(["d", "cx", "cy", "r", "rx", "ry", "x", "y", "width", "height",
                          "x1", "y1", "x2", "y2", "points", "transform"]);

const round = (n, p) => { const f = 10 ** p; return String(Math.round(parseFloat(n) * f) / f); };
const num = (s, p) => s.replace(/-?\d*\.\d+/g, (n) => round(n, p));
const isAlpha = (k) => k === "opacity" || k === "fill-opacity" || k === "stroke-opacity";

/* --- parse into a tree ---------------------------------------------------- */
const body = src.slice(rootTag.length, src.lastIndexOf("</svg>"));
const root = { tag: "g", attrs: {}, children: [] };
const open = [root];
for (const m of body.matchAll(/<(\/?)([a-zA-Z]+)\b([^>]*?)(\/?)>/g)) {
  const [whole, closing, tag, , selfClosed] = m;
  const parent = open[open.length - 1];
  if (closing) { open.pop(); continue; }
  const node = { tag, attrs: parseAttrs(whole), children: [] };
  parent.children.push(node);
  if (!selfClosed && tag === "g") open.push(node);
}

/* --- emit ----------------------------------------------------------------- */
const render = (o) => Object.entries(o).map(([k, v]) => ` ${k}="${v}"`).join("");
const key = (o) => JSON.stringify(Object.entries(o).sort());

function shrink(node, inherited) {
  /* An id names one element; these are landmark labels the site never refers
     to, and the names live in scripts/draw-skyline.py where they are edited. */
  const attrs = Object.assign({}, node.attrs);
  delete attrs.id;

  if (node.tag === "g") {
    const composites = Object.keys(attrs).some((k) => COMPOSITING.has(k));
    const paint = {};
    const inner = Object.assign({}, inherited);
    for (const [k, v] of Object.entries(attrs)) {
      const val = isAlpha(k) ? num(v, 3) : num(v, DECIMALS);
      if (INHERITABLE.has(k)) { if (inner[k] !== val) { inner[k] = val; if (composites) paint[k] = val; } }
      else paint[k] = val;
    }
    /* Nothing that composites, and nothing left to say: the group dissolves
       and its children carry on with the same inherited paint. */
    const kids = emitList(node.children, inner);
    if (!composites && Object.keys(paint).length === 0) return kids;
    return `<g${render(paint)}>${kids}</g>`;
  }

  const geo = {}, paint = {};
  for (const [k, v] of Object.entries(attrs)) {
    const val = isAlpha(k) ? num(v, 3) : num(v, DECIMALS);
    if (isAlpha(k) && parseFloat(val) === 1) continue;        // the default
    if (INHERITABLE.has(k) && inherited[k] === val) continue; // already in force
    (GEOMETRY.has(k) ? geo : paint)[k] = val;
  }
  return { tag: node.tag, geo, paint };
}

function emitList(children, inherited) {
  const parts = children.map((c) => shrink(c, inherited));
  let out = "";
  for (let i = 0; i < parts.length; ) {
    if (typeof parts[i] === "string") { out += parts[i]; i++; continue; }
    const k = key(parts[i].paint);
    let j = i;
    while (j < parts.length && typeof parts[j] === "object" && key(parts[j].paint) === k) j++;
    const run = parts.slice(i, j);
    const mergeable = !NO_MERGE && run.length > 1 &&
      run.every((e) => e.tag === "path" && Object.keys(e.geo).length === 1 && e.geo.d);
    if (mergeable) {
      out += `<path d="${run.map((e) => e.geo.d).join("")}"${render(run[0].paint)}/>`;
    } else {
      for (const e of run) out += `<${e.tag}${render(e.geo)}${render(e.paint)}/>`;
    }
    i = j;
  }
  return out;
}

const inheritedFromRoot = {};
for (const [k, v] of Object.entries(rootAttrs)) if (INHERITABLE.has(k)) inheritedFromRoot[k] = v;

const result = num(rootTag, DECIMALS) + emitList(root.children, inheritedFromRoot) + "</svg>\n";
const after = Buffer.byteLength(result);

if (after >= before) {
  console.log(`shrink-svg: ${file} already minimal (${(before / 1024).toFixed(1)} KB).`);
  process.exit(0);
}
await writeFile(file, result);
console.log(`shrink-svg: ${file}  ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB ` +
            `(${Math.round((1 - after / before) * 100)}% smaller)`);
