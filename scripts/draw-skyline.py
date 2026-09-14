#!/usr/bin/env python3
"""
draw-skyline.py
===============================================================================
Draws assets/img/kuwait-skyline.svg: eight Kuwaiti landmarks across the bay,
cut the way a steel engraver would cut them rather than as flat silhouettes.

    python3 scripts/draw-skyline.py

This is an ART tool, run by hand when the drawing changes. It is deliberately
NOT part of `npm run build` — the committed SVG is what the site loads, and the
build only fingerprints it.

WHY A GENERATOR: the drawing lives or dies on repetition done exactly — dome
ribs on a true meridian, the cladding grid of a sphere, an arcade whose arches
share one spring line, twenty palm fronds that differ but agree. Typing those
by hand is how a drawing starts to look homemade.

HOW THE TONE WORKS: the SVG is used as a CSS mask, so only ALPHA reaches the
page and nothing here carries colour. That means tone can only ever be ADDED,
never taken away — so masses are laid in at partial alpha and the linework goes
over them at full, which is exactly how an engraver builds a tone: the plate is
light, the burin darkens it. The four values below are the whole palette.
===============================================================================
"""
import math
import random
from pathlib import Path

W, H = 2400, 460
QUAY = 392                     # the far shore: everything stands on this
random.seed(1938)              # the year in the masthead; keeps builds identical

# The tonal scale. Alpha composites over itself, so LINE over MASS reads as the
# darkest note available and HATCH over MASS lands halfway between.
FAR = 0.21                     # the modern city behind the monuments
MASS = 0.68                    # the body of a building
HATCH = 0.34                   # shading laid into a mass
LINE = 1.00                    # outlines, ribs, mullions, the burin


# ---------------------------------------------------------------- primitives
def fil(d, op=MASS):
    return f'<path d="{d}" fill="#fff" stroke="none" opacity="{op:g}"/>'


def ink(d, sw=1.6, op=LINE):
    return f'<path d="{d}" fill="none" stroke-width="{sw:g}" opacity="{op:g}"/>'


def box(x, y, w, h, op=MASS):
    return fil(f"M{x:.1f} {y:.1f}h{w:.1f}v{h:.1f}h{-w:.1f}Z", op)


def disc(cx, cy, r, op=MASS):
    return f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="#fff" stroke="none" opacity="{op:g}"/>'


def ring(cx, cy, r, sw=1.6, op=LINE):
    return (f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" '
            f'stroke-width="{sw:g}" opacity="{op:g}"/>')


def vhatch(x, y, w, h, step, sw=1.2, op=HATCH):
    """Vertical ruling. Reads as glazing on a slab, or as shadow on a wall."""
    out, xi = [], x + step / 2
    while xi < x + w:
        out.append(ink(f"M{xi:.1f} {y:.1f}V{y + h:.1f}", sw, op))
        xi += step
    return out


def hhatch(x, y, w, h, step, sw=1.2, op=HATCH):
    """Horizontal ruling: plaster coursing, or the courses of a stone wall."""
    out, yi = [], y + step / 2
    while yi < y + h:
        out.append(ink(f"M{x:.1f} {yi:.1f}H{x + w:.1f}", sw, op))
        yi += step
    return out


def round_arch(x0, x1, ybase, yspring):
    """Piers to the spring line, then a true semicircular head."""
    r = (x1 - x0) / 2
    return (f"M{x0:.1f} {ybase:.1f}V{yspring:.1f}"
            f"A{r:.1f} {r:.1f} 0 0 1 {x1:.1f} {yspring:.1f}"
            f"V{ybase:.1f}")


def point_arch(x0, x1, ybase, yspring, rise):
    """A two-centre head: the arch of the souq, the mosque and the old houses."""
    cx = (x0 + x1) / 2
    return (f"M{x0:.1f} {ybase:.1f}V{yspring:.1f}"
            f"Q{x0:.1f} {yspring - rise * 0.72:.1f} {cx:.1f} {yspring - rise:.1f}"
            f"Q{x1:.1f} {yspring - rise * 0.72:.1f} {x1:.1f} {yspring:.1f}"
            f"V{ybase:.1f}")


def arcade(x0, x1, ybase, ytop, bays, pier, rise=0, op=MASS):
    """A wall carried on arches: the mass, then every arch struck into it."""
    out = [box(x0, ytop, x1 - x0, ybase - ytop, op)]
    span = ((x1 - x0) - pier * (bays + 1)) / bays
    yspring = ytop + (ybase - ytop) * 0.42
    for i in range(bays):
        ax = x0 + pier * (i + 1) + span * i
        d = (point_arch(ax, ax + span, ybase, yspring, rise) if rise
             else round_arch(ax, ax + span, ybase, yspring))
        out.append(ink(d, 1.5, LINE))
        # the opening itself, shaded so the arcade reads as depth not pattern
        out.append(fil(d + "Z", HATCH * 0.55))
    return out


