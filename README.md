# The Almail Family — Portal

A sleek, strictly monochrome family portal for the Almail family in Kuwait: a
homepage with the latest news, a heritage timeline, a member directory, a
filterable journal, and a contact page.

Static HTML + Tailwind CSS v4 + vanilla JavaScript. No framework, no database,
no server. It can be hosted on GitHub Pages, Netlify, Cloudflare Pages or any
plain web server by uploading the folder as-is.

---

## 1. File structure

```
Almail-Family/
├── index.html              Homepage — hero, quick links, latest updates, CTA
├── heritage.html           History — the dated timeline
├── directory.html          Characters — member profiles, searchable by branch
├── blog.html               News, and Article via ?category=Articles
├── post.html               Single-article view  (post.html?p=<slug>)
├── pictures.html           The picture archive
├── resources.html          Sources and references
├── family-tree.html        The generations
├── location.html           Where to find the family house
├── contact.html            Contact form + details
├── 404.html                Not-found page
│
├── content/                ← THE ONLY FILES MOST EDITORS NEED TO TOUCH
│   ├── posts.js            Blog posts      (see §4)
│   ├── members.js          Directory entries
│   ├── timeline.js         Heritage timeline entries
│   ├── gallery.js          Pictures
│   ├── resources.js        Sources and references
│   ├── tree.js             The family tree (one nested object)
│   └── i18n.js             Arabic string table  (see §5)
│
├── partials/               Shared markup, injected into every page at build time
│   ├── header.html         Navigation
│   └── footer.html         Footer
│
├── assets/
│   ├── css/site.css        Built stylesheet — generated, do not edit by hand
│   ├── js/
│   │   ├── site.js         Theme, mobile menu, active nav, reveal, shared helpers
│   │   ├── i18n.js         English ⇄ Arabic switching and RTL
│   │   ├── blog.js         Journal listing + homepage feed
│   │   ├── post.js         Single-article renderer
│   │   ├── directory.js    Directory grid, search, branch filter
│   │   ├── heritage.js     Timeline renderer
│   │   ├── gallery.js      Picture grid
│   │   ├── resources.js    Grouped resource list
│   │   ├── tree.js         Family tree renderer
│   │   └── contact.js      Form validation + submission
│   ├── fonts/              Self-hosted WOFF2 subsets + LICENSE.md
│   └── img/
│       └── favicon.svg     Add photographs and covers here
│
├── src/input.css           Design system source — tokens, components, motion
├── scripts/
│   ├── build-partials.mjs  Copies partials/ into every page (≈40 lines)
│   └── stamp-assets.mjs    Fingerprints assets so caches can't go stale
├── package.json
└── README.md
```

**Why this shape.** Content is separated from markup: adding a post, a member or
a timeline entry means editing one data file, never touching HTML. The header and
footer live in `partials/` and are stamped into every page at build time, so the
pages still ship complete HTML (fast first paint, indexable, works with JS off)
while existing in exactly one place in source.

---

## 2. Running it

```bash
npm install     # once — installs the Tailwind CLI only
npm run dev     # sync partials, then rebuild CSS on every change
npm run serve   # serve the folder at http://localhost:3000
```

Before committing a change to `src/input.css` or `partials/`:

```bash
npm run build   # sync partials, build the stylesheet, fingerprint the assets
```

The three steps run in that order for a reason: the fingerprints are taken from
the *built* stylesheet, so the CSS has to exist first.

### Why the asset URLs carry `?v=`

`npm run stamp` rewrites every local reference to carry a fingerprint:

```html
<link rel="stylesheet" href="assets/css/site.css?v=82209628">
```

The tag is the first 8 characters of the SHA-256 of that file's own contents. A
changed file gets a new URL, so a browser cannot serve a stale copy after a
deploy; an unchanged file keeps its URL and stays cached, which is the point of
hashing the contents rather than stamping a build time. The step is idempotent,
and it **fails the build** if a page references a file that no longer exists —
which is exactly the mistake that leaves a deleted font 404-ing in the console
of anyone holding an old page.

