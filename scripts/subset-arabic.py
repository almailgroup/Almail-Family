#!/usr/bin/env python3
"""subset-arabic.py — the few Arabic glyphs an English page shows, and no more.

An English page on this site carries a little Arabic: the language button reads
العربية, and each section's eyebrow gives its name — التراث, الدليل, الأخبار.
Nine words, twenty characters. Serving them was costing 46.7KB, because the
browser fetched the whole Noto Sans Arabic in two weights to draw them.

So the whole face is cut down to exactly the characters the built English pages
contain, in both weights, and the stylesheet uses that cut until the reader
asks for Arabic — at which point :root[lang="ar"] names the full face and it is
fetched then, once, for a page that is entirely Arabic.

THE TWO FACES ARE NEVER MIXED WITHIN A PAGE, and that is the whole reason for
the lang switch rather than a font stack. Arabic is cursive: its letters join,
and their shape depends on their neighbours. Let a browser fall back mid-word
because one letter is missing from the first font and the joins break in the
middle of the word. One face per page, chosen by the language.

The characters are read from the BUILT pages rather than a list kept by hand,
so adding a section or renaming one cannot quietly leave a glyph behind. The
set is recorded next to the fonts, and scripts/check-fonts.mjs fails the build
if the pages ever come to need a character the cut does not have.

    npm run fonts        (after changing any Arabic that shows in English)
"""
import glob, os, re, sys
from fontTools import subset

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
ARABIC = lambda c: 0x0600 <= ord(c) <= 0x06FF or 0xFB50 <= ord(c) <= 0xFEFF

chars = set()
for path in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
    if "node_modules" in path or os.sep + "partials" + os.sep in path:
        continue
    html = open(path, encoding="utf-8").read()
    # Arabic inside <script> is content/i18n.js data for the Arabic edition,
    # which is served by the full face, not this cut.
    html = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    html = re.sub(r"<style.*?</style>", "", html, flags=re.S)
    chars |= {c for c in html if ARABIC(c)}

if not chars:
    sys.exit("subset-arabic: no Arabic found in the built pages — run `npm run build` first.")

text = "".join(sorted(chars))
total_before = total_after = 0
for weight in ("400", "700"):
    src = os.path.join(ROOT, f"assets/fonts/noto-sans-arabic-{weight}-arabic.woff2")
    out = os.path.join(ROOT, f"assets/fonts/noto-sans-arabic-{weight}-ui.woff2")
    # layout-features=* keeps every shaping feature for the glyphs retained,
    # which is what makes the letters still join.
    subset.main([src, f"--text={text}", "--layout-features=*",
                 "--flavor=woff2", f"--output-file={out}"])
    total_before += os.path.getsize(src)
    total_after += os.path.getsize(out)
    print("  %-38s %6.1f KB -> %5.1f KB" % (os.path.basename(src),
          os.path.getsize(src) / 1024, os.path.getsize(out) / 1024))

open(os.path.join(ROOT, "assets/fonts/arabic-ui.charset"), "w", encoding="utf-8").write(text + "\n")
print("subset-arabic: %d characters, %.1f KB -> %.1f KB (%d%% less on every English page)"
      % (len(chars), total_before / 1024, total_after / 1024,
         round((1 - total_after / total_before) * 100)))
