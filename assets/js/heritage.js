/* =============================================================================
   heritage.js — renders the family timeline from content/timeline.js
   -----------------------------------------------------------------------------
   A single hairline runs down the page; each entry hangs off it with a small
   square marker. Stacks to a simple list on mobile, and mirrors in Arabic.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;

  function entry(item, index) {
    return (
      '<li class="relative ps-10 sm:ps-0 reveal" data-reveal-delay="' + Math.min(index, 6) * 60 + '">' +
        // Marker sits on the rail
        '<span class="absolute start-0 top-2 h-2.5 w-2.5 -translate-x-[4.5px] rtl:translate-x-[4.5px] ' +
        'border border-ink bg-canvas sm:start-[8.5rem] sm:-translate-x-1/2 sm:rtl:translate-x-1/2" ' +
        'aria-hidden="true"></span>' +

        '<div class="sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-x-12">' +
          '<p class="font-display text-sm font-semibold uppercase tracking-[0.14em] sm:text-end">' +
            u.escape(i18n.field(item, "year")) +
          "</p>" +
          '<div class="mt-3 sm:mt-0">' +
            '<h3 class="display-3"' + i18n.markup(item, "title") + ">" +
              u.escape(i18n.field(item, "title")) + "</h3>" +
            '<p class="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-2"' +
              i18n.markup(item, "body") + ">" + u.escape(i18n.field(item, "body")) +
            "</p>" +
            (item.note
              ? '<p class="meta mt-3 border-s border-line ps-3 italic"' + i18n.markup(item, "note") + ">" +
                u.escape(i18n.field(item, "note")) + "</p>"
              : "") +
          "</div>" +
        "</div>" +
      "</li>"
    );
  }

  function init() {
    var host = document.getElementById("timeline");
    if (!host) return;

    i18n.onChange(function () {
      host.innerHTML = (ALMAIL.timeline || []).map(entry).join("");
      u.observeReveal(host);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
