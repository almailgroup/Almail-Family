/* =============================================================================
   HERITAGE CONTENT — content/timeline.js
   =============================================================================

   >>> HOW TO ADD A TIMELINE ENTRY <<<
   Add an object to the array. Entries are rendered in the order given, so keep
   them chronological.

   FIELD REFERENCE
   ---------------
   year     (required)  Displayed label — "1938", "1950s", "c. 1902" all work.
   title    (required)  Short headline for the moment.
   body     (required)  1–3 sentences of plain text.
   note     (optional)  A smaller line beneath — a source, a caveat, a location.

   ACCURACY: mark anything uncertain as uncertain, in `note`.

   NOTE: the entries below are sample placeholders that demonstrate the layout.
   Replace them with the family's documented history.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.timeline = [
  {
    year: "c. 1890s",
    title: "The earliest record",
    body: "The family name appears in a written record for the first time, in connection with the pearling trade out of Kuwait's old harbour.",
    note: "Date approximate — inferred from a later account, not a primary document.",
  },
  {
    year: "1938",
    title: "The first ledger",
    body: "A bound merchant's ledger begins, the earliest continuous record the family holds. It runs, with two gaps, until 1961.",
    note: "Digitised in full; scans available to family members.",
  },
  {
    year: "1946",
    title: "From pearls to shipping",
    body: "Entries shift decisively away from the pearling season and toward shipping and freight — the family's trade reoriented within a single decade.",
  },
  {
    year: "1952",
    title: "The family house",
    body: "The house in Kuwait City is built and becomes the centre of family life: the majlis for gatherings, the courtyard for everything else.",
  },
  {
    year: "1961",
    title: "A new state, a new scale",
    body: "With independence, the family's businesses widen into construction supply and services. The third ledger closes as formal accounts begin.",
  },
  {
    year: "1978",
    title: "The first family council",
    body: "An informal council is convened to settle shared matters — the house, the endowment, and support for family members in education.",
  },
  {
    year: "1994",
    title: "The education fund",
    body: "The council formalises its scholarship support into a standing fund, open to any family member in higher education.",
  },
  {
    year: "2019",
    title: "The archive project",
    body: "A working group begins cataloguing photographs, letters and ledgers. More than 1,400 images have been digitised to date.",
  },
  {
    year: "2025",
    title: "Restoring the majlis",
    body: "A fourteen-month restoration returns the majlis to use — original doors and plasterwork kept, structure and services renewed.",
  },
  {
    year: "2026",
    title: "This portal",
    body: "The family's record moves online: a directory of members, a journal of what we are doing, and a heritage archive that anyone can correct.",
  },
];
