/* =============================================================================
   site.js — shared behaviour for every page
   -----------------------------------------------------------------------------
   Vanilla JS, no dependencies, no build step. Loaded with `defer` on all pages.

   Contents
     1. Theme (light / inverted dark — still strictly monochrome)
     2. Mobile menu
     3. Active navigation state
     4. The condensing nameplate
     5. Reveal-on-scroll
     6. Footer year
     7. ALMAIL.utils — small helpers shared by the page-specific scripts
     8. ALMAIL.lightbox — the full-screen media viewer
   ========================================================================== */

(function () {
  "use strict";

  window.ALMAIL = window.ALMAIL || {};

  /* ---------------------------------------------------------------------------
     1. Theme
     The <head> of every page runs a tiny inline snippet that sets
     data-theme before first paint, so there is no flash. This only wires up
     the toggle button and keeps the choice in localStorage.
     ------------------------------------------------------------------------ */
  var THEME_KEY = "almail-theme";

  /* Short helper: i18n.js is loaded before this file, so ALMAIL.i18n exists. */
  function t(key, en) {
    return ALMAIL.i18n ? ALMAIL.i18n.t(key, en) : en;
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* private mode */ }
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.setAttribute("aria-label", theme === "dark"
        ? t("theme.toLight", "Switch to light theme")
        : t("theme.toDark", "Switch to dark theme"));
      // Show the icon for the theme the button switches *to*, matching the label.
      btn.querySelectorAll("[data-theme-icon]").forEach(function (icon) {
        icon.hidden = icon.dataset.themeIcon === theme;
      });
    });
  }

  function initTheme() {
    setTheme(document.documentElement.getAttribute("data-theme") || "light");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme");
        setTheme(current === "dark" ? "light" : "dark");
      });
    });
  }

  /* ---------------------------------------------------------------------------
     2. Mobile menu
     ------------------------------------------------------------------------ */
  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label",
        open ? t("nav.menuClose", "Close menu") : t("nav.menuOpen", "Open menu"));
      // Hamburger ↔ cross
      toggle.querySelectorAll("[data-menu-icon]").forEach(function (icon) {
        icon.hidden = (icon.dataset.menuIcon === "open") !== open;
      });
    }

    function close() { setOpen(false); }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close on navigation, on Escape, and when resized up to the desktop layout.
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768) close();
    });
  }

  /* ---------------------------------------------------------------------------
     3. Active navigation state
     ------------------------------------------------------------------------ */
  /**
   * Reduce a URL to the section it belongs to. Two sections share /blog/ —
   * Article is /blog/?category=Articles and News is /blog/ — so the category
   * is part of the key, and only the one you are actually on gets marked.
   */
  function sectionKey(url) {
    var noHash = String(url).split("#")[0];
    var first = noHash.split("?")[0].replace(/^\/+/, "").split("/")[0] || "home";
    if (first === "post") first = "blog";   // an article belongs under News
    var category = noHash.match(/[?&]category=([^&]*)/);
    return first + (category ? "?category=" + decodeURIComponent(category[1]) : "");
  }

  function initActiveNav() {
    var here = sectionKey(location.pathname + location.search);
    document.querySelectorAll(".nav-link").forEach(function (link) {
      if (sectionKey(link.getAttribute("href")) === here) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------------------------------------------------------------------------
     4. The condensing nameplate
     The mark opens large and the bar comes down to a running head as the
     page scrolls. All this writes is --np-t: 0 at the top of the page, 1
     once condensed. What that moves — the header riding up, the mark
     scaling down — is arithmetic in the stylesheet, and both are transforms,
     so no frame of this costs a layout.

     THE VALUE IS NOT READ STRAIGHT OFF THE SCROLL POSITION. It chases it.

     A mouse wheel does not scroll smoothly — it arrives in notches of about
     100px — so binding size directly to position made the mark fall in three
     visible steps, the largest 19.9px inside one animation frame, with a
     backwards wobble where the browser's own wheel animation overshoots.
     Measured, not guessed. A trackpad hides it; a wheel cannot.

     So each frame moves the value a fraction of the way toward the one the
     scroll position asks for. A notch becomes a glide of a few hundred
     milliseconds, and the mark still ends up wherever the reader stopped.
     The fraction comes from the real elapsed time, so the motion lasts the
     same number of milliseconds at 60Hz and at 120Hz.

     RANGE is short deliberately — see the note in the stylesheet. The bar's
     bottom edge travels across the page while it condenses, so it is made
     to finish above the fold and then hold still for the whole of the rest
     of the page.
     ------------------------------------------------------------------------ */
  var NAMEPLATE_RANGE = 180;   // px of scroll from fully open to fully condensed
  var NAMEPLATE_CHASE = 150;   // ms time constant of the chase

  function initNameplate() {
    var header = document.getElementById("site-header");
    var mark = header && header.querySelector("[data-nameplate] .brand-mark");
    if (!header || !mark) return;

    /* Reduced motion: the nameplate simply stays open. Nothing is written,
       so the stylesheet's --np-t: 0 stands. */
    if (window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var current = 0;      // what is on screen
    var running = false;
    var lastTs = 0;
    var lift = 1;         // px the header rides up when fully condensed

    /* The stylesheet owns the distance and changes it at the breakpoint.
       Read rather than duplicated — but on resize only, never in a frame,
       because asking for a computed style forces a style recalculation. */
    function measure() {
      var v = parseFloat(getComputedStyle(header).getPropertyValue("--np-lift"));
      lift = v > 0 ? v : 1;
    }

    /* Where the scroll position says the nameplate ought to be. Smoothstep,
       for ends that leave and arrive at rest rather than with a corner. */
    function target(y) {
      var p = y / NAMEPLATE_RANGE;
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      return p * p * (3 - 2 * p);
    }

    /* Written on both elements rather than once on an ancestor: --np-t is
       registered as non-inheriting, so this touches these two and nothing
       else. Inherited, it invalidated the whole header subtree every frame. */
    function write(t) {
      var v = Math.round(t * 10000) / 10000;
      header.style.setProperty("--np-t", v);
      mark.style.setProperty("--np-t", v);
    }

    function frame(ts) {
      var dt = lastTs ? ts - lastTs : 16.7;
      lastTs = ts;
      /* A tab that was in the background hands back one enormous dt. Cap it,
         or the mark snaps to its target the moment the tab is looked at. */
      if (dt > 64) dt = 64;

      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var goal = target(y);

      /* The header may never ride up further than the page has scrolled, or
         a band of bare canvas opens between it and the content meant to be
         passing underneath. Ordinary scrolling never comes near this; it is
         for the fling back to the top, where the chase would otherwise still
         be holding the bar up over a page that has already arrived. */
      var ceiling = y / lift;
      if (goal > ceiling) goal = ceiling;

      current += (goal - current) * (1 - Math.exp(-dt / NAMEPLATE_CHASE));
      if (current > ceiling) current = ceiling;

      /* Close enough to be indistinguishable: land exactly and stop, so the
         page is not holding an animation frame open for the rest of the
         reader's visit. */
      if (Math.abs(goal - current) < 0.0004) {
        current = goal;
        write(current);
        running = false;
        lastTs = 0;
        return;
      }

      write(current);
      requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      lastTs = 0;
      requestAnimationFrame(frame);
    }

    window.addEventListener("scroll", start, { passive: true });
    window.addEventListener("resize", function () { measure(); start(); },
                            { passive: true });

    /* A reload restores the scroll position before this runs. Start already
       settled there — the nameplate should not be seen collapsing on load. */
    measure();
    var y0 = window.pageYOffset || document.documentElement.scrollTop || 0;
    current = Math.min(target(y0), y0 / lift);
    write(current);
  }

  /* ---------------------------------------------------------------------------
     5. Reveal-on-scroll
     Elements with class="reveal" fade up once, in document order.
     Add data-reveal-delay="120" (ms) to stagger.
     ------------------------------------------------------------------------ */
  function initReveal(root) {
    var nodes = (root || document).querySelectorAll(".reveal:not(.is-visible)");
    if (!nodes.length) return;

    if (!("IntersectionObserver" in window)) {
      nodes.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var delay = parseInt(entry.target.dataset.revealDelay || "0", 10);
          setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (n) { observer.observe(n); });
  }

  /* ---------------------------------------------------------------------------
     6. Footer year
     ------------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------------------------
     7. Shared helpers
     ------------------------------------------------------------------------ */
  ALMAIL.utils = {
    /** Escape a string for safe insertion into HTML. */
    escape: function (value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    },

    /** "2026-08-14" -> "14 August 2026" / "14 أغسطس 2026" */
    formatDate: function (iso) {
      var d = new Date(iso + "T00:00:00");
      if (isNaN(d)) return iso;
      // -u-nu-latn keeps Western digits in Arabic, as Gulf publications do.
      var locale = ALMAIL.i18n && ALMAIL.i18n.lang === "ar" ? "ar-KW-u-nu-latn" : "en-GB";
      return d.toLocaleDateString(locale, {
        day: "numeric", month: "long", year: "numeric",
      });
    },

    /** Rough reading time from an HTML body. */
    readingTime: function (html) {
      var words = String(html).replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
      return Math.max(1, Math.round(words / 200));
    },

    /** Initials for the monogram placeholders. */
    initials: function (name) {
      return String(name)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(function (w) { return w[0].toUpperCase(); })
        .join("");
    },

    /** Posts, newest first. */
    sortedPosts: function () {
      return (ALMAIL.posts || []).slice().sort(function (a, b) {
        return b.date.localeCompare(a.date);
      });
    },

    /** Read a query-string value. */
    param: function (key) {
      return new URLSearchParams(location.search).get(key);
    },

    /** The last path segment, for pages that live at their own address.
        An article is served from /post/<slug>/ and a person from
        /member/<id>/ — real URLs, each with its own title and its own text
        in the HTML, which is what a crawler and a chat app's link preview
        can read. The older /post/?p=<slug> form still works and still wins
        when both are given, so nothing already shared goes stale.

        `under` is the section directory, so /post/ itself — the bare
        template with no article chosen — correctly yields nothing. */
    slug: function (under) {
      var parts = location.pathname.split("/").filter(Boolean);
      var i = parts.indexOf(under);
      return i >= 0 && parts.length > i + 1 ? decodeURIComponent(parts[i + 1]) : null;
    },

    /** A contact/social icon link, shared by the directory and the profile.
        Icons are drawn inline so the page makes no extra requests;
        `fill: true` marks a solid glyph (brand marks), the rest are stroked. */
    iconLink: (function () {
      var ICONS = {
        email: { d: '<path d="M3 6.5h18v11H3zM3 7l9 6 9-6"></path>' },
        linkedin: { fill: true, d: '<path d="M5 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM3.4 8.9h3.2V20.5H3.4zM9.1 8.9h3.06v1.58h.04c.43-.8 1.48-1.65 3.05-1.65 3.26 0 3.86 2.1 3.86 4.84V20.5h-3.2v-5.2c0-1.24-.02-2.83-1.75-2.83-1.75 0-2.02 1.35-2.02 2.74V20.5H9.1z"></path>' },
        x: { fill: true, d: '<path d="M17.53 3h2.94l-6.42 7.34L21.6 21h-5.9l-4.63-6.05L5.78 21H2.83l6.87-7.85L2.4 3h6.05l4.18 5.53zm-1.03 16.2h1.63L7.6 4.71H5.85z"></path>' },
        instagram: { d: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="0.9"></circle>' },
        website: { d: '<circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5s1.1-6.1 3.3-8.5z"></path>' },
      };
      var LABELS = {
        email: "Email", linkedin: "LinkedIn", x: "X", instagram: "Instagram", website: "Website",
      };
      return function (kind, value, name) {
        var icon = ICONS[kind];
        if (!icon) return "";
        var esc = ALMAIL.utils.escape;
        var label = ALMAIL.i18n.t("link." + kind, LABELS[kind]);
        var href = kind === "email" ? "mailto:" + value : value;
        var paint = icon.fill
          ? 'fill="currentColor"'
          : 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
        return (
          '<a href="' + esc(href) + '" ' +
          'aria-label="' + esc(label + " — " + name) + '" ' +
          'class="flex h-9 w-9 items-center justify-center border border-line-2 transition-colors hover:border-ink hover:bg-ink hover:text-invert">' +
            '<svg class="h-[15px] w-[15px]" viewBox="0 0 24 24" ' + paint + ' aria-hidden="true">' +
            icon.d + "</svg>" +
          "</a>"
        );
      };
    })(),

    /** Re-run the reveal observer over freshly injected markup. */
    observeReveal: initReveal,
  };

  /* ---------------------------------------------------------------------------
     8. ALMAIL.lightbox — the full-screen media viewer
     -----------------------------------------------------------------------------
     A photograph's particulars — when it was taken, what may be done with it —
     belong with the photograph at full size, not set as a caption underneath it
     where they crowd the page. Open the plate and the details come with it.

     Built once on first use and kept, so opening is instant afterwards. The
     ground is dark in both editions: that is what a viewer is for, and the
     page behind it should recede.

     One plate:
         ALMAIL.lightbox.open({ src, alt, title, meta: [...], returnFocus: el })

     A set, which gains arrows, a counter and the arrow keys. `group` is an
     array of the same objects; `index` says which one to open on:
         ALMAIL.lightbox.open({ group: [...], index: 3, returnFocus: el })
     ------------------------------------------------------------------------ */
  ALMAIL.lightbox = (function () {
    var overlay, imgEl, titleEl, metaEl, closeBtn, prevBtn, nextBtn, countEl, navWrap;
    var lastFocus = null;
    var scrollbarPad = "";
    var group = [];
    var at = 0;

    function t(key, fallback) {
      return ALMAIL.i18n ? ALMAIL.i18n.t(key, fallback) : fallback;
    }

    function build() {
      overlay = document.createElement("div");
      /* Named so the stylesheet can reach it: the print rules hide it, and the
         touch rules stop a swipe that runs out of picture from scrolling the
         page underneath. Both are #lightbox, and neither matched anything
         while this was an anonymous div. */
      overlay.id = "lightbox";
      // Visibility is the `hidden` ATTRIBUTE alone — Tailwind's base makes that
      // display:none !important, so it beats the flex below with no class
      // juggling to fall out of step.
      overlay.className =
        "fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-sm";
      overlay.hidden = true;
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML =
        '<div class="flex items-center justify-between gap-4 p-4 sm:p-5">' +
          '<p data-lb-count class="text-[13px] tabular-nums text-white/55"></p>' +
          '<button type="button" data-lb-close ' +
            'class="flex h-11 w-11 items-center justify-center border border-white/25 ' +
                   'text-white/80 transition-colors hover:border-white hover:text-white">' +
            '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                 'stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
              '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"></path></svg>' +
          "</button>" +
        "</div>" +
        '<div class="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-8" data-lb-stage>' +
          '<img data-lb-img alt="" class="max-h-full max-w-full object-contain">' +
          /* Positioned with logical start/end, so in Arabic they mirror and
             "previous" stays on the side the reader came from. */
          '<div data-lb-nav hidden>' +
            '<button type="button" data-lb-prev ' +
              'class="absolute start-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center ' +
                     'border border-white/25 text-white/80 transition-colors ' +
                     'hover:border-white hover:text-white sm:start-4">' +
              '<svg class="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" ' +
                   'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
                   'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M15 5l-7 7 7 7"></path></svg>' +
            "</button>" +
            '<button type="button" data-lb-next ' +
              'class="absolute end-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center ' +
                     'border border-white/25 text-white/80 transition-colors ' +
                     'hover:border-white hover:text-white sm:end-4">' +
              '<svg class="h-5 w-5 rtl:rotate-180" viewBox="0 0 24 24" fill="none" ' +
                   'stroke="currentColor" stroke-width="1.5" stroke-linecap="round" ' +
                   'stroke-linejoin="round" aria-hidden="true">' +
                '<path d="M9 5l7 7-7 7"></path></svg>' +
            "</button>" +
          "</div>" +
        "</div>" +
        '<div class="px-6 py-6 text-center sm:px-8 sm:py-8">' +
          '<p data-lb-title class="font-display text-[15px] font-semibold text-white"></p>' +
          '<p data-lb-meta class="mt-2 text-[13px] leading-relaxed text-white/60"></p>' +
        "</div>";
      document.body.appendChild(overlay);

      imgEl = overlay.querySelector("[data-lb-img]");
      titleEl = overlay.querySelector("[data-lb-title]");
      metaEl = overlay.querySelector("[data-lb-meta]");
      closeBtn = overlay.querySelector("[data-lb-close]");
      prevBtn = overlay.querySelector("[data-lb-prev]");
      nextBtn = overlay.querySelector("[data-lb-next]");
      countEl = overlay.querySelector("[data-lb-count]");
      navWrap = overlay.querySelector("[data-lb-nav]");

      closeBtn.addEventListener("click", close);
      prevBtn.addEventListener("click", function () { step(-1); });
      nextBtn.addEventListener("click", function () { step(1); });
      // Clicking the ground closes; clicking the photograph itself does not.
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.hasAttribute("data-lb-stage")) close();
      });
      // The only focusable thing inside is the close button, so the trap is
      // simply: never let Tab leave it.
      overlay.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { close(); return; }
        if (group.length > 1) {
          // The arrows follow what the reader SEES: in Arabic the next plate
          // sits to the left, so the left arrow advances.
          var rtl = document.documentElement.getAttribute("dir") === "rtl";
          if (e.key === "ArrowRight") { e.preventDefault(); step(rtl ? -1 : 1); return; }
          if (e.key === "ArrowLeft") { e.preventDefault(); step(rtl ? 1 : -1); return; }
        }
        if (e.key === "Tab") {
          // Keep focus inside: cycle across whatever is actually on show.
          var stops = [closeBtn].concat(
            group.length > 1 ? [prevBtn, nextBtn] : []);
          var i = stops.indexOf(document.activeElement);
          e.preventDefault();
          stops[(i + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
        }
      });

      /* Swipe, because on a phone that is how everyone expects to move
         between pictures — the arrows are there, but nobody reaches for a
         44px button when the plate fills the screen.

         Deliberately plain pointer events rather than a gesture library.
         The rules: one finger only (two is a pinch-zoom, which must be left
         alone), mostly sideways rather than up-and-down, and far enough to
         be a swipe rather than a wobble while tapping. The direction is
         mirrored in Arabic for the same reason the arrow keys are — the
         next picture lies to the left when the page runs right to left. */
      var SWIPE_MIN = 45;     // px travelled before it counts
      var SWIPE_SLOPE = 1.2;  // how much more horizontal than vertical
      var startX = 0, startY = 0, tracking = false;

      overlay.addEventListener("pointerdown", function (e) {
        if (!e.isPrimary || group.length < 2) { tracking = false; return; }
        tracking = true;
        startX = e.clientX;
        startY = e.clientY;
      }, { passive: true });

      overlay.addEventListener("pointerup", function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        if (Math.abs(dx) < SWIPE_MIN) return;
        if (Math.abs(dx) < Math.abs(dy) * SWIPE_SLOPE) return;
        var rtl = document.documentElement.getAttribute("dir") === "rtl";
        /* Dragging left pulls the next picture in from the right. */
        step((dx < 0 ? 1 : -1) * (rtl ? -1 : 1));
      }, { passive: true });

      overlay.addEventListener("pointercancel", function () { tracking = false; },
                               { passive: true });
    }

    /** Paint one plate and its particulars. */
    function show(item) {
      imgEl.src = item.src;
      imgEl.alt = item.alt || item.title || "";
      titleEl.textContent = item.title || "";
      titleEl.hidden = !item.title;
      var meta = (item.meta || []).filter(Boolean);
      metaEl.textContent = meta.join("  ·  ");
      metaEl.hidden = !meta.length;
    }

    /** Move within the set, wrapping at either end. */
    function step(by) {
      if (group.length < 2) return;
      at = (at + by + group.length) % group.length;
      show(group[at]);
      countEl.textContent = (at + 1) + " / " + group.length;
    }

    function close() {
      if (!overlay || overlay.hidden) return;
      overlay.hidden = true;
      document.body.style.overflow = "";
      document.body.style.paddingInlineEnd = scrollbarPad;
      if (lastFocus && lastFocus.focus) lastFocus.focus();
      lastFocus = null;
    }

    function open(opts) {
      if (!opts) return;
      // A set, or a single plate treated as a set of one.
      group = (opts.group && opts.group.length) ? opts.group : (opts.src ? [opts] : []);
      if (!group.length) return;
      at = Math.min(Math.max(opts.index || 0, 0), group.length - 1);

      if (!overlay) build();

      // Where focus goes when the viewer closes. Taken from the caller rather
      // than from document.activeElement: a viewer opened from anything but a
      // real mouse click (a keyboard shortcut, a script) would otherwise send
      // focus back to <body> and lose the reader's place.
      lastFocus = opts.returnFocus || document.activeElement;

      show(group[at]);

      var many = group.length > 1;
      navWrap.hidden = !many;
      countEl.textContent = many ? (at + 1) + " / " + group.length : "";
      prevBtn.setAttribute("aria-label", t("media.prev", "Previous picture"));
      nextBtn.setAttribute("aria-label", t("media.next", "Next picture"));

      closeBtn.setAttribute("aria-label", t("media.close", "Close"));
      overlay.setAttribute("aria-label",
        group[at].title || t("media.viewer", "Photograph"));

      // Hold the page still behind the viewer, without the width jumping as the
      // scrollbar goes.
      var gap = window.innerWidth - document.documentElement.clientWidth;
      scrollbarPad = document.body.style.paddingInlineEnd || "";
      if (gap > 0) document.body.style.paddingInlineEnd = gap + "px";
      document.body.style.overflow = "hidden";

      overlay.hidden = false;
      closeBtn.focus();
    }

    return { open: open, close: close };
  })();

  /* ------------------------------------------------------------------------ */
  function init() {
    initTheme();
    initMenu();
    initActiveNav();
    initNameplate();
    initReveal();
    initYear();

    // Re-label the icon buttons when the language changes.
    if (ALMAIL.i18n) {
      ALMAIL.i18n.onChange(function () {
        setTheme(document.documentElement.getAttribute("data-theme") || "light");
        var toggle = document.querySelector("[data-menu-toggle]");
        if (toggle) {
          var open = toggle.getAttribute("aria-expanded") === "true";
          toggle.setAttribute("aria-label",
            open ? t("nav.menuClose", "Close menu") : t("nav.menuOpen", "Open menu"));
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