The stylesheet is fingerprinted *first*, including the `url()` inside its
`@font-face` rules, so the CSS and the HTML `<link rel="preload">` ask for
byte-identical URLs. If those two disagree the browser fetches each preloaded
font twice — once for a preload it then cannot match, once for the CSS — and
warns that the preload went unused.

One thing this cannot reach: GitHub Pages serves the HTML itself with
`Cache-Control: max-age=600`, so a visitor who loaded a page in the last ten
minutes may still be on the old HTML. A hard reload (⌘⇧R / Ctrl-Shift-R) skips
it; after that, the fingerprints keep everything in step.

`assets/css/site.css` is committed so the site can be deployed straight from the
repository without a build step on the host.

### Deploying

Any static host works. For GitHub Pages: push, then set
**Settings → Pages → Deploy from branch** and pick the branch and `/ (root)`.

---

## 3. Design system

**Palette — paper and ink, Kuwait in the 1960s.** Every colour is a token in
`src/input.css`; no literal colour appears anywhere else. The whole site inverts
by setting `data-theme="dark"` on `<html>`, which the toggle in the header does
(and remembers, and honours the visitor's system preference on first visit).
Dark is not the light theme inverted — it is a night edition with its own
values. The base is a deep neutral carrying only a trace of warmth (a browner
one goes muddy and swallows the cream), and each surface sits a clear step above
the last so panels separate without needing a shadow: `canvas` `#14120f`,
`surface` `#1c1916`, `sunken` `#232019`, with the accent lifted to `#cc6a5f` so
it still reads. Two rules follow from it — cards take `surface` at night (they
share the page colour on paper, where a rule is enough), and the reverse panel
`.band-reverse` sinks instead of inverting, because a solid ink block flipped to
cream would put a glaring slab mid-page. Headings land at 16.4:1 against the
stock, body text at 10.7:1.

| Token | Light | Purpose |
|---|---|---|
| `canvas` | `#fbf2e6` | The paper |
| `surface` | `#f5e8d5` | A second, slightly deeper stock |
| `sunken` | `#efdfc8` | Wells and hovers |
| `line` / `line-2` | `#d9c8ac` / `#bfa886` | Hairline and heavier rules |
| `ink` | `#1e1913` | Letterpress ink — warm, never pure black |
| `ink-2` | `#4b3f31` | Body text |
| `muted` | `#7f6c56` | Meta text |
| `accent` | `#7d2b28` | Oxblood: rules, marks, marginalia |

The accent is deliberately rationed — the small square leading each section
label, the growing underline on links, the pulled-quote rule, the ornament, and
the mark under the current nav item. Nothing else.

Use them as ordinary Tailwind utilities: `bg-canvas`, `text-ink-2`,
`border-line`.

**Typography.** Two families, both self-hosted from `assets/fonts/` — the site
makes no third-party request, so it renders identically offline and on a host
with no outbound network.

| | Family | Where |
|---|---|---|
| Display | **Reem Kufi** — Khaled Hosny / Alif Type | Latin headings, wordmark, section labels, figures |
| Text | **IBM Plex Sans Arabic** — Bold Monday for IBM | Latin body copy, UI, forms |
| Arabic | **Noto Sans Arabic** — Google | Every line of Arabic, at any size and in either language mode |

Reem Kufi is a modern Kufic: flat terminals, geometric joins, squared counters —
which is what gives the Latin pages their Gulf character without a single
decorative flourish. IBM Plex Sans Arabic is engineered and low-contrast, built
for long reading at small sizes. Noto Sans Arabic carries all the Arabic — open,
wide and low-contrast, the register Gulf news sites read in.

**How the Arabic face wins without any conditional CSS.** It is declared
with an Arabic-only `unicode-range` and listed *first* in both stacks. A browser
resolves each character against the stack in order, so Arabic glyphs land on it
and Latin glyphs fall straight through to Reem Kufi or Plex. One declaration, no
`[lang]` rules, and a line mixing both scripts sets correctly.

### The face albayan.ae uses

That site sets its Arabic in **Mizan** (its CSS declares `MizanAR-LT-Medium`).
Mizan Arabic is a **commercial** typeface — the `LT` is the Linotype cut, now
sold through Monotype — so it is deliberately not bundled with this repository:
putting it on a public site needs a webfont licence bought in the family's name.

`src/input.css` carries a ready-to-enable declaration for it. Once you hold the
licence and have the webfont file:

1. Put it in `assets/fonts/` as `mizan-ar-medium.woff2`
2. Delete the two marked lines around the `@font-face` block
3. Set `--font-arabic: "Mizan AR"`
4. `npm run build`

Keep that block's `unicode-range` as written — it is what confines Mizan to
Arabic so the Latin keeps falling through to Reem Kufi and Plex, and it also
stops a visitor who has Mizan installed on their own machine from having it take
over the Latin as well.

Until then the site ships **Noto Sans Arabic**, which is the closest freely
licensed stand-in: compared against Mizan at matched size it shares the wide,
open, low-contrast proportions, where Almarai (the first choice here) turned out
noticeably narrower and more compact. Readex Pro is the other close option if
you want something rounder; it is a one-line change either way.

**Changing the Arabic face is one line.** Near the top of `src/input.css`:

```css
:root {
  /* "Noto Sans Arabic" (shipped) · "Almarai" (bundled) · "Mizan AR" (licensed) */
  --font-arabic: "Noto Sans Arabic";
}
```

Almarai is already bundled, so switching between those two is that line and
`npm run build` — its files are never fetched unless it is the named face. To
use a face that is not bundled: put its Arabic-subset `.woff2` in
`assets/fonts/`, copy an existing `@font-face` block, and name it here. That
works for a licensed commercial face too — drop in the file you are entitled to
use and nothing else changes.

All are SIL OFL 1.1; see `assets/fonts/LICENSE.md`.

Only the subsets actually used are downloaded — the `unicode-range` on each
`@font-face` means the Arabic cut is fetched only where Arabic is actually set.
An English page pulls 39 KB of type in five files; an Arabic page 63 KB in six.

Two details keep that number down. Reem Kufi is a **variable** font, so a single
file covers every weight the site uses — request two weights from Google Fonts
and it hands you the same whole-axis file twice. And the Arabic faces are
**re-subset** with `pyftsubset` to the Arabic block, dropping the legacy
presentation forms (U+FB50–FDFF, U+FE70–FEFF) that a font with proper shaping
never needs; that alone took Noto Sans Arabic from 162 KB to 23 KB per weight.

**Swapping a face.** Both are single tokens in `src/input.css`:

```css
--font-display: "Reem Kufi", …;         /* headings */
--font-sans: "IBM Plex Sans Arabic", …; /* text */
```

To change one, download the WOFF2 subsets into `assets/fonts/`, add matching
`@font-face` blocks at the top of `src/input.css`, point the token at the new
name and run `npm run build`. Nothing else in the codebase names a font.

**Arabic alongside Latin.** Section labels are set bilingually — `الدليل`
before `DIRECTORY`, `التراث` before `HERITAGE`. Arabic is a joined script, so
letter-spacing and `text-transform` would break the joins; the `.ar` and
`.ar-lead` classes reset both and bump the optical size. Always pair them with
`lang="ar" dir="rtl"`:

```html
<p class="eyebrow"><span class="ar-lead" lang="ar" dir="rtl">التراث</span>Heritage</p>
```

The wordmark is deliberately Latin-only: we did not want to guess the spelling
of the family name in Arabic. `partials/header.html` carries a commented line
showing exactly where to add it.

**The masthead.** The header is set the way a paper of the period set its
nameplate: navigation on one side, the name centred, language and colour scheme
on the other, over a compositor's double rule. It is a three-column grid, so the
name is centred against the page rather than against whatever happens to flank
it, and the whole thing mirrors in Arabic from the one `dir="rtl"`. On a narrow
screen the menu trigger takes the navigation's place and the language button
shortens to `ع` / `EN`.

**Press furniture.** The period reads through a handful of print devices rather
than decoration:

- `.rule-double` — one heavy line over one hairline, the way a paper of the era
  separated a masthead or a section head from its columns. The site header and
  each page header carry it.
- `.ornament` — an eight-point star between two rules, set between sections.
- `.card` — a heavy rule across the top, like a column head.
- A drop cap on the opening paragraph of an article. Latin only: Arabic is a
  joined script and cannot take an initial, so the rule is scoped to
  `:root[lang="en"]`.
- Paper grain — a fixed overlay of fine SVG noise multiplied into the stock at
  `--grain` opacity, so flat colour never reads as screen-flat. Inert and
  decorative; set `--grain: 0` to remove it.

**The homepage banner.** `assets/img/AlmailFamilyBack.png` is set as the hero's
background through the `.hero-banner` class in `src/input.css`. Its own cream is
`#fcf3e8` against the page's `#fbf2e6` — one point apart, so the edges of the
image disappear into the page and it needs no framing.

It is served as WebP (26 KB) with the PNG kept as both the source file and the
fallback for anything that cannot read `image-set()`. The conversion mattered:
the PNG is 1.2 MB, which would have been more than four times the weight of the
whole rest of the page, and a soft gradient image compresses to nothing in WebP
(mean difference under 1/255 — no visible loss).

Below 768px `cover` would crop away both palms and leave only the empty middle,
so the banner switches to sitting full-width along the bottom. In dark mode it
is hidden: a cream photograph has no place on the night stock, and the star
tessellation carries the hero there instead. To swap the picture, replace the
file and run `npm run build` — the fingerprint changes with it, so no one gets
a cached copy of the old one.

**Pattern.** The hero carries a hairline eight-point star tessellation
(`.geo-pattern`). It is applied as a CSS *mask* rather than a background image,
so its colour comes from the theme's own `--c-line` token and it inverts
correctly in dark mode. Delete the one `<div>` in `index.html` to remove it.

**Components** (defined once in `src/input.css`, used everywhere):
`container-x`, `section`, `reading`, `eyebrow`, `display-1/2/3`, `lede`, `meta`,
`btn` / `btn-primary` / `btn-outline` / `btn-ghost` / `btn-icon` / `btn-sm`,
`link-underline`, `card`, `chip`, `tag`, `label`, `field`, `article-body`,
`reveal`.

**Accessibility & performance.** Skip link, visible focus rings, `aria-current`
on the active nav item, live regions on the result counts, labelled icon links,
`prefers-reduced-motion` respected, and semantic landmarks throughout. The page
loads one 47 KB stylesheet, five or six font subsets (39–63 KB) and four small
scripts — no framework, no runtime dependency, no third-party request.

---

## 4. Adding a blog post

Open **`content/posts.js`** and add one block to the top of the array:

```js
{
  slug: "eid-lunch-2027",                    // URL id → post.html?p=eid-lunch-2027
  title: "Notes from the Eid lunch",
  category: "Events",                        // Events | Announcements | Articles | Photo Highlights
  date: "2027-04-12",                        // YYYY-MM-DD — drives the ordering
  author: "Family Council",
  excerpt: "One or two sentences shown on the card and in search results.",
  // image: "assets/img/eid-2027.jpg",       // optional cover; omit for a monogram placeholder
  // featured: true,                         // optional — eligible for the wide homepage slot
  body: `
    <p class="lede">An opening line, set slightly larger.</p>
    <p>Ordinary paragraphs go here.</p>
    <h2>A section heading</h2>
    <ul><li>A list item</li></ul>
    <blockquote>A pulled quote.</blockquote>
  `,
},
```

Save the file. That's the whole process — no build, no rebuild, no deploy step
beyond pushing the file. The post appears automatically:

- on the **homepage** feed (newest first),
- in the **Journal**, under its category filter and in search,
- at its own URL, `post.html?p=<slug>`,
- and in the previous/next links of its neighbouring posts.

**Writing the body.** Plain HTML between the backticks. `<p>`, `<h2>`, `<h3>`,
`<ul>`, `<ol>`, `<blockquote>`, `<a>`, `<img>`, `<figure>`/`<figcaption>` and
`<hr>` are all styled by `.article-body` already. Add `class="lede"` to the first
paragraph for a larger opening line. If your text contains a backtick or `${`,
escape it with a backslash.

**Images.** Drop the file in `assets/img/` and reference it as
`assets/img/your-file.jpg`, either as the post's `image` or inline in the body.

**Adding a category.** Add the name to the `CATEGORIES` array at the top of
`assets/js/blog.js`; the filter chip appears as soon as a post uses it.

### Adding a directory member or a timeline entry

The same pattern: add a block to `content/members.js` or `content/timeline.js`.
Both files carry a field reference in their header comment. New family branches
create their own filter chip automatically, in the order they first appear.

Publish a living family member's details only with their agreement.

---

## 5. Language — English and Arabic

Every page is bilingual. The button in the header switches between them; the
choice is remembered, and `?lang=ar` on any URL is shareable.

**English is the source language.** It lives in the HTML and in the scripts,
exactly where you would look for it. `content/i18n.js` holds *only* the Arabic.
Switching to Arabic replaces the content of every `data-i18n` element, swaps the
attributes named by `data-i18n-attr`, and sets `<html lang="ar" dir="rtl">`;
the original English is cached in memory, so switching back needs no second
dictionary and nothing is ever duplicated.

**Check `brand.family` first.** It is at the top of `content/i18n.js` and holds
our best transliteration of the family name into Arabic — we could not verify
how the family actually spells it. Every Arabic string that names the family
uses the `{family}` token rather than spelling it out, so correcting that one
line updates the whole site. The surname also appears in the `nameAr` fields in
`content/members.js`, which is a find-and-replace.

### Adding a string

```html
<p data-i18n="home.heroLede">The English text, as normal.</p>
<input data-i18n-attr="placeholder:directory.searchPh" placeholder="Search…">
```
```js
t("blog.read", "Read")            // English default is the second argument
```

Then add the key to `content/i18n.js`. Nothing else is needed.

### Translating content

Posts, members and timeline entries take an `Ar` field beside each English one —
`titleAr`, `excerptAr`, `bodyAr`, `nameAr`, `roleAr`, `bioAr`, and so on. A
partly translated file still renders correctly: anything without an `Ar` field
falls back to English and is marked `lang="en" dir="ltr"` so the bidirectional
layout stays right. Search covers both languages, so an Arabic query still finds
an untranslated post.

### How the layout mirrors

Every direction-sensitive style uses CSS logical properties — `ps-*`/`pe-*`,
`ms-*`/`me-*`, `start-*`/`end-*`, `border-s`/`border-e`, `text-end` — so the
whole page mirrors from the one `dir="rtl"` attribute, including the timeline
rail and the article body. Arrows carry `rtl:rotate-180`. Arabic also resets the
Latin tracking, word spacing and uppercasing (which damage a joined script) and
takes more leading; that is the `:root[lang="ar"]` block in `src/input.css`.

Counts read as proper Arabic — one, two, a few, many are all different forms
(`منشوران` for two, not "2 منشور"); see `arCount` at the bottom of
`content/i18n.js`. Dates use Arabic month names with Western digits, as Gulf
publications do.

**No flash, and no JavaScript required.** The language is resolved by the inline
snippet in each page's `<head>`, before first paint. It sets `data-i18n-pending`
only for Arabic and only from that script, which hides translatable text for the
one frame before the swap — so with JavaScript disabled nothing is hidden and
the page simply reads in English.

### A note on the Arabic

The Arabic throughout — interface, page copy and the sample content — was
written for this build and reads as standard MSA, but it has not been reviewed
by a native speaker. Have someone in the family read it before you publish,
particularly the family name.

---

## 6. Connecting the contact form

Out of the box the form validates in the browser, then opens the visitor's mail
client with everything pre-filled — so it works on a purely static host with no
backend.

To collect submissions instead, open `assets/js/contact.js` and set:

```js
var ENDPOINT = "https://formspree.io/f/xxxxxxxx";
```

Any service that accepts a JSON `POST` works (Formspree, Basin, Netlify Forms, or
your own handler). The form posts `{ name, email, subject, message }` and reports
success or failure in place. A honeypot field filters out basic bots. Also update
`FALLBACK_EMAIL` in the same file and the address in `partials/footer.html`.

---

## 7. A note on the current content

The posts, member profiles and timeline entries shipped in `content/` are
**sample placeholders**, written to demonstrate the layouts. Replace them with the
family's real material before publishing.
