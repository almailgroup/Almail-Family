/* =============================================================================
   resources.js — documents and references behind the record
   -----------------------------------------------------------------------------
   Reads content/resources.js and renders into #resource-list, grouped by the
   `group` field in the order the groups first appear.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;

  function entry(item) {
    var title = i18n.field(item, "title");
    var heading = item.href
      ? '<a class="link-underline" href="' + u.escape(item.href) + '">' + u.escape(title) + "</a>"
      : u.escape(title);

    return (
      '<li class="border-t border-line py-6 reveal">' +
        '<h3 class="display-3"' + i18n.markup(item, "title") + ">" + heading + "</h3>" +
        '<p class="mt-2 max-w-prose text-[15px] leading-relaxed text-ink-2"' +
          i18n.markup(item, "detail") + ">" + u.escape(i18n.field(item, "detail")) + "</p>" +
        (item.access
          ? '<p class="meta mt-3"' + i18n.markup(item, "access") + ">" +
            u.escape(i18n.field(item, "access")) + "</p>"
          : "") +
      "</li>"
    );
  }

  function init() {
    var host = document.getElementById("resource-list");
    if (!host) return;
    var empty = document.getElementById("resource-empty");

    i18n.onChange(function () {
      var items = ALMAIL.resources || [];
      // Group in first-appearance order, so the data file controls the order.
      var order = [];
      var groups = {};
      items.forEach(function (item) {
        var key = item.group || "";
        if (!groups[key]) { groups[key] = []; order.push(key); }
        groups[key].push(item);
      });

      host.innerHTML = order.map(function (key) {
        var first = groups[key][0];
        return (
          '<section class="mt-14 first:mt-0">' +
            '<h2 class="eyebrow"' + i18n.markup(first, "group") + ">" +
              u.escape(i18n.field(first, "group")) + "</h2>" +
            '<ul class="mt-5">' + groups[key].map(entry).join("") + "</ul>" +
          "</section>"
        );
      }).join("");

      if (empty) empty.hidden = items.length > 0;
      u.observeReveal(host);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
