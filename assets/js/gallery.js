/* =============================================================================
   gallery.js — the pictures archive
   -----------------------------------------------------------------------------
   Reads content/gallery.js and renders into #gallery-grid. Shows an honest
   empty state while the family's photographs are still being digitised.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;

  function figure(item, index) {
    var caption = i18n.field(item, "caption");
    return (
      '<figure class="card card-hover reveal" data-reveal-delay="' + (index % 3) * 70 + '">' +
        '<div class="aspect-[4/3] overflow-hidden border-b border-line bg-surface">' +
          '<img src="' + u.escape(item.src) + '" alt="' + u.escape(caption) + '" loading="lazy" ' +
               'class="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]">' +
        "</div>" +
        '<figcaption class="p-5 sm:p-6">' +
          '<p class="text-[15px] leading-relaxed text-ink"' + i18n.markup(item, "caption") + ">" +
            u.escape(caption) + "</p>" +
          (item.date ? '<p class="meta mt-2">' + u.escape(item.date) + "</p>" : "") +
          (item.credit ? '<p class="meta mt-1">' + u.escape(item.credit) + "</p>" : "") +
        "</figcaption>" +
      "</figure>"
    );
  }

  function init() {
    var grid = document.getElementById("gallery-grid");
    if (!grid) return;
    var empty = document.getElementById("gallery-empty");
    var count = document.getElementById("gallery-count");

    i18n.onChange(function () {
      var items = ALMAIL.gallery || [];
      grid.innerHTML = items.map(figure).join("");
      if (empty) empty.hidden = items.length > 0;
      if (count) count.textContent = items.length ? String(items.length) : "";
      u.observeReveal(grid);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
