/* =============================================================================
   tree.js — the family tree
   -----------------------------------------------------------------------------
   Reads the nested object in content/tree.js and renders it as nested lists.
   Nesting is the structure, not a visual trick: a screen reader announces the
   generations as the list levels they are, and it mirrors in Arabic for free
   because the rails use logical properties.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;

  function person(node) {
    var name = i18n.field(node, "name");
    var note = node.note ? i18n.field(node, "note") : "";
    var kids = node.children || [];

    return (
      '<li class="tree-node reveal">' +
        '<div class="tree-person">' +
          '<span class="tree-name"' + i18n.markup(node, "name") + ">" + u.escape(name) + "</span>" +
          (node.years ? '<span class="tree-years">' + u.escape(node.years) + "</span>" : "") +
          (note ? '<span class="tree-note"' + i18n.markup(node, "note") + ">" + u.escape(note) + "</span>" : "") +
        "</div>" +
        (kids.length ? '<ul class="tree-branch">' + kids.map(person).join("") + "</ul>" : "") +
      "</li>"
    );
  }

  function init() {
    var host = document.getElementById("tree-root");
    if (!host) return;
    var empty = document.getElementById("tree-empty");

    i18n.onChange(function () {
      var root = ALMAIL.tree;
      if (!root) { if (empty) empty.hidden = false; return; }
      host.innerHTML = '<ul class="tree">' + person(root) + "</ul>";
      if (empty) empty.hidden = true;
      u.observeReveal(host);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }
})();
