/* =============================================================================
   member.js — renders one person's profile at /member/?id=<id>
   -----------------------------------------------------------------------------
   Laid out the way a reference entry is: the portrait and the hard facts held
   together in a panel to one side, the prose running beside it. On a phone the
   panel simply sits above the prose.

   The `story` field of a member is authored by the family in content/members.js
   and is therefore trusted HTML, exactly as a post's `body` is. EVERY OTHER
   FIELD IS ESCAPED before it reaches the page.
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
          u.escape(t("member.nfTitle", "We couldn't find that person")) + "</h1>" +
        '<p class="lede mx-auto mt-5 max-w-md">' +
          u.escape(t("member.nfBody",
            "The entry may have been renamed or removed. The directory lists everyone we hold.")) +
        "</p>" +
        '<a href="/directory/" class="btn-primary mt-10">' +
          u.escape(t("member.nfCta", "Back to the directory")) + "</a>" +
      "</div>";
  }

  /* The portrait, large. Falls back to the monogram plate when no photograph
     has been supplied, in the same 3:4 frame so the panel keeps its shape. */
  function portrait(member) {
    if (member.photo) {
      return (
        '<img src="' + u.escape(member.photo) + '" ' +
        'alt="' + u.escape(i18n.field(member, "name")) + '" ' +
        'class="aspect-[3/4] w-full border border-line object-cover">'
      );
    }
    return (
      '<span class="grid aspect-[3/4] w-full place-items-center border border-line bg-surface ' +
      'font-display text-5xl font-semibold tracking-tight" aria-hidden="true">' +
        u.escape(u.initials(member.name)) +
      "</span>"
    );
  }

  /* One row of the facts panel. Skipped entirely when the field is empty, so
     an incomplete entry reads as spare rather than broken. */
  function fact(label, value) {
    if (!value) return "";
    return (
      '<div class="flex flex-col gap-1 border-t border-line py-3 sm:flex-row sm:gap-4">' +
        '<dt class="meta shrink-0 sm:w-28">' + u.escape(label) + "</dt>" +
        '<dd class="text-[15px] text-ink-2">' + u.escape(value) + "</dd>" +
      "</div>"
    );
  }

  function init() {
    var host = document.getElementById("member-root");
    if (!host) return;

    var members = (window.ALMAIL && ALMAIL.members) || [];
    var id = u.param("id");
    var member = members.filter(function (m) { return m.id === id; })[0];

    if (!member) {
      notFound(host);
      return;
    }

    var name = i18n.field(member, "name");

    /* Document metadata --------------------------------------------------- */
    document.title = name + " — " +
      t("brand.family", "Almail") + (i18n.lang === "ar" ? "" : " Family");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", name + " — " + i18n.field(member, "role"));

    /* Links, reusing the same icons the directory card uses ---------------- */
    var links = member.links || {};
    var linkHtml = Object.keys(links).map(function (k) {
      return u.iconLink(k, links[k], member.name);
    }).join("");

    /* The story is trusted HTML; when there is none, fall back to the short
       bio so the page is never empty. */
    var story = i18n.field(member, "story");
    var body = story
      ? '<div class="article-body"' + i18n.markup(member, "story") + ">" + story + "</div>"
      : '<p class="lede"' + i18n.markup(member, "bio") + ">" +
          u.escape(i18n.field(member, "bio")) + "</p>";

    host.innerHTML =
      '<div class="container-x pt-14 sm:pt-20">' +
        '<a href="/directory/" class="meta link-underline">' +
          '<span class="rtl:rotate-180 inline-block">&larr;</span> ' +
          u.escape(t("member.all", "All members")) + "</a>" +

        '<div class="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">' +

          /* --- The panel: portrait, then the hard facts ------------------ */
          '<aside class="lg:col-span-4">' +
            '<figure class="reveal">' +
              portrait(member) +
              '<figcaption class="meta mt-3">' +
                u.escape(name) +
              "</figcaption>" +
            "</figure>" +
            '<dl class="mt-8 border-b border-line">' +
              fact(t("member.role", "Role"), i18n.field(member, "role")) +
              fact(t("member.branch", "Branch"), i18n.field(member, "branch")) +
              fact(t("member.born", "Born"), i18n.field(member, "born")) +
              fact(t("member.died", "Died"), i18n.field(member, "died")) +
              fact(t("member.location", "Based in"), i18n.field(member, "location")) +
            "</dl>" +
            (linkHtml
              ? '<div class="mt-6 flex gap-2">' + linkHtml + "</div>"
              : "") +
          "</aside>" +

          /* --- The prose ------------------------------------------------- */
          '<div class="lg:col-span-8">' +
            '<p class="eyebrow">' + u.escape(t("member.eyebrow", "Directory")) + "</p>" +
            '<h1 class="display-1 mt-5 text-4xl sm:text-5xl"' + i18n.markup(member, "name") + ">" +
              u.escape(name) + "</h1>" +
            '<hr class="rule-double mt-8">' +
            '<div class="mt-10">' + body + "</div>" +
          "</div>" +

        "</div>" +
      "</div>" +

      '<div class="container-x">' +
        '<div class="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line py-8">' +
          '<p class="meta">' + u.escape(t("member.share", "Share this profile")) + "</p>" +
          '<button type="button" class="btn-outline btn-sm" data-copy-link>' +
            u.escape(t("post.copy", "Copy link")) + "</button>" +
        "</div>" +
      "</div>";

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
        }
      });
    }

    u.observeReveal(host);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  /* Re-render on a language switch, the way the other pages do. */
  if (i18n.onChange) i18n.onChange(init);
})();
