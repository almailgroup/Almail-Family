/* =============================================================================
   directory.js — family directory grid, branch filter and search
   -----------------------------------------------------------------------------
   Reads content/members.js and renders into #member-grid.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;
  var t = i18n.t;

  /* Portrait: real photo when supplied, otherwise a monogram plate.

     The frame is 3:4 — a portrait, the shape a photographer hands you, rather
     than the square a grid would rather have. Photographs are supplied at 3:4,
     so object-cover has nothing to crop and the face arrives whole. The
     monogram takes the same frame, so a card with a photograph and a card
     without still line up. */
  function portrait(member) {
    if (member.photo) {
      return (
        '<img src="' + u.escape(member.photo) + '" alt="' + u.escape(i18n.field(member, "name")) + '" loading="lazy" ' +
        'width="900" height="1200" ' +
        'class="aspect-[3/4] w-full border border-line object-cover">'
      );
    }
    return (
      '<span class="grid aspect-[3/4] w-full place-items-center border border-line bg-surface ' +
      'font-display text-4xl font-semibold tracking-tight" aria-hidden="true">' +
        u.initials(member.name) +
      "</span>"
    );
  }

  /* The whole card opens the profile.

     Done with a "stretched link": the name is the real anchor and its ::after
     covers the card. Wrapping the <article> in an <a> instead would nest the
     contact icons inside it, which is invalid HTML and makes them unreachable
     — so those are lifted back above the overlay with relative z-10. */
  function card(member, index) {
    var links = member.links || {};
    var linkHtml = Object.keys(links)
      .map(function (k) { return u.iconLink(k, links[k], member.name); })
      .join("");
    var href = "/member/" + encodeURIComponent(member.id) + "/";

    return (
      '<article class="card card-hover group flex flex-col p-6 sm:p-7 reveal" data-reveal-delay="' + (index % 3) * 70 + '">' +
        /* The portrait leads, full card width. It is the thing a reader
           recognises first; beside a column of text it was furniture. */
        portrait(member) +
        '<div class="mt-6">' +
          '<h3 class="display-3"' + i18n.markup(member, "name") + ">" +
            '<a href="' + href + '" class="after:absolute after:inset-0 ' +
              'group-hover:text-accent transition-colors">' +
              u.escape(i18n.field(member, "name")) +
            "</a></h3>" +
          '<p class="mt-2 text-[15px] text-ink-2"' + i18n.markup(member, "role") + ">" +
            u.escape(i18n.field(member, "role")) + "</p>" +
          (member.years
            ? '<p class="meta mt-1">' + u.escape(member.years) + "</p>"
            : member.location
              ? '<p class="meta mt-1"' + i18n.markup(member, "location") + ">" +
                u.escape(i18n.field(member, "location")) + "</p>"
              : "") +
        "</div>" +
        '<p class="mt-6 text-[15px] leading-relaxed text-ink-2"' + i18n.markup(member, "bio") + ">" +
          u.escape(i18n.field(member, "bio")) + "</p>" +
        '<div class="mt-auto flex items-center justify-between gap-4 pt-7">' +
          '<span class="tag">' + u.escape(i18n.field(member, "branch")) + "</span>" +
          (linkHtml
            ? '<div class="relative z-10 flex gap-2">' + linkHtml + "</div>"
            : '<span class="meta group-hover:text-accent transition-colors">' +
                u.escape(t("directory.readMore", "Read more")) +
                ' <span class="rtl:rotate-180 inline-block">&rarr;</span></span>') +
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

    /** Branch label in the current language — taken from the member data. */
    function branchLabel(branch) {
      if (branch === "All") return t("directory.all", "All");
      var m = all.filter(function (x) { return x.branch === branch; })[0];
      return m ? i18n.field(m, "branch") : branch;
    }

    var state = { branch: "All", query: "" };

    if (filterBar) {
      filterBar.innerHTML = ["All"].concat(branches).map(function (b) {
        return (
          '<button type="button" class="chip" data-branch="' + u.escape(b) + '" ' +
          'aria-pressed="' + (b === state.branch) + '">' + u.escape(branchLabel(b)) + "</button>"
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
      // Search both languages, so an Arabic query finds an untranslated entry too.
      return [
        m.name, m.nameAr, m.role, m.roleAr, m.location, m.locationAr,
        m.bio, m.bioAr, m.branch, m.branchAr, m.years,
        // the long biography too, with its tags taken out
        String(m.story || "").replace(/<[^>]*>/g, " "),
        String(m.storyAr || "").replace(/<[^>]*>/g, " "),
      ].join(" ").toLowerCase().indexOf(state.query) !== -1;
    }

    function render() {
      var results = all.filter(matches);
      grid.innerHTML = results.map(card).join("");
      if (countEl) countEl.textContent = i18n.count("members", results.length);
      if (emptyEl) emptyEl.hidden = results.length > 0;
      u.observeReveal(grid);
    }

    i18n.onChange(render);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
