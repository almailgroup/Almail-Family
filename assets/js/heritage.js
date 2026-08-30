/* =============================================================================
   heritage.js — renders the family timeline from content/timeline.js
   -----------------------------------------------------------------------------
   A single hairline runs down the page; each entry hangs off it with a small
   square marker. Stacks to a simple left-aligned list on mobile.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;

  function entry(item, index) {
    return (
      '<li class="relative pl-10 sm:pl-0 reveal" data-reveal-delay="' + Math.min(index, 6) * 60 + '">' +
        // Marker sits on the rail
        '<span class="absolute left-0 top-2 h-2.5 w-2.5 -translate-x-[4.5px] border border-ink bg-canvas ' +
        'sm:left-[8.5rem] sm:-translate-x-1/2" aria-hidden="true"></span>' +

        '<div class="sm:grid sm:grid-cols-[7.5rem_1fr] sm:gap-x-12">' +
          '<p class="font-display text-sm font-semibold uppercase tracking-[0.14em] sm:text-right">' +
            u.escape(item.year) +
          "</p>" +
          '<div class="mt-3 sm:mt-0">' +
            '<h3 class="display-3">' + u.escape(item.title) + "</h3>" +
            '<p class="mt-3 max-w-prose text-[15px] leading-relaxed text-ink-2">' +
              u.escape(item.body) +
            "</p>" +
            (item.note
              ? '<p class="meta mt-3 border-l border-line pl-3 italic">' + u.escape(item.note) + "</p>"
              : "") +
          "</div>" +
        "</div>" +
      "</li>"
    );
  }

  function init() {
    var host = document.getElementById("timeline");
    if (!host) return;

    host.innerHTML = (ALMAIL.timeline || []).map(entry).join("");
    u.observeReveal(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
