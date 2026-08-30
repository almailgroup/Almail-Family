/* =============================================================================
   directory.js — family directory grid, branch filter and search
   -----------------------------------------------------------------------------
   Reads content/members.js and renders into #member-grid.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;

  /* Social / contact icons, drawn inline so the page makes no extra requests.
     `fill: true` marks a solid glyph (brand marks); the rest are stroked. */
  var ICONS = {
    email: {
      d: '<path d="M3 6.5h18v11H3zM3 7l9 6 9-6"></path>',
    },
    linkedin: {
      fill: true,
      d: '<path d="M5 3.5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM3.4 8.9h3.2V20.5H3.4zM9.1 8.9h3.06v1.58h.04c.43-.8 1.48-1.65 3.05-1.65 3.26 0 3.86 2.1 3.86 4.84V20.5h-3.2v-5.2c0-1.24-.02-2.83-1.75-2.83-1.75 0-2.02 1.35-2.02 2.74V20.5H9.1z"></path>',
    },
    x: {
      fill: true,
      d: '<path d="M17.53 3h2.94l-6.42 7.34L21.6 21h-5.9l-4.63-6.05L5.78 21H2.83l6.87-7.85L2.4 3h6.05l4.18 5.53zm-1.03 16.2h1.63L7.6 4.71H5.85z"></path>',
    },
    instagram: {
      d: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="0.9"></circle>',
    },
    website: {
      d: '<circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5s1.1-6.1 3.3-8.5z"></path>',
    },
  };

  var LABELS = {
    email: "Email", linkedin: "LinkedIn", x: "X", instagram: "Instagram", website: "Website",
  };

  function iconLink(kind, value, name) {
    var icon = ICONS[kind];
    if (!icon) return "";
    var href = kind === "email" ? "mailto:" + value : value;
    var paint = icon.fill
      ? 'fill="currentColor"'
      : 'fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"';
    return (
      '<a href="' + u.escape(href) + '" ' +
      'aria-label="' + LABELS[kind] + " — " + u.escape(name) + '" ' +
      'class="flex h-9 w-9 items-center justify-center border border-line-2 transition-colors hover:border-ink hover:bg-ink hover:text-invert">' +
        '<svg class="h-[15px] w-[15px]" viewBox="0 0 24 24" ' + paint + ' aria-hidden="true">' +
        icon.d + "</svg>" +
      "</a>"
    );
  }

  /* Portrait: real photo when supplied, otherwise a monogram plate. */
  function portrait(member) {
    if (member.photo) {
      return (
        '<img src="' + u.escape(member.photo) + '" alt="' + u.escape(member.name) + '" loading="lazy" ' +
        'class="h-16 w-16 shrink-0 border border-line object-cover">'
      );
    }
    return (
      '<span class="grid h-16 w-16 shrink-0 place-items-center border border-line bg-surface ' +
      'font-display text-lg font-semibold tracking-tight" aria-hidden="true">' +
        u.initials(member.name) +
      "</span>"
    );
  }

  function card(member, index) {
    var links = member.links || {};
    var linkHtml = Object.keys(links)
      .map(function (k) { return iconLink(k, links[k], member.name); })
      .join("");

    return (
      '<article class="card card-hover flex flex-col p-6 sm:p-7 reveal" data-reveal-delay="' + (index % 3) * 70 + '">' +
        '<div class="flex items-start gap-5">' +
          portrait(member) +
          "<div>" +
            '<h3 class="display-3">' + u.escape(member.name) + "</h3>" +
            '<p class="mt-1 text-[15px] text-ink-2">' + u.escape(member.role) + "</p>" +
            (member.location ? '<p class="meta mt-1">' + u.escape(member.location) + "</p>" : "") +
          "</div>" +
        "</div>" +
        '<p class="mt-6 text-[15px] leading-relaxed text-ink-2">' + u.escape(member.bio) + "</p>" +
        '<div class="mt-auto flex items-center justify-between gap-4 pt-7">' +
          '<span class="tag">' + u.escape(member.branch) + "</span>" +
          (linkHtml ? '<div class="flex gap-2">' + linkHtml + "</div>" : "") +
        "</div>" +
      "</article>"
    );
  }

  function init() {
    var grid = document.getElementById("member-grid");
    if (!grid) return;

    var filterBar = document.getElementById("member-filters");
    var searchInput = document.getElementById("member-search");
    var countEl = document.getElementById("member-count");
    var emptyEl = document.getElementById("member-empty");

    var all = ALMAIL.members || [];
    // Branches are derived from the data — in the order they first appear in
    // content/members.js — so adding one needs no code change here.
    var branches = all.reduce(function (acc, m) {
      if (m.branch && acc.indexOf(m.branch) === -1) acc.push(m.branch);
      return acc;
    }, []);

    var state = { branch: "All", query: "" };

    if (filterBar) {
      filterBar.innerHTML = ["All"].concat(branches).map(function (b) {
        return (
          '<button type="button" class="chip" data-branch="' + u.escape(b) + '" ' +
          'aria-pressed="' + (b === "All") + '">' + u.escape(b) + "</button>"
        );
      }).join("");

      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-branch]");
        if (!btn) return;
        state.branch = btn.dataset.branch;
        filterBar.querySelectorAll("[data-branch]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.branch === state.branch));
        });
        render();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    function matches(m) {
      if (state.branch !== "All" && m.branch !== state.branch) return false;
      if (!state.query) return true;
      return (m.name + " " + m.role + " " + (m.location || "") + " " + m.bio)
        .toLowerCase().indexOf(state.query) !== -1;
    }

    function render() {
      var results = all.filter(matches);
      grid.innerHTML = results.map(card).join("");
      if (countEl) {
        countEl.textContent = results.length + (results.length === 1 ? " member" : " members");
      }
      if (emptyEl) emptyEl.hidden = results.length > 0;
      u.observeReveal(grid);
    }

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
