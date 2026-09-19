/* =============================================================================
   DIRECTORY CONTENT — content/members.js
   =============================================================================

   >>> HOW TO ADD A MEMBER <<<
   Copy the block below, paste it into the array, fill in the fields, save. The
   card, the search index and the branch filter all update automatically.

   FIELD REFERENCE
   ---------------
   id        (required)  Unique, lowercase-with-dashes.
   name      (required)  Full display name.
   role      (required)  Profession or title.
   branch    (required)  Family branch — becomes a filter chip automatically.
   location  (optional)  City, Country.
   bio       (required)  2–3 sentences.
   photo     (optional)  e.g. "/assets/img/members/mansour-abdulreda-almail.jpg".
                         Omit for a monogram placeholder.
   links     (optional)  Any of: email, linkedin, x, instagram, website.
                         Omit a key entirely to hide that icon.

   Every field has an Arabic twin: nameAr, roleAr, branchAr, locationAr, bioAr.
   Leave one out and the English shows in both languages.

   PHOTO PATHS MUST START WITH A SLASH. Pages live one level down (/directory/),
   so "assets/img/…" would be looked for at "/directory/assets/img/…" and 404.
   Put the file in assets/img/members/ and write the path as
   "/assets/img/members/<file>". See assets/img/members/README.md.

   PRIVACY: publish a living family member's details only with their agreement.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.members = [
  {
    id: "mansour-abdulreda-almail",
    name: "Mansour Abdulreda Almail",
    // TO FILL IN: role, branch and bio below are placeholders — only the name
    // is known. Replace them (and their Arabic twins) with the real details.
    role: "Family member",
    branch: "Almail Family",
    bio: "Profile to be completed.",
    photo: "/assets/img/members/Mansour_Abdulreda_Almail.png",
    // born: "1948",
    // died: "2021",
    // location: "Kuwait City, Kuwait",
    // links: { email: "" },

    // The long biography shown at /member/?id=mansour-abdulreda-almail.
    // Trusted HTML, like a post's body: <p>, <h2>, <ul>, <blockquote> and so on
    // all work. Give the opening paragraph class="lede" for the larger
    // standfirst. Leave `story` out entirely and the page falls back to `bio`.
    story:
      "<p class=\"lede\">Profile to be completed.</p>",

    nameAr: "منصور عبدالرضا الميل",
    roleAr: "من أفراد العائلة",
    branchAr: "عائلة الميل",
    bioAr: "سيتم استكمال الملف.",
    storyAr: "<p class=\"lede\">سيتم استكمال الملف.</p>",
  },
];
