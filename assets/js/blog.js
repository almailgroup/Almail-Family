/* =============================================================================
   blog.js — journal listing, filters, search, and the homepage feed
   -----------------------------------------------------------------------------
   Reads content/posts.js. Renders:
     • [data-latest-posts]  → the homepage "Latest updates" feed
     • #post-grid           → the full Journal page, with category + search filters
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;
  var t = i18n.t;

  // Add a category here and its filter chip appears as soon as a post uses it.
  // Its Arabic label goes in content/i18n.js under "cat.<name>".
  var CATEGORIES = ["Events", "Announcements", "Articles", "Photo Highlights"];

  /** Category label in the current language. */
  function categoryLabel(name) {
    return t("cat." + name, name);
  }

  /* ---------------------------------------------------------------------------
     Card media — a real cover image when one is supplied, otherwise a clean
     monochrome monogram placeholder so the grid never looks broken.
     ------------------------------------------------------------------------ */
  function media(post, ratio) {
    if (post.image) {
      return (
        '<div class="' + ratio + ' overflow-hidden border-b border-line bg-surface">' +
          '<img src="' + u.escape(post.image) + '" alt="" loading="lazy" ' +
               'class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]">' +
        "</div>"
      );
    }
    return (
      '<div class="' + ratio + ' grid place-items-center border-b border-line bg-surface" aria-hidden="true">' +
        '<span class="font-display text-[11px] font-medium uppercase tracking-[0.45em] text-muted">' +
          u.escape(t("brand.family", "Almail")) + "</span>" +
      "</div>"
    );
  }

  var ARROW =
    '<svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ' +
    'rtl:rotate-180 rtl:group-hover:-translate-x-1" ' +
    'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"></path></svg>';

  /* ---------------------------------------------------------------------------
     Standard card
     ------------------------------------------------------------------------ */
  function card(post, index) {
    return (
      '<article class="card card-hover group reveal" data-reveal-delay="' + (index % 3) * 80 + '">' +
        '<a href="post.html?p=' + encodeURIComponent(post.slug) + '" class="flex h-full flex-col">' +
          media(post, "aspect-[16/10]") +
          '<div class="flex flex-1 flex-col p-6 sm:p-7">' +
            '<div class="flex flex-wrap items-center gap-x-3 gap-y-2">' +
              '<span class="tag">' + u.escape(categoryLabel(post.category)) + "</span>" +
              '<span class="meta">' + u.formatDate(post.date) + "</span>" +
            "</div>" +
            '<h3 class="display-3 mt-4"' + i18n.markup(post, "title") + ">" +
              u.escape(i18n.field(post, "title")) + "</h3>" +
            '<p class="mt-3 text-[15px] leading-relaxed text-ink-2"' + i18n.markup(post, "excerpt") + ">" +
              u.escape(i18n.field(post, "excerpt")) + "</p>" +
            '<span class="mt-auto flex items-center gap-2 pt-6 text-sm font-medium">' +
              u.escape(t("blog.read", "Read")) + ARROW +
            "</span>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  /* ---------------------------------------------------------------------------
     Feature card — wide, two-column on desktop. Used once at the top of the
     homepage feed.
     ------------------------------------------------------------------------ */
  function featureCard(post) {
    return (
      '<article class="card card-hover group reveal md:col-span-2 lg:col-span-3">' +
        '<a href="post.html?p=' + encodeURIComponent(post.slug) + '" class="grid md:grid-cols-2">' +
          '<div class="md:border-b-0 md:border-e md:border-line">' +
            media(post, "aspect-[16/10] md:aspect-auto md:h-full md:min-h-[20rem]") +
          "</div>" +
          '<div class="flex flex-col justify-center p-7 sm:p-10">' +
            '<div class="flex flex-wrap items-center gap-x-3 gap-y-2">' +
              '<span class="tag">' + u.escape(categoryLabel(post.category)) + "</span>" +
              '<span class="meta">' + u.formatDate(post.date) + "</span>" +
            "</div>" +
            '<h3 class="display-2 mt-5"' + i18n.markup(post, "title") + ">" +
              u.escape(i18n.field(post, "title")) + "</h3>" +
            '<p class="mt-4 max-w-prose text-[15px] leading-relaxed text-ink-2 sm:text-base"' +
              i18n.markup(post, "excerpt") + ">" + u.escape(i18n.field(post, "excerpt")) +
            "</p>" +
            '<span class="mt-8 flex items-center gap-2 text-sm font-medium">' +
              u.escape(t("blog.readFull", "Read the full post")) + ARROW + "</span>" +
          "</div>" +
        "</a>" +
      "</article>"
    );
  }

  /* ---------------------------------------------------------------------------
     Homepage feed
     ------------------------------------------------------------------------ */
  function renderLatest() {
    var host = document.querySelector("[data-latest-posts]");
    if (!host) return;
    i18n.onChange(function () { drawLatest(host); });
  }

  function drawLatest(host) {
    var limit = parseInt(host.dataset.latestPosts || "3", 10);
    var posts = u.sortedPosts();

    // With data-feature, the newest post flagged `featured: true` (or simply the
    // newest post) is given the wide slot at the top of the feed.
    var html = "";
    if (host.hasAttribute("data-feature") && posts.length) {
      var lead = posts.filter(function (p) { return p.featured; })[0] || posts[0];
      posts = posts.filter(function (p) { return p !== lead; });
      html += featureCard(lead);
    }
    html += posts.slice(0, limit).map(card).join("");

    host.innerHTML = html;
    u.observeReveal(host);
  }

  /* ---------------------------------------------------------------------------
     Journal page
     ------------------------------------------------------------------------ */
  function renderJournal() {
    var grid = document.getElementById("post-grid");
    if (!grid) return;

    var filterBar = document.getElementById("post-filters");
    var searchInput = document.getElementById("post-search");
    var countEl = document.getElementById("post-count");
    var emptyEl = document.getElementById("post-empty");

    var all = u.sortedPosts();
    // Only offer categories that actually have posts, in a stable order.
    var used = CATEGORIES.filter(function (c) {
      return all.some(function (p) { return p.category === c; });
    });

    var state = {
      category: u.param("category") || "All",
      query: "",
    };
    if (used.indexOf(state.category) === -1) state.category = "All";

    /* Filter chips */
    if (filterBar) {
      filterBar.innerHTML = ["All"].concat(used).map(function (cat) {
        var label = cat === "All" ? t("blog.all", "All") : categoryLabel(cat);
        return (
          '<button type="button" class="chip" data-category="' + u.escape(cat) + '" ' +
          'aria-pressed="' + (cat === state.category) + '">' + u.escape(label) + "</button>"
        );
      }).join("");

      filterBar.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-category]");
        if (!btn) return;
        state.category = btn.dataset.category;
        filterBar.querySelectorAll("[data-category]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.category === state.category));
        });
        // Keep the URL shareable without adding history entries.
        var url = new URL(location.href);
        if (state.category === "All") url.searchParams.delete("category");
        else url.searchParams.set("category", state.category);
        history.replaceState(null, "", url);
        render();
      });
    }

    /* Search */
    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        render();
      });
    }

    function matches(post) {
      if (state.category !== "All" && post.category !== state.category) return false;
      if (!state.query) return true;
      // Search both languages, so an Arabic query finds an English post too.
      return [
        post.title, post.titleAr, post.excerpt, post.excerptAr,
        post.author, post.authorAr, post.category, categoryLabel(post.category),
      ].join(" ").toLowerCase().indexOf(state.query) !== -1;
    }

    function render() {
      var results = all.filter(matches);
      grid.innerHTML = results.map(card).join("");
      if (countEl) countEl.textContent = i18n.count("posts", results.length);
      if (emptyEl) emptyEl.hidden = results.length > 0;
      u.observeReveal(grid);
    }

    i18n.onChange(render);
  }

  /* ------------------------------------------------------------------------ */
  function init() {
    renderLatest();
    renderJournal();
  }

  ALMAIL.postCard = card;
  ALMAIL.featurePostCard = featureCard;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
