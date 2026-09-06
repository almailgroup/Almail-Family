/* =============================================================================
   FAMILY TREE — content/tree.js
   =============================================================================

   >>> HOW TO EDIT THE TREE <<<
   The tree is one nested object. Every person is:

     {
       name:    "Full name",        // required
       nameAr:  "الاسم بالعربية",    // optional
       years:   "1901–1978",        // optional — birth/death, or just a birth
       note:    "One short line",   // optional — role, place, anything
       noteAr:  "…",                // optional
       children: [ … ]              // optional — the next generation
     }

   Add a person by adding an object to the `children` array of their parent.
   Nesting depth is unlimited; the page indents each generation automatically.

   ACCURACY: mark anything uncertain in `note` — "c." for approximate dates,
   "uncertain" where the link is not documented. A tree that admits its gaps is
   more useful than one that quietly guesses.

   PRIVACY: the same rule as the directory — publish a living person's details
   only with their agreement.

   NOTE: the names below are the same sample placeholders used elsewhere on the
   site. Replace them with the family's real record.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.tree = {
  name: "The Almail family",
  nameAr: "عائلة الميل",
  note: "Earliest written record, c. 1890s",
  noteAr: "أقدم سجلّ مكتوب، نحو 1890",
  children: [
    {
      name: "First Branch",
      nameAr: "الفرع الأول",
      children: [
        {
          name: "Abdulaziz Almail",
          nameAr: "عبدالعزيز الميل",
          note: "Chair, Family Council",
          noteAr: "رئيس مجلس العائلة",
          children: [
            { name: "Hessa Almail", nameAr: "حصة الميل", note: "Architect", noteAr: "معمارية" },
          ],
        },
      ],
    },
    {
      name: "Second Branch",
      nameAr: "الفرع الثاني",
      children: [
        {
          name: "Faisal Almail",
          nameAr: "فيصل الميل",
          note: "Physician",
          noteAr: "طبيب",
          children: [
            { name: "Noura Almail", nameAr: "نورة الميل", note: "Software engineer, London", noteAr: "مهندسة برمجيات، لندن" },
          ],
        },
      ],
    },
    {
      name: "Third Branch",
      nameAr: "الفرع الثالث",
      children: [
        { name: "Mohammed Almail", nameAr: "محمد الميل", note: "Managing partner", noteAr: "شريك إداري" },
        { name: "Dana Almail", nameAr: "دانة الميل", note: "Historian and archivist", noteAr: "مؤرخة وأمينة أرشيف" },
      ],
    },
    {
      name: "Fourth Branch",
      nameAr: "الفرع الرابع",
      children: [
        {
          name: "Yousef Almail",
          nameAr: "يوسف الميل",
          note: "Civil engineer, Dubai",
          noteAr: "مهندس مدني، دبي",
          children: [
            { name: "Sara Almail", nameAr: "سارة الميل", note: "Graduate student, Boston", noteAr: "طالبة دراسات عليا، بوسطن" },
          ],
        },
      ],
    },
  ],
};
