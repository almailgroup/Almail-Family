/* =============================================================================
   site.js — shared behaviour for every page
   -----------------------------------------------------------------------------
   Vanilla JS, no dependencies, no build step. Loaded with `defer` on all pages.

   Contents
     1. Theme (light / inverted dark — still strictly monochrome)
     2. Mobile menu
     3. Active navigation state
     4. Reveal-on-scroll
     5. Footer year
     6. ALMAIL.utils — small helpers shared by the page-specific scripts
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
     4. Reveal-on-scroll
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
     5. Footer year
     ------------------------------------------------------------------------ */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------------------------
     6. Shared helpers
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
     7. ALMAIL.lightbox — the full-screen media viewer
     -----------------------------------------------------------------------------
     A photograph's particulars — when it was taken, what may be done with it —
     belong with the photograph at full size, not set as a caption underneath it
     where they crowd the page. Open the plate and the details come with it.

     Built once on first use and kept, so opening is instant afterwards. The
     ground is dark in both editions: that is what a viewer is for, and the
     page behind it should recede.

         ALMAIL.lightbox.open({ src, alt, title, meta: [...], returnFocus: el })
     ------------------------------------------------------------------------ */
  ALMAIL.lightbox = (function () {
    var overlay, imgEl, titleEl, metaEl, closeBtn;
    var lastFocus = null;
    var scrollbarPad = "";

    function t(key, fallback) {
      return ALMAIL.i18n ? ALMAIL.i18n.t(key, fallback) : fallback;
    }

    function build() {
      overlay = document.createElement("div");
      // Visibility is the `hidden` ATTRIBUTE alone — Tailwind's base makes that
      // display:none !important, so it beats the flex below with no class
      // juggling to fall out of step.
      overlay.className =
        "fixed inset-0 z-[200] flex flex-col bg-black/92 backdrop-blur-sm";
      overlay.hidden = true;
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.innerHTML =
        '<div class="flex justify-end p-4 sm:p-5">' +
          '<button type="button" data-lb-close ' +
            'class="flex h-11 w-11 items-center justify-center border border-white/25 ' +
                   'text-white/80 transition-colors hover:border-white hover:text-white">' +
            '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                 'stroke-width="1.5" stroke-linecap="round" aria-hidden="true">' +
              '<path d="M5.5 5.5l13 13M18.5 5.5l-13 13"></path></svg>' +
          "</button>" +
        "</div>" +
        '<div class="flex min-h-0 flex-1 items-center justify-center px-4 sm:px-8" data-lb-stage>' +
          '<img data-lb-img alt="" class="max-h-full max-w-full object-contain">' +
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

      closeBtn.addEventListener("click", close);
      // Clicking the ground closes; clicking the photograph itself does not.
      overlay.addEventListener("click", function (e) {
        if (e.target === overlay || e.target.hasAttribute("data-lb-stage")) close();
      });
      // The only focusable thing inside is the close button, so the trap is
      // simply: never let Tab leave it.
      overlay.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { close(); return; }
        if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); }
      });
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
      if (!opts || !opts.src) return;
      if (!overlay) build();

      // Where focus goes when the viewer closes. Taken from the caller rather
      // than from document.activeElement: a viewer opened from anything but a
      // real mouse click (a keyboard shortcut, a script) would otherwise send
      // focus back to <body> and lose the reader's place.
      lastFocus = opts.returnFocus || document.activeElement;
      imgEl.src = opts.src;
      imgEl.alt = opts.alt || "";
      titleEl.textContent = opts.title || "";
      titleEl.hidden = !opts.title;

      var meta = (opts.meta || []).filter(Boolean);
      metaEl.textContent = meta.join("  ·  ");
      metaEl.hidden = !meta.length;

      closeBtn.setAttribute("aria-label", t("media.close", "Close"));
      overlay.setAttribute("aria-label", opts.title || t("media.viewer", "Photograph"));

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
