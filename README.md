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
├── heritage.html           Family history as a dated timeline
├── directory.html          Member directory — searchable, filterable by branch
├── blog.html               Journal — category filters + search
├── post.html               Single-article view  (post.html?p=<slug>)
├── contact.html            Contact form + details
├── 404.html                Not-found page
│
├── content/                ← THE ONLY FILES MOST EDITORS NEED TO TOUCH
│   ├── posts.js            Blog posts      (see §4)
│   ├── members.js          Directory entries
│   └── timeline.js         Heritage timeline entries
│
├── partials/               Shared markup, injected into every page at build time
│   ├── header.html         Navigation
│   └── footer.html         Footer
│
├── assets/
│   ├── css/site.css        Built stylesheet — generated, do not edit by hand
│   ├── js/
│   │   ├── site.js         Theme, mobile menu, active nav, reveal, shared helpers
│   │   ├── blog.js         Journal listing + homepage feed
│   │   ├── post.js         Single-article renderer
│   │   ├── directory.js    Directory grid, search, branch filter
│   │   ├── heritage.js     Timeline renderer
│   │   └── contact.js      Form validation + submission
│   └── img/
│       └── favicon.svg     Add photographs and covers here
│
├── src/input.css           Design system source — tokens, components, motion
├── scripts/
│   └── build-partials.mjs  Copies partials/ into every page (≈40 lines)
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
npm run build   # sync partials + build the minified stylesheet
```

`assets/css/site.css` is committed so the site can be deployed straight from the
repository without a build step on the host.

### Deploying

Any static host works. For GitHub Pages: push, then set
**Settings → Pages → Deploy from branch** and pick the branch and `/ (root)`.

---

## 3. Design system

**Palette — strictly monochrome.** Every colour is a token in `src/input.css`;
no literal colour appears anywhere else. The whole site inverts to a dark
monochrome scheme by setting `data-theme="dark"` on `<html>`, which the toggle in
the header does (and remembers, and honours the visitor's system preference on
first visit).

| Token | Light | Purpose |
|---|---|---|
| `canvas` | `#ffffff` | Page background |
| `surface` | `#fafafa` | Raised panels |
| `sunken` | `#f4f4f4` | Wells and hovers |
| `line` / `line-2` | `#e6e6e6` / `#d4d4d4` | Hairlines and stronger borders |
| `ink` | `#0a0a0a` | Primary text |
| `ink-2` | `#404040` | Body text |
| `muted` | `#737373` | Meta text |

Use them as ordinary Tailwind utilities: `bg-canvas`, `text-ink-2`,
`border-line`.

**Typography.** Space Grotesk for display headings, Inter for everything else,
each with a full system fallback stack so the page reads correctly before (or
without) the webfonts.

**Components** (defined once in `src/input.css`, used everywhere):
`container-x`, `section`, `reading`, `eyebrow`, `display-1/2/3`, `lede`, `meta`,
`btn` / `btn-primary` / `btn-outline` / `btn-ghost` / `btn-icon` / `btn-sm`,
`link-underline`, `card`, `chip`, `tag`, `label`, `field`, `article-body`,
`reveal`.

**Accessibility & performance.** Skip link, visible focus rings, `aria-current`
on the active nav item, live regions on the result counts, labelled icon links,
`prefers-reduced-motion` respected, and semantic landmarks throughout. The page
loads one 40 KB stylesheet and three small scripts — no framework, no runtime
dependency.

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

## 5. Connecting the contact form

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

## 6. A note on the current content

The posts, member profiles and timeline entries shipped in `content/` are
**sample placeholders**, written to demonstrate the layouts. Replace them with the
family's real material before publishing.
