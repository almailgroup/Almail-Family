/* =============================================================================
   RESOURCES — content/resources.js
   =============================================================================

   >>> HOW TO ADD A RESOURCE <<<
   Add a block to the array. Entries are grouped by `group` in the order the
   groups first appear, so keep related items together.

   FIELD REFERENCE
   ---------------
   group     (required)  Heading it sits under, e.g. "In the family archive".
   groupAr   (optional)  The same in Arabic.
   title     (required)  Name of the document, book or collection.
   titleAr   (optional)
   detail    (required)  One line: what it is, and its dates if known.
   detailAr  (optional)
   access    (optional)  How to consult it — "On request", "Kuwait National
                         Library", a shelf mark.
   accessAr  (optional)
   href      (optional)  A link, if it is online. Omitted entries render as
                         plain text, which is right for things held on paper.

   NOTE: the entries below are samples that match the placeholder content
   elsewhere on the site. Replace them with the family's real sources.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.resources = [
  {
    group: "In the family archive",
    groupAr: "في أرشيف العائلة",
    title: "The merchant's ledgers, 1938–1961",
    titleAr: "دفاتر التاجر، 1938–1961",
    detail: "Three bound volumes, photographed page by page. The earliest continuous record the family holds.",
    detailAr: "ثلاثة مجلدات مصوَّرة صفحةً صفحة، وهي أقدم سجلّ متصل تملكه العائلة.",
    access: "Scans on request; originals in archival storage",
    accessAr: "النسخ الرقمية عند الطلب؛ الأصول في التخزين الأرشيفي",
  },
  {
    group: "In the family archive",
    groupAr: "في أرشيف العائلة",
    title: "The photograph collection",
    titleAr: "مجموعة الصور",
    detail: "More than 1,400 images digitised so far, roughly a third of the collection.",
    detailAr: "أكثر من 1,400 صورة جرت رقمنتها حتى الآن، أي نحو ثلث المجموعة.",
    access: "On request",
    accessAr: "عند الطلب",
  },
  {
    group: "Family papers",
    groupAr: "أوراق العائلة",
    title: "Education fund guidelines",
    titleAr: "لائحة صندوق التعليم",
    detail: "Eligibility, what the fund covers, and how applications are reviewed.",
    detailAr: "شروط الاستحقاق، وما يغطّيه الصندوق، وكيفية مراجعة الطلبات.",
    access: "From the education committee",
    accessAr: "من لجنة التعليم",
  },
  {
    group: "Family papers",
    groupAr: "أوراق العائلة",
    title: "The majlis restoration report",
    titleAr: "تقرير ترميم المجلس",
    detail: "What was kept, what was replaced, and the maintenance plan that followed.",
    detailAr: "ما حُفظ، وما استُبدل، وخطة الصيانة التي تلت ذلك.",
    access: "From the family council",
    accessAr: "من مجلس العائلة",
  },
];
