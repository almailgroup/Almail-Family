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
  function initActiveNav() {
    var here = location.pathname.split("/").pop() || "index.html";
    // Article pages should light up the Journal link.
    if (here === "post.html") here = "blog.html";

    document.querySelectorAll(".nav-link").forEach(function (link) {
      var target = link.getAttribute("href").split("/").pop().split("?")[0];
      if (target === here) link.setAttribute("aria-current", "page");
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

    /** Re-run the reveal observer over freshly injected markup. */
    observeReveal: initReveal,
  };

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
