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
  var t = i18n.t;

  /* The caption stays on the card: it says what the picture SHOWS, and that is
     the point of a gallery. The date and the credit are the plate's
     particulars, and they travel into the viewer with the picture instead of
     stacking three lines deep under every thumbnail. */
  function figure(item, index) {
    var caption = i18n.field(item, "caption");
    return (
      '<figure class="card card-hover group/pic reveal" data-reveal-delay="' + (index % 3) * 70 + '">' +
        '<button type="button" data-open-pic="' + index + '" ' +
          'class="relative block w-full cursor-zoom-in overflow-hidden border-b border-line bg-surface" ' +
          'aria-label="' + u.escape(t("gallery.view", "View full screen") + " — " + caption) + '">' +
          '<span class="block aspect-[4/3] overflow-hidden">' +
            '<img src="' + u.escape(item.src) + '" alt="' + u.escape(caption) + '" loading="lazy" ' +
                 'class="h-full w-full object-cover transition-transform duration-700 ' +
                        'group-hover/pic:scale-[1.03]">' +
          "</span>" +
          '<span class="absolute bottom-3 end-3 grid h-9 w-9 place-items-center bg-ink/75 ' +
                 'text-invert opacity-0 transition-opacity group-hover/pic:opacity-100 ' +
                 'group-focus-visible/pic:opacity-100" aria-hidden="true">' +
            '<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="11" cy="11" r="7"></circle>' +
              '<path d="M16.5 16.5L21 21M11 8v6M8 11h6"></path></svg>' +
          "</span>" +
        "</button>" +
        '<figcaption class="p-5 sm:p-6">' +
          '<p class="text-[15px] leading-relaxed text-ink"' + i18n.markup(item, "caption") + ">" +
            u.escape(caption) + "</p>" +
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

    /* One listener on the grid rather than one per picture: the grid is
       rebuilt on every language switch, and delegation survives that. */
    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-open-pic]");
      if (!btn || !ALMAIL.lightbox) return;
      var items = ALMAIL.gallery || [];
      ALMAIL.lightbox.open({
        index: parseInt(btn.dataset.openPic, 10) || 0,
        returnFocus: btn,
        group: items.map(function (item) {
          return {
            src: item.src,
            alt: i18n.field(item, "caption"),
            title: i18n.field(item, "caption"),
            // through i18n.field, so dateAr / creditAr are honoured when given
            meta: [i18n.field(item, "date"), i18n.field(item, "credit")],
          };
        }),
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
