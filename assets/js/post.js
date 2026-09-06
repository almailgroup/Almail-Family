/* =============================================================================
   post.js — renders a single article at post.html?p=<slug>
   -----------------------------------------------------------------------------
   The `body` field of a post is authored by the family in content/posts.js and
   is therefore trusted HTML; every other field is escaped before insertion.
   ========================================================================== */

(function () {
  "use strict";

  var u = ALMAIL.utils;
  var i18n = ALMAIL.i18n;
  var t = i18n.t;

  function notFound(host) {
    host.innerHTML =
      '<div class="container-x section text-center">' +
        '<p class="eyebrow">404</p>' +
        '<h1 class="display-2 mt-4">' +
          u.escape(t("post.nfTitle", "We couldn't find that post")) + "</h1>" +
        '<p class="lede mx-auto mt-5 max-w-md">' +
          u.escape(t("post.nfBody",
            "It may have been renamed or removed. The Journal has everything we've published.")) +
        "</p>" +
        '<a href="blog.html" class="btn-primary mt-10">' +
          u.escape(t("post.nfCta", "Back to the Journal")) + "</a>" +
      "</div>";
  }

  function init() {
    var host = document.getElementById("article-root");
    if (!host) return;

    var posts = u.sortedPosts();
    var slug = u.param("p");
    var index = posts.findIndex(function (p) { return p.slug === slug; });

    if (index === -1) {
      notFound(host);
      return;
    }

    var post = posts[index];
    var newer = posts[index - 1]; // sorted newest-first
    var older = posts[index + 1];

    /* Document metadata --------------------------------------------------- */
    document.title = i18n.field(post, "title") + " — " +
      t("brand.family", "Almail") + (i18n.lang === "ar" ? "" : " Family");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", i18n.field(post, "excerpt"));

    /* Cover ---------------------------------------------------------------- */
    var cover = post.image
      ? '<figure class="mt-12 border border-line">' +
          '<img src="' + u.escape(post.image) + '" alt="" class="w-full">' +
        "</figure>"
      : "";

    /* Prev / next ---------------------------------------------------------- */
    function pager(post, label, align) {
      if (!post) return '<div class="hidden sm:block"></div>';
      return (
        '<a href="post.html?p=' + encodeURIComponent(post.slug) + '" ' +
        'class="group block p-6 sm:p-8 ' + align + '">' +
          '<span class="eyebrow">' + u.escape(label) + "</span>" +
          '<span class="display-3 mt-3 block"' + i18n.markup(post, "title") + ">" +
            u.escape(i18n.field(post, "title")) + "</span>" +
        "</a>"
      );
    }

    host.innerHTML =
      /* --- Header --- */
      '<div class="container-x pt-14 sm:pt-20">' +
        '<a href="blog.html" class="meta link-underline">' +
          '<span class="rtl:rotate-180 inline-block">&larr;</span> ' +
          u.escape(t("post.allPosts", "All posts")) + "</a>" +
        '<div class="reading mt-10">' +
          '<div class="flex flex-wrap items-center gap-x-3 gap-y-2">' +
            '<span class="tag">' + u.escape(t("cat." + post.category, post.category)) + "</span>" +
            '<span class="meta">' + u.formatDate(post.date) + "</span>" +
            '<span class="meta">·</span>' +
            '<span class="meta">' + u.escape(i18n.minutes(u.readingTime(i18n.field(post, "body")))) + "</span>" +
          "</div>" +
          '<h1 class="display-1 mt-6 text-4xl sm:text-5xl"' + i18n.markup(post, "title") + ">" +
            u.escape(i18n.field(post, "title")) + "</h1>" +
          '<p class="meta mt-6 border-t border-line pt-6">' +
            u.escape(t("post.by", "By")) + " " + u.escape(i18n.field(post, "author")) + "</p>" +
        "</div>" +
        cover +
      "</div>" +

      /* --- Body --- */
      '<div class="container-x">' +
        '<div class="article-body reading py-12 sm:py-16"' + i18n.markup(post, "body") + ">" +
          i18n.field(post, "body") +
        "</div>" +

        /* --- Share --- */
        '<div class="reading flex flex-wrap items-center justify-between gap-4 border-t border-line py-8">' +
          '<p class="meta">' + u.escape(t("post.share", "Share this post")) + "</p>" +
          '<button type="button" class="btn-outline btn-sm" data-copy-link>' +
            u.escape(t("post.copy", "Copy link")) + "</button>" +
        "</div>" +
      "</div>" +

      /* --- Pager --- */
      '<nav class="border-t border-line" aria-label="' + u.escape(t("post.moreNav", "More posts")) + '">' +
        '<div class="container-x">' +
          '<div class="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">' +
            pager(older, t("post.prev", "Previous"), "") +
            pager(newer, t("post.next", "Next"), "sm:text-end") +
          "</div>" +
        "</div>" +
      "</nav>";

    /* Copy-link button ------------------------------------------------------ */
    var copyBtn = host.querySelector("[data-copy-link]");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var done = function () {
          copyBtn.textContent = t("post.copied", "Link copied");
          setTimeout(function () {
            copyBtn.textContent = t("post.copy", "Copy link");
          }, 2000);
        };
        if (navigator.clipboard) {
          navigator.clipboard.writeText(location.href).then(done, function () {});
        } else {
          // Fallback for non-secure contexts.
          var tmp = document.createElement("input");
          tmp.value = location.href;
          document.body.appendChild(tmp);
          tmp.select();
          try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
          document.body.removeChild(tmp);
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { i18n.onChange(init); });
  } else {
    i18n.onChange(init);
  }
})();