def dome(cx, base, rx, ry, ribs=7, op=MASS):
    """A dome on its meridians. The ribs are what stop it reading as an egg."""
    out = [fil(f"M{cx - rx:.1f} {base:.1f}"
               f"C{cx - rx:.1f} {base - ry * 0.60:.1f} {cx - rx * 0.74:.1f} {base - ry * 0.94:.1f} {cx:.1f} {base - ry:.1f}"
               f"C{cx + rx * 0.74:.1f} {base - ry * 0.94:.1f} {cx + rx:.1f} {base - ry * 0.60:.1f} {cx + rx:.1f} {base:.1f}Z", op)]
    out.append(ink(f"M{cx - rx:.1f} {base:.1f}"
                   f"C{cx - rx:.1f} {base - ry * 0.60:.1f} {cx - rx * 0.74:.1f} {base - ry * 0.94:.1f} {cx:.1f} {base - ry:.1f}"
                   f"C{cx + rx * 0.74:.1f} {base - ry * 0.94:.1f} {cx + rx:.1f} {base - ry * 0.60:.1f} {cx + rx:.1f} {base:.1f}", 1.7))
    for k in range(1, ribs // 2 + 1):
        f = k / (ribs // 2 + 1)
        for s in (-1, 1):
            x = cx + s * rx * f
            out.append(ink(f"M{x:.1f} {base:.1f}"
                           f"Q{cx + s * rx * f * 1.02:.1f} {base - ry * 0.62:.1f} {cx:.1f} {base - ry:.1f}",
                           1.15, LINE * 0.62))
    out.append(ink(f"M{cx:.1f} {base:.1f}V{base - ry:.1f}", 1.15, LINE * 0.62))
    return out


def sphere(cx, cy, r, lats=5, longs=3, op=MASS):
    """A Kuwait Towers sphere, ruled for the enamel discs that clad it.

    Laid in at partial alpha so the cladding has somewhere to read against; a
    solid disc would swallow it.

    The parallels are drawn as shallow arcs BOWING TOWARD THE VIEWER, not as
    flat chords — that one curve is the whole difference between a ball and a
    disc. Meridians are kept few and faint: crowd them and the sphere turns
    back into an egg, which is exactly what vertical lines do to a circle.
    """
    out = [disc(cx, cy, r, op), ring(cx, cy, r, 2.0)]
    for i in range(1, lats):
        f = -1 + 2 * i / lats
        y = cy + r * f
        rx = r * math.sqrt(max(0.0, 1 - f * f))
        out.append(ink(f"M{cx - rx:.1f} {y:.1f}"
                       f"Q{cx:.1f} {y + r * 0.24:.1f} {cx + rx:.1f} {y:.1f}", 1.2, LINE * 0.6))
    for i in range(longs):
        f = -1 + 2 * (i + 0.5) / longs
        rx = abs(r * f)
        if rx < r * 0.3:
            continue
        out.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{r:.1f}" '
                   f'fill="none" stroke-width="1.0" opacity="{LINE * 0.26:g}"/>')
    return out


def palm(cx, ybase, height, tilt=0.0, fronds=17, op=MASS):
    """A date palm: a tapering trunk scarred by old leaf bases, under a
    fountain of fronds that lift, then fall. Nothing here is a circle."""
    out = []
    top_y = ybase - height
    top_x = cx + tilt
    bw, tw = height * 0.062, height * 0.034
    out.append(fil(f"M{cx - bw:.1f} {ybase:.1f}"
                   f"Q{cx - bw * 0.45 + tilt * 0.4:.1f} {ybase - height * 0.52:.1f} {top_x - tw:.1f} {top_y:.1f}"
                   f"L{top_x + tw:.1f} {top_y:.1f}"
                   f"Q{cx + bw * 0.5 + tilt * 0.4:.1f} {ybase - height * 0.52:.1f} {cx + bw:.1f} {ybase:.1f}Z", op))
    rings = max(3, int(height / 15))
    for i in range(rings):
        t = (i + 0.5) / rings
        y = ybase - height * t
        x = cx + tilt * t * t
        hw = (bw + (tw - bw) * t) * 0.9
        out.append(ink(f"M{x - hw:.1f} {y:.1f}L{x:.1f} {y + height * 0.022:.1f}L{x + hw:.1f} {y:.1f}",
                       1.0, LINE * 0.5))
    for i in range(fronds):
        ang = math.radians(-28 + 236 * i / (fronds - 1))
        L = height * (0.46 + 0.16 * math.sin(i * 2.3))
        dx, dy = math.cos(ang), -math.sin(ang)
        droop = L * (0.30 + 0.34 * abs(dx))
        tx, ty = top_x + dx * L, top_y + dy * L + droop
        mx, my = top_x + dx * L * 0.55, top_y + dy * L * 0.55 - L * 0.12
        nx, ny = -dy, dx
        wm = L * 0.072
        out.append(fil(f"M{top_x:.1f} {top_y:.1f}"
                       f"Q{mx + nx * wm:.1f} {my + ny * wm:.1f} {tx:.1f} {ty:.1f}"
                       f"Q{mx - nx * wm:.1f} {my - ny * wm:.1f} {top_x:.1f} {top_y:.1f}Z", op * 0.95))
        out.append(ink(f"M{top_x:.1f} {top_y:.1f}Q{mx:.1f} {my:.1f} {tx:.1f} {ty:.1f}", 1.0, LINE * 0.55))
    return out


# =================================================================== 1. FAILAKA
def failaka():
    """The Hellenistic temple of Ikaros, standing on the island since Alexander."""
    o = [fil(f"M28 {QUAY}Q96 {QUAY - 22:.0f} 176 {QUAY - 25:.0f}Q252 {QUAY - 28:.0f} 306 {QUAY}Z", MASS * 0.72)]
    o += hhatch(60, QUAY - 18, 210, 16, 7, 0.9, HATCH * 0.5)

    base, cap = QUAY - 24, QUAY - 24 - 96
    for x in (84, 132, 180):                       # three standing columns
        o.append(box(x - 15, base - 7, 30, 7, MASS))          # plinth
        o.append(box(x - 11, cap + 12, 22, base - cap - 19, MASS))   # shaft
        for f in (-6.2, -2.1, 2.1, 6.2):           # fluting
            o.append(ink(f"M{x + f:.1f} {cap + 14:.1f}V{base - 8:.1f}", 1.0, LINE * 0.45))
        o.append(fil(f"M{x - 11:.1f} {cap + 12:.1f}Q{x - 15:.1f} {cap + 5:.1f} {x - 16:.1f} {cap + 4:.1f}"
                     f"H{x + 16:.1f}Q{x + 15:.1f} {cap + 5:.1f} {x + 11:.1f} {cap + 12:.1f}Z", MASS))
        o.append(box(x - 18, cap - 4, 36, 8, MASS))           # abacus
    o.append(box(216, QUAY - 82, 22, 55, MASS))    # the column that snapped
    o.append(ink(f"M216 {QUAY - 82}L222 {QUAY - 88}L238 {QUAY - 84}", 1.4))

    o.append(box(62, cap - 16, 140, 12, MASS))     # architrave
    o.append(box(58, cap - 34, 148, 18, MASS))     # frieze
    for i in range(5):                             # triglyphs
        tx = 66 + i * 33
        o += [ink(f"M{tx + j:.0f} {cap - 31:.0f}V{cap - 19:.0f}", 1.15, LINE * 0.7) for j in (0, 5, 10)]
    o.append(box(54, cap - 44, 156, 10, MASS))     # cornice
    o.append(ink(f"M54 {cap - 44}H210", 1.6))

    o += palm(258, QUAY, 118, tilt=9)
    o += palm(288, QUAY, 86, tilt=-6, fronds=13)
    return o


# ================================================================ 2. MUBARAKIYA
def mubarakiya():
    """The old market: mud-plastered ranges under a wind tower."""
    o = arcade(330, 566, QUAY, QUAY - 66, bays=6, pier=13, rise=13)
    o += hhatch(330, QUAY - 66, 236, 24, 9, 0.9, HATCH * 0.45)
    o.append(box(324, QUAY - 78, 248, 12, MASS))            # roof slab
    o.append(ink(f"M324 {QUAY - 78}H572", 1.7))
    for i in range(11):                                     # stepped parapet
        px = 330 + i * 22
        j = (0, 2, 1, 0, 1, 2, 0, 1, 0, 2, 1)[i]            # hand-set, not stamped
        o.append(box(px, QUAY - 90 - j, 13, 12 + j, MASS))
        o.append(box(px + 3, QUAY - 96 - j, 7, 6, MASS))
    o.append(box(392, QUAY - 104, 108, 8, MASS * 0.8))      # shade over the lane
    o += vhatch(392, QUAY - 104, 108, 8, 9, 0.9, HATCH * 0.6)

    tx, tw = 524, 46                                        # the wind tower
    o.append(box(tx, QUAY - 176, tw, 98, MASS))
    o += hhatch(tx, QUAY - 176, tw, 98, 13, 0.9, HATCH * 0.4)
    for s in (0, tw - 5):                                   # corner pilasters
        o.append(box(tx + s, QUAY - 176, 5, 98, MASS))
    for i in range(3):                                      # the vents it breathed through
        vx = tx + 8 + i * 11
        o.append(ink(point_arch(vx, vx + 8, QUAY - 130, QUAY - 148, 9), 1.2, LINE * 0.8))
    o.append(box(tx - 7, QUAY - 188, tw + 14, 12, MASS))
    o.append(ink(f"M{tx - 7} {QUAY - 188}H{tx + tw + 7}", 1.6))
    for i in range(5):
        o.append(box(tx - 4 + i * 11, QUAY - 198, 7, 10, MASS))
    return o


# ================================================================= 3. AL-SEIF
def seif():
    """The palace on the sea front, and the clock that keeps the city's time."""
    o = arcade(616, 796, QUAY, QUAY - 74, bays=5, pier=12, rise=0)
    o.append(box(610, QUAY - 86, 192, 12, MASS))
    o.append(ink(f"M610 {QUAY - 86}H802", 1.7))
    for i in range(8):
        o.append(box(616 + i * 23, QUAY - 96, 12, 10, MASS))

    cx, x0, tw = 848, 812, 72                               # the clock tower
    o.append(box(x0 - 9, QUAY - 14, tw + 18, 14, MASS))     # plinth
    o.append(box(x0, QUAY - 210, tw, 196, MASS))
    o += hhatch(x0, QUAY - 210, tw, 196, 15, 0.85, HATCH * 0.34)
    for y in (QUAY - 92, QUAY - 150):                       # string courses
        o.append(box(x0 - 5, y, tw + 10, 9, MASS))
        o.append(ink(f"M{x0 - 5} {y}H{x0 + tw + 5}", 1.5))

    o.append(disc(cx, QUAY - 178, 25, MASS * 0.35))         # the clock face
    o.append(ring(cx, QUAY - 178, 25, 2.0))
    o.append(ring(cx, QUAY - 178, 20, 1.0, LINE * 0.5))
    for i in range(12):                                     # the hours
        a = math.radians(i * 30)
        s, c = math.sin(a), -math.cos(a)
        o.append(ink(f"M{cx + s * 20:.1f} {QUAY - 178 + c * 20:.1f}"
                     f"L{cx + s * 16:.1f} {QUAY - 178 + c * 16:.1f}", 1.3, LINE * 0.8))
    o.append(ink(f"M{cx} {QUAY - 178}L{cx + 11} {QUAY - 186}", 1.9))
    o.append(ink(f"M{cx} {QUAY - 178}V{QUAY - 195}", 1.7))

    o.append(box(x0 + 6, QUAY - 246, tw - 12, 36, MASS))    # the belfry
    for i in range(3):
        bx = x0 + 13 + i * 17
        o.append(ink(round_arch(bx, bx + 12, QUAY - 214, QUAY - 232), 1.2, LINE * 0.85))
    o.append(box(x0 - 2, QUAY - 258, tw + 4, 12, MASS))
    o.append(ink(f"M{x0 - 2} {QUAY - 258}H{x0 + tw + 2}", 1.6))

    o += dome(cx, QUAY - 258, 34, 56)                       # the tiled dome
    o.append(box(cx - 7, QUAY - 328, 14, 16, MASS))         # lantern
    o.append(ink(f"M{cx} {QUAY - 344}V{QUAY - 328}", 2.0))
    o.append(disc(cx, QUAY - 348, 5, MASS))
    o.append(ring(cx, QUAY - 348, 5, 1.4))
    return o


# ============================================================ 4. GRAND MOSQUE
def mosque():
    """Al-Masjid Al-Kabir: the great dome over the hall, and the minaret."""
    o = arcade(902, 1178, QUAY, QUAY - 88, bays=7, pier=14, rise=16)
    o.append(box(896, QUAY - 100, 288, 12, MASS))
    o.append(ink(f"M896 {QUAY - 100}H1184", 1.7))
    for i in range(13):
        o.append(box(902 + i * 22, QUAY - 110, 12, 10, MASS))

    cx = 1040
    o += dome(960, QUAY - 100, 40, 50, ribs=5, op=MASS)     # the half domes
    o += dome(1120, QUAY - 100, 40, 50, ribs=5, op=MASS)

    o.append(box(cx - 58, QUAY - 138, 116, 38, MASS))       # the drum
    o += hhatch(cx - 58, QUAY - 138, 116, 38, 12, 0.85, HATCH * 0.35)
    for i in range(5):                                      # its windows
        wx = cx - 46 + i * 23
        o.append(ink(point_arch(wx, wx + 13, QUAY - 106, QUAY - 124, 10), 1.2, LINE * 0.8))
    o.append(box(cx - 64, QUAY - 150, 128, 12, MASS))
    o.append(ink(f"M{cx - 64} {QUAY - 150}H{cx + 64}", 1.7))

    o += dome(cx, QUAY - 150, 60, 96, ribs=9)               # the great dome
    o.append(box(cx - 8, QUAY - 268, 16, 22, MASS))
    o.append(ink(f"M{cx} {QUAY - 286}V{QUAY - 268}", 2.0))
    o.append(f'<path d="M{cx} {QUAY - 300}m-11 0a11 11 0 1 0 22 0a11 11 0 1 0-22 0'
             f'M{cx + 5} {QUAY - 303}m-8.5 0a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0Z" '
             f'fill="#fff" fill-rule="evenodd" stroke="none" opacity="{LINE:g}"/>')

    mx = 1216                                               # the minaret
    o.append(box(mx - 26, QUAY - 78, 52, 78, MASS))
    o.append(box(mx - 21, QUAY - 228, 42, 150, MASS))
    o += hhatch(mx - 21, QUAY - 228, 42, 150, 14, 0.85, HATCH * 0.34)
    for y in (QUAY - 150, QUAY - 228):                      # corbelled balconies
        o.append(box(mx - 29, y, 58, 11, MASS))
        o.append(ink(f"M{mx - 29} {y}H{mx + 29}", 1.5))
        for i in range(6):
            o.append(ink(f"M{mx - 25 + i * 10:.0f} {y + 11:.0f}l4 6", 1.0, LINE * 0.5))
    o.append(box(mx - 15, QUAY - 300, 30, 72, MASS))
    o += vhatch(mx - 15, QUAY - 300, 30, 72, 9, 0.9, HATCH * 0.5)
    o.append(box(mx - 20, QUAY - 312, 40, 12, MASS))
    o += dome(mx, QUAY - 312, 20, 30, ribs=5)
    o.append(ink(f"M{mx} {QUAY - 366}V{QUAY - 342}", 1.9))
    o.append(disc(mx, QUAY - 370, 4.5, MASS))
    return o


# =========================================================== 5. KUWAIT TOWERS
def towers():
    """Three spires on the Ras Ajuza headland.

    Proportion is the whole battle here: the main tower is 187m and its big
    sphere is 36m across, so the sphere is a FIFTH of the height, not a third.
    Draw it any fatter and the tower turns into a lollipop.
    """
    o = [box(1256, QUAY - 18, 246, 18, MASS)]
    o += hhatch(1256, QUAY - 18, 246, 18, 7, 0.9, HATCH * 0.5)

    def shaft(bx, base_w, tip_y, tip_w, y0, y1, op=MASS, outline=True):
        """One slice of a tower, between two heights.

        The shaft is cut into slices so it can stop at a sphere and start again
        above it. Alpha only ever adds in a mask, so running the shaft behind a
        sphere would print a bar straight down through it.
        """
        hw, tw = base_w / 2, tip_w / 2
        span = QUAY - tip_y

        def half(y):                      # the taper, sampled off its own curve
            t = min(max((QUAY - y) / span, 0.0), 1.0)
            return hw * (1 - t) ** 2 + hw * 0.46 * 2 * (1 - t) * t + tw * t * t

        n = 16
        pts = [(y0 + (y1 - y0) * i / n) for i in range(n + 1)]
        left = "L".join(f"{bx - half(y):.1f} {y:.1f}" for y in pts)
        right = "L".join(f"{bx + half(y):.1f} {y:.1f}" for y in reversed(pts))
        out = [fil(f"M{left}L{right}Z", op)]
        if outline:
            out.append(ink(f"M{left}", 1.3))
            out.append(ink(f"M{right}", 1.3))
        return out

    # main tower: 187m, spheres at 40% and 66% of the height
    mb, mt = 1314, 50
    s1y, s1r = QUAY - 137, 35
    s2y, s2r = QUAY - 226, 18
    o += shaft(mb, 52, mt, 8, QUAY, s1y + s1r)
    o += shaft(mb, 52, mt, 8, s1y - s1r, s2y + s2r)
    o += shaft(mb, 52, mt, 8, s2y - s2r, mt)
    o += sphere(mb, s1y, s1r, lats=5, longs=7)
    o += sphere(mb, s2y, s2r, lats=3, longs=5)

    # second tower: 147m, the water reservoir at a little over half
    tb, tt = 1400, 126
    t1y, t1r = QUAY - 148, 25
    o += shaft(tb, 38, tt, 7, QUAY, t1y + t1r)
    o += shaft(tb, 38, tt, 7, t1y - t1r, tt)
    o += sphere(tb, t1y, t1r, lats=4, longs=6)

    # third tower: 113m, plain concrete, carrying the floodlights
    o += shaft(1464, 28, 188, 6, QUAY, 188)
    for y in (224, 258, 292):
        o.append(ink(f"M1457 {y}H1471", 1.2, LINE * 0.55))
    return o


# ============================================================ 6. OPERA HOUSE
def opera():
    """Sheikh Jaber Al-Ahmad Cultural Centre: shell roofs on radiating ribs."""
    o = [box(1536, QUAY - 46, 324, 46, MASS * 0.8)]
    o += vhatch(1536, QUAY - 46, 324, 34, 13, 1.0, HATCH * 0.8)   # the glazing
    o.append(ink(f"M1536 {QUAY - 28}H1860", 1.3, LINE * 0.6))     # transom
    o.append(box(1536, QUAY - 52, 324, 6, MASS))
    o.append(ink(f"M1536 {QUAY - 52}H1860", 1.7))

    def shell(cx, half, rise):
        """One roof: a broad, low shell on radiating ribs.

        The roofs are wide rather than tall, and the shoulders carry almost to
        the springing before they turn. Let the curve stand up and it stops
        being architecture and starts being an egg.
        """
        b = QUAY - 52
        top = b - rise
        arc = (f"M{cx - half:.1f} {b:.1f}"
               f"C{cx - half:.1f} {b - rise * 0.82:.1f} {cx - half * 0.42:.1f} {top:.1f} {cx:.1f} {top:.1f}"
               f"C{cx + half * 0.42:.1f} {top:.1f} {cx + half:.1f} {b - rise * 0.82:.1f} {cx + half:.1f} {b:.1f}")
        out = [fil(arc + "Z", MASS), ink(arc, 1.8)]
        for k in (-3, -2, -1, 1, 2, 3):
            f = k / 4
            out.append(ink(f"M{cx + half * f:.1f} {b:.1f}"
                           f"Q{cx + half * f * 1.02:.1f} {b - rise * 0.66:.1f} {cx:.1f} {top:.1f}",
                           1.1, LINE * 0.5))
        out.append(ink(f"M{cx:.1f} {b:.1f}V{top:.1f}", 1.1, LINE * 0.5))
        return out

    o += shell(1596, 54, 46)
    o += shell(1704, 56, 70)
    o += shell(1812, 48, 42)
    return o


# =========================================================== 7. TAREQ RAJAB
def tareq_rajab():
    """A Kuwaiti courtyard house: thick plaster, a studded Najdi door, and
    the stepped parapet those houses were crowned with."""
    x0, x1 = 1884, 2076
    o = [box(x0, QUAY - 96, x1 - x0, 96, MASS)]
    o += hhatch(x0, QUAY - 96, x1 - x0, 96, 13, 0.85, HATCH * 0.32)
    o.append(ink(f"M{x0} {QUAY - 96}H{x1}", 1.7))

    dx = 1962                                               # the door
    o.append(ink(point_arch(dx, dx + 38, QUAY, QUAY - 40, 22), 1.7))
    o.append(fil(point_arch(dx, dx + 38, QUAY, QUAY - 40, 22) + "Z", HATCH * 0.8))
    o.append(ink(f"M{dx + 19} {QUAY}V{QUAY - 55}", 1.2, LINE * 0.6))
    for i in range(4):                                      # the studs
        for s in (dx + 9, dx + 29):
            o.append(disc(s, QUAY - 13 - i * 11, 2.1, LINE * 0.75))

    for wx in (1908, 2026):                                 # shuttered windows
        o.append(box(wx, QUAY - 72, 30, 30, HATCH * 0.9))
        o.append(ink(f"M{wx} {QUAY - 72}h30v30h-30Z", 1.4))
        o += vhatch(wx, QUAY - 72, 30, 30, 7, 0.9, LINE * 0.45)
        o += hhatch(wx, QUAY - 72, 30, 30, 7, 0.9, LINE * 0.45)

    for i in range(9):                                      # stepped merlons
        px = x0 + 4 + i * 21
        j = (1, 0, 2, 0, 1, 2, 0, 1, 0)[i]
        o.append(box(px, QUAY - 108 - j, 14, 12 + j, MASS))
        o.append(box(px + 4, QUAY - 116 - j, 6, 8, MASS))
    o.append(box(2018, QUAY - 146, 44, 38, MASS))           # the roof room
    o += hhatch(2018, QUAY - 146, 44, 38, 11, 0.85, HATCH * 0.4)
    for i in range(4):
        o.append(box(2020 + i * 11, QUAY - 156, 7, 10, MASS))
    return o


# =========================================================== 8. AL SHAHEED PARK
def shaheed():
    """The park: a palm grove over rising ground, and the memorial arch."""
    o = [fil(f"M2096 {QUAY}Q2170 {QUAY - 28:.0f} 2250 {QUAY - 30:.0f}"
             f"Q2326 {QUAY - 32:.0f} 2384 {QUAY}Z", MASS * 0.7)]
    o += hhatch(2130, QUAY - 22, 226, 20, 8, 0.9, HATCH * 0.45)

    ax0, ax1, ab = 2200, 2286, QUAY - 26                    # the memorial
    mid = (ax0 + ax1) / 2
    o.append(box(ax0 - 10, ab - 8, (ax1 - ax0) + 20, 10, MASS))          # plinth
    o.append(ink(f"M{ax0 - 10} {ab - 8}H{ax1 + 10}", 1.5))
    o.append(fil(f"M{ax0} {ab - 8}V{ab - 56}"
                 f"Q{mid:.0f} {ab - 116} {ax1} {ab - 56}V{ab - 8}"
                 f"H{ax1 - 16}V{ab - 50}"
                 f"Q{mid:.0f} {ab - 96} {ax0 + 16} {ab - 50}V{ab - 8}Z", MASS))
    o.append(ink(f"M{ax0} {ab - 8}V{ab - 56}Q{mid:.0f} {ab - 116} {ax1} {ab - 56}V{ab - 8}", 1.8))
    o.append(ink(f"M{ax0 + 16} {ab - 8}V{ab - 50}Q{mid:.0f} {ab - 96} {ax1 - 16} {ab - 50}V{ab - 8}", 1.4))
    o += hhatch(ax0 + 1, ab - 52, 15, 44, 9, 0.85, HATCH * 0.55)
    o += hhatch(ax1 - 16, ab - 52, 15, 44, 9, 0.85, HATCH * 0.55)

    o += palm(2140, QUAY - 22, 104, tilt=-7)
    o += palm(2170, QUAY - 26, 74, tilt=5, fronds=13)
    o += palm(2302, QUAY - 30, 116, tilt=8)
    o += palm(2336, QUAY - 22, 82, tilt=-5, fronds=13)
    return o


# =================================================== the city behind it all
def backdrop():
    """The modern city, held right back. Without it the monuments float as
    eight separate objects; with it they stand in a place."""
    o, x = [], -70
    while x < W + 40:
        w = random.choice((34, 44, 52, 62, 74))
        h = random.randint(96, 196)
        top = QUAY - h
        o.append(box(x, top, w, h, FAR))
        o.append(ink(f"M{x:.0f} {top:.0f}h{w:.0f}", 1.2, FAR * 1.5))

        # Every tower gets its own crown. A row of identical flat-topped boxes
        # is the thing that gives a drawn skyline away as filler.
        crown = random.random()
        if crown < 0.22:                                    # a setback stage
            sw, sh = w * 0.62, random.randint(26, 58)
            o.append(box(x + (w - sw) / 2, top - sh, sw, sh, FAR))
            o.append(ink(f"M{x + (w - sw) / 2:.0f} {top - sh:.0f}h{sw:.0f}", 1.1, FAR * 1.5))
        elif crown < 0.40:                                  # stepped back twice
            for k, (fw, fh) in enumerate(((0.70, 30), (0.44, 24))):
                sw = w * fw
                top -= fh
                o.append(box(x + (w - sw) / 2, top, sw, fh, FAR))
        elif crown < 0.54:                                  # a pitched cap
            o.append(fil(f"M{x:.0f} {top:.0f}L{x + w / 2:.0f} {top - 26:.0f}"
                         f"L{x + w:.0f} {top:.0f}Z", FAR))
            top -= 26
        elif crown < 0.66:                                  # a mast
            o.append(ink(f"M{x + w / 2:.0f} {top:.0f}v{-random.randint(30, 66)}", 1.4, FAR * 1.6))

        for gy in range(int(QUAY) - 18, int(QUAY - h) + 10, -16):   # lit floors
            o.append(ink(f"M{x + 5:.0f} {gy}H{x + w - 5:.0f}", 1.0, FAR * 0.85))
        x += w + random.choice((8, 14, 22, 30))
    return o


def water():
    """The bay in the foreground, ruled the way an etcher rules water: broken
    lines, thinning as they run toward you.

    The quay runs the full width first. Without it the city sat as an island in
    the middle of the frame with cream either side; the corniche is what carries
    the horizon off both edges of the page.
    """
    o = [box(0, QUAY - 7, W, 7, MASS * 0.34)]
    for x in range(0, W, 26):                       # steps down to the water
        o.append(ink(f"M{x} {QUAY - 7}V{QUAY}", 1.0, HATCH * 0.5))
    o.append(ink(f"M0 {QUAY}H{W}", 2.0, LINE * 0.85))

    # The bay taking the city back. Vertical strokes fall directly under each
    # mass, broken and fading as they run toward the viewer; the ripple lines
    # then cross them. Reflection is what makes a waterfront read as water
    # rather than as an empty band under the drawing.
    for x0, x1, strength in SPANS:
        x = x0
        while x < x1:
            depth = (H - QUAY) * random.uniform(0.35, 0.95)
            y = QUAY + 3
            while y < QUAY + depth:
                seg = random.uniform(4, 11)
                t = (y - QUAY) / (H - QUAY)
                op = LINE * 0.30 * strength * (1 - t) ** 1.6
                if op > 0.012:
                    o.append(ink(f"M{x:.1f} {y:.1f}v{seg:.1f}", 1.1, op))
                y += seg + random.uniform(3.5, 9)
            x += random.uniform(7, 13)

    y = QUAY + 7
    while y < H - 2:
        t = (y - QUAY) / (H - QUAY)
        op = LINE * 0.30 * (1 - t) ** 1.5
        x = random.randint(-40, 30)
        while x < W:
            seg = random.randint(40, 230)
            o.append(ink(f"M{x} {y:.0f}h{min(seg, W - x)}", 1.15, op))
            x += seg + random.randint(30, 150)
        y += 6.5
    return o


# ----------------------------------------------------------------- assemble
#
# AERIAL PERSPECTIVE. The eye is standing opposite the Towers and the Mosque,
# so those carry full weight and everything falls away toward the edges of the
# plate. Drawing all eight at one strength is what made the first version read
# as eight objects in a row rather than one view; a quarter of a stop between
# neighbours is enough to give the panorama a centre and a pair of wings.
#
# The same number sets how hard each mass comes back off the water.
#            name            x0    x1    tone
PLATE = (("failaka",         28,  306, 0.80),
         ("mubarakiya",     324,  592, 0.88),
         ("seif",           604,  884, 0.95),
         ("grand-mosque",   896, 1240, 1.00),
         ("kuwait-towers", 1256, 1502, 1.00),
         ("opera-house",   1536, 1860, 0.95),
         ("tareq-rajab",   1876, 2080, 0.88),
         ("shaheed-park",  2096, 2384, 0.80))

SPANS = tuple((x0, x1, tone) for _, x0, x1, tone in PLATE)


def build():
    draw = dict(failaka=failaka, mubarakiya=mubarakiya, seif=seif, mosque=mosque,
                towers=towers, opera=opera, tareq_rajab=tareq_rajab, shaheed=shaheed)
    fn_for = {"failaka": "failaka", "mubarakiya": "mubarakiya", "seif": "seif",
              "grand-mosque": "mosque", "kuwait-towers": "towers",
              "opera-house": "opera", "tareq-rajab": "tareq_rajab",
              "shaheed-park": "shaheed"}

    parts = ['<g id="backdrop">' + "".join(backdrop()) + "</g>"]
    for name, _x0, _x1, tone in PLATE:
        body = "".join(draw[fn_for[name]]())
        parts.append(f'<g id="{name}" opacity="{tone:g}">{body}</g>')
    parts.append('<g id="bay">' + "".join(water()) + "</g>")

    # NOTE: XML forbids a double hyphen inside a comment, so the rules below are
    # set with "=" and every landmark is named without one.
    head = (
        "<!--\n"
        "  ===========================================================================\n"
        "  THE KUWAIT PANORAMA\n"
        "  ===========================================================================\n"
        "  Eight landmarks across the bay, drawn for this site: Failaka Island,\n"
        "  Souq Al-Mubarakiya, Al-Seif Palace, the Grand Mosque, Kuwait Towers, the\n"
        "  Opera House, the Tareq Rajab Museum and Al Shaheed Park.\n"
        "\n"
        "  GENERATED FILE. Do not hand edit: change scripts/draw-skyline.py and run\n"
        "      python3 scripts/draw-skyline.py\n"
        "\n"
        "  Used as a CSS mask (see .skyline in src/input.css), never as a picture, so\n"
        "  nothing here carries colour. Only alpha reaches the page: masses are laid\n"
        "  in at partial alpha and the linework goes over them at full, which is how\n"
        "  the drawing gets its tone. The gradient that fills it all is CSS.\n"
        "  ===========================================================================\n"
        "-->"
    )
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
            f'fill="#fff" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">'
            f"{head}{''.join(parts)}</svg>\n")


if __name__ == "__main__":
    out = Path(__file__).resolve().parent.parent / "assets" / "img" / "kuwait-skyline.svg"
    out.write_text(build(), encoding="utf-8")
    print(f"wrote {out.relative_to(out.parents[2])}  ({out.stat().st_size / 1024:.1f} KB)")
