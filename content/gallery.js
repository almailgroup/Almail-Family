/* =============================================================================
   PICTURES — content/gallery.js
   =============================================================================

   >>> HOW TO ADD A PHOTOGRAPH <<<
   1. Put the image file in assets/img/
   2. Add a block to the array below
   3. Save. The picture appears in the gallery immediately.

   FIELD REFERENCE
   ---------------
   src      (required)  e.g. "/assets/img/harbour-1963.jpg" — MUST start with a
                        slash: pages live at /pictures/, so a relative path is
                        looked for under /pictures/ and 404s.
   caption  (required)  What the picture shows.
   captionAr(optional)  The same in Arabic.
   date     (optional)  "1963" or "c. 1960s".
   credit   (optional)  Who took it, or where it came from.

   Arabic twins: captionAr, dateAr, creditAr. Leave one out and the English
   shows in both languages.

   The caption shows on the card, because it says what the picture is. The date
   and the credit do not: they appear with the picture when it is opened full
   screen, which is where a reader looks for them and where they do not stack
   three lines deep under every thumbnail.

   The gallery is deliberately empty: it is waiting for the family's own
   photographs rather than shipping stand-ins that would have to be deleted.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.gallery = [
  // {
  //   src: "/assets/img/harbour-1963.jpg",
  //   caption: "The old harbour front",
  //   captionAr: "واجهة الميناء القديم",
  //   date: "c. 1963",
  //   credit: "Family collection",
  // },
];
