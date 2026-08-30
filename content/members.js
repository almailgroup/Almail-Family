/* =============================================================================
   DIRECTORY CONTENT — content/members.js
   =============================================================================

   >>> HOW TO ADD A MEMBER <<<
   Copy a block, paste it into the array, fill in the fields, save. The card,
   the search index and the branch filter all update automatically.

   FIELD REFERENCE
   ---------------
   id        (required)  Unique, lowercase-with-dashes.
   name      (required)  Full display name.
   role      (required)  Profession or title.
   branch    (required)  Family branch — becomes a filter chip automatically.
   location  (optional)  City, Country.
   bio       (required)  2–3 sentences.
   photo     (optional)  e.g. "assets/img/members/name.jpg". Omit for a monogram placeholder.
   links     (optional)  Any of: email, linkedin, x, instagram, website.
                         Omit a key entirely to hide that icon.

   PRIVACY: publish a living family member's details only with their agreement.

   NOTE: the profiles below are sample placeholders written to demonstrate the
   layout. Replace them with the family's real entries.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.members = [
  {
    id: "abdulaziz-almail",
    name: "Abdulaziz Almail",
    role: "Chair, Family Council",
    branch: "First Branch",
    location: "Kuwait City, Kuwait",
    bio: "Convenes the family council and oversees the stewardship of the family house. Spent three decades in maritime logistics before stepping back in 2019.",
    links: { email: "abdulaziz@almail.example" },
  },
  {
    id: "hessa-almail",
    name: "Hessa Almail",
    role: "Architect",
    branch: "First Branch",
    location: "Kuwait City, Kuwait",
    bio: "Led the fourteen-month restoration of the majlis. Practices in conservation architecture with a focus on Gulf vernacular buildings.",
    links: { email: "hessa@almail.example", linkedin: "#" },
  },
  {
    id: "faisal-almail",
    name: "Faisal Almail",
    role: "Physician, Internal Medicine",
    branch: "Second Branch",
    location: "Kuwait City, Kuwait",
    bio: "Consultant physician and long-standing member of the education committee. Mentors family members entering medicine and the allied sciences.",
    links: { email: "faisal@almail.example" },
  },
  {
    id: "noura-almail",
    name: "Noura Almail",
    role: "Software Engineer",
    branch: "Second Branch",
    location: "London, United Kingdom",
    bio: "Builds and maintains this portal and the family archive catalogue. Works on data infrastructure at a fintech company in London.",
    links: { email: "noura@almail.example", linkedin: "#", website: "#" },
  },
  {
    id: "mohammed-almail",
    name: "Mohammed Almail",
    role: "Managing Partner, Almail Trading",
    branch: "Third Branch",
    location: "Kuwait City, Kuwait",
    bio: "Runs the family's trading interests, continuing a line of business first recorded in the 1938 ledgers. Sits on the education fund's review panel.",
    links: { email: "mohammed@almail.example", linkedin: "#" },
  },
  {
    id: "dana-almail",
    name: "Dana Almail",
    role: "Historian & Archivist",
    branch: "Third Branch",
    location: "Kuwait City, Kuwait",
    bio: "Leads the archive working group and the photograph digitisation project. Researches twentieth-century Gulf merchant families.",
    links: { email: "dana@almail.example", x: "#" },
  },
  {
    id: "yousef-almail",
    name: "Yousef Almail",
    role: "Civil Engineer",
    branch: "Fourth Branch",
    location: "Dubai, United Arab Emirates",
    bio: "Project engineer on large infrastructure works across the Gulf. Advises the council on the family house maintenance plan.",
    links: { email: "yousef@almail.example", linkedin: "#" },
  },
  {
    id: "sara-almail",
    name: "Sara Almail",
    role: "Graduate Student, Public Policy",
    branch: "Fourth Branch",
    location: "Boston, United States",
    bio: "Fourth-cohort recipient of the education fund, reading public policy with a focus on urban heritage. Coordinates the younger members' network.",
    links: { email: "sara@almail.example" },
  },
];
