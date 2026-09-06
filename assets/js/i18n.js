/* =============================================================================
   i18n.js — English ⇄ Arabic
   -----------------------------------------------------------------------------
   English is the source language and lives in the markup. Arabic comes from
   content/i18n.js. Switching to Arabic:

     • replaces the content of every [data-i18n] element,
     • replaces the attributes named in [data-i18n-attr],
     • sets <html lang="ar" dir="rtl"> so the whole layout mirrors,
     • and hands the page scripts Arabic strings through t().

   The original English is cached the first time an element is translated, so
   switching back needs no second dictionary.

   The language is resolved before first paint by the inline snippet in each
   page's <head>; this file only applies it and wires up the toggle.
   ========================================================================== */

(function () {
  "use strict";

  window.ALMAIL = window.ALMAIL || {};

  var KEY = "almail-lang";
  var TABLE = ALMAIL.ar || {};
  var COUNT = ALMAIL.arCount || {};

  var lang = document.documentElement.getAttribute("lang") === "ar" ? "ar" : "en";
  var cache = new WeakMap(); // element -> { html, attrs }

  /* Fill {family}, {year}, {n}, {email} … in a string. */
  function interpolate(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (whole, name) {
      if (vars && name in vars) return vars[name];
      if (name === "family") return TABLE["brand.family"] || "Almail";
      if (name === "year") return new Date().getFullYear();
      return whole;
    });
  }

  /**
   * Translate a key.
   * @param {string} key  key in content/i18n.js
   * @param {string} en   the English text — used as-is when lang is "en"
   * @param {object} vars optional {token: value} pairs
   */
  function t(key, en, vars) {
    if (lang !== "ar") return interpolate(en == null ? key : en, vars);
    var value = TABLE[key];
    return interpolate(value == null ? (en == null ? key : en) : value, vars);
  }

  /**
   * Pick the right variant of a content field.
   * `field(post, "title")` returns post.titleAr in Arabic when it exists, and
   * falls back to post.title otherwise — a half-translated data file still
   * renders, it just shows the English for what has not been translated yet.
   */
  function field(obj, name) {
    if (lang === "ar") {
      var ar = obj[name + "Ar"];
      if (ar != null && ar !== "") return ar;
    }
    return obj[name];
  }

  /** True when field() had to fall back to English — the caller marks it up. */
  function isFallback(obj, name) {
    return lang === "ar" && !obj[name + "Ar"] && obj[name] != null;
  }

  /**
   * lang/dir attributes for a run of text that may not match the page language.
   * Keeps bidi correct when an untranslated English title sits in an RTL page.
   */
  function markup(obj, name) {
    return isFallback(obj, name) ? ' lang="en" dir="ltr"' : "";
  }

  /** Localised count phrase, e.g. "3 posts" / "3 منشورات". */
  function count(kind, n) {
    if (lang === "ar" && COUNT[kind]) return COUNT[kind](n);
    var word = kind === "members" ? "member" : "post";
    return n + " " + word + (n === 1 ? "" : "s");
  }

  /** Reading time. Arabic changes the noun with the number, English does not. */
  function minutes(n) {
    if (lang === "ar" && COUNT.minutes) return COUNT.minutes(n);
    return n + " min read";
  }

  /* ---------------------------------------------------------------------------
     Applying the language to the document
     ------------------------------------------------------------------------ */
  function remember(el) {
    if (cache.has(el)) return cache.get(el);
    var entry = { html: el.innerHTML, attrs: {} };
    var spec = el.getAttribute("data-i18n-attr");
    if (spec) {
      spec.split(";").forEach(function (pair) {
        var attr = pair.split(":")[0].trim();
        if (attr) entry.attrs[attr] = el.getAttribute(attr);
      });
    }
    cache.set(el, entry);
    return entry;
  }

  function apply() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var original = remember(el);
      el.innerHTML = lang === "ar"
        ? t(el.getAttribute("data-i18n"), original.html)
        : original.html;
    });

    // data-i18n-attr="placeholder:directory.searchPh; aria-label:nav.menuOpen"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var original = remember(el);
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var parts = pair.split(":");
        var attr = (parts[0] || "").trim();
        var key = (parts[1] || "").trim();
        if (!attr || !key) return;
        el.setAttribute(attr, lang === "ar" ? t(key, original.attrs[attr]) : original.attrs[attr]);
      });
    });

    // <option> labels inside a translated <select> are elements too, so they
    // are covered above. Titles and descriptions are not.
    var title = document.querySelector("[data-i18n-title]");
    if (title) document.title = t(title.getAttribute("data-i18n-title"), document.title);

    document.documentElement.removeAttribute("data-i18n-pending");
  }

  /* Swap language, update the URL, and re-render anything script-generated. */
  function setLang(next) {
    lang = next === "ar" ? "ar" : "en";
    ALMAIL.i18n.lang = lang;

    var root = document.documentElement;
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }

    // Keep the URL shareable in the chosen language.
    var url = new URL(location.href);
    if (lang === "en") url.searchParams.delete("lang");
    else url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);

    apply();
    updateToggles();

    // Tell the page renderers to redraw with the new language.
    document.dispatchEvent(new CustomEvent("almail:langchange", { detail: { lang: lang } }));
  }

  function updateToggles() {
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      var target = lang === "ar" ? "en" : "ar";
      btn.setAttribute("lang", target);
      // Full name where there is room; a compact one in the narrow masthead.
      btn.innerHTML =
        '<span class="sm:hidden">' + (target === "ar" ? "ع" : "EN") + "</span>" +
        '<span class="hidden sm:inline">' + (target === "ar" ? "العربية" : "English") + "</span>";
      btn.setAttribute("aria-label", t("lang.switch", "Switch language"));
      btn.setAttribute("data-target-lang", target);
    });
  }

  function init() {
    apply();
    updateToggles();
    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-target-lang") || (lang === "ar" ? "en" : "ar"));
      });
    });
  }

  ALMAIL.i18n = {
    get lang() { return lang; },
    set lang(v) { lang = v; },
    t: t,
    field: field,
    isFallback: isFallback,
    markup: markup,
    count: count,
    minutes: minutes,
    setLang: setLang,
    /** Run `fn` now and again whenever the language changes. */
    onChange: function (fn) {
      fn(lang);
      document.addEventListener("almail:langchange", function () { fn(lang); });
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
