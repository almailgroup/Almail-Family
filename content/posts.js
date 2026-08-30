/* =============================================================================
   BLOG CONTENT — content/posts.js
   =============================================================================

   >>> HOW TO ADD A NEW POST <<<

   1. Copy one of the blocks below and paste it at the TOP of the array
      (order in the file doesn't matter — posts are sorted by `date` — but
      keeping newest first makes the file easy to scan).
   2. Fill in the fields. `slug` must be unique: it becomes the URL,
      e.g. post.html?p=your-slug
   3. Write the article in `body` using plain HTML between the backticks
      (<h2>, <p>, <ul>, <blockquote>, <figure>, <img> are all styled already).
   4. Save. That's it — no build step, no rebuild, no database.
      The post appears on the homepage, in the Journal, and in its category
      filter automatically.

   FIELD REFERENCE
   ---------------
   slug      (required)  URL-safe id, lowercase-with-dashes.
   title     (required)  Headline.
   category  (required)  One of: "Events" | "Announcements" | "Articles" | "Photo Highlights"
   date      (required)  ISO date "YYYY-MM-DD".
   author    (required)  Display name.
   excerpt   (required)  1–2 sentences shown on cards and in search results.
   image     (optional)  Path to a cover image, e.g. "assets/img/majlis.jpg".
                         Omit it and a clean monogram placeholder is drawn instead.
   featured  (optional)  true → eligible for the large homepage feature slot.
   body      (required)  The article itself, as HTML.

   NOTE: everything below is sample content written to demonstrate the layout.
   Replace it with the family's real posts.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.posts = [
  {
    slug: "annual-gathering-2026",
    title: "The 2026 Annual Gathering: notes from an evening together",
    category: "Events",
    date: "2026-08-14",
    author: "Family Council",
    excerpt:
      "Four generations, one long table, and the first gathering held at the restored family house in Kuwait City.",
    featured: true,
    body: `
      <p class="lede">Every year we set aside one evening in August. This year it fell on the
      fourteenth, and for the first time in a decade it was held at the family house
      rather than a hotel ballroom.</p>

      <p>Preparations began three weeks ahead. The courtyard was cleared, the old
      <em>diwaniya</em> doors were re-oiled, and the long table — assembled from six
      smaller ones — ran the length of the shaded side of the yard. By eight o'clock
      there were ninety-one of us.</p>

      <h2>What we discussed</h2>
      <p>The gathering is social first, but it is also the one moment each year when the
      whole family hears the same update at the same time. Three items were put to the room:</p>
      <ul>
        <li>The archive project — 1,400 photographs digitised, roughly a third of the collection.</li>
        <li>The education fund — its fourth cohort, and the decision to open applications to cousins studying abroad.</li>
        <li>The house itself — a maintenance plan covering the next five years.</li>
      </ul>

      <blockquote>The point of the evening is not the announcements. It is that the
      children now know a hundred faces they would otherwise have met only at funerals.</blockquote>

      <h2>The archive table</h2>
      <p>A table near the entrance held prints from the digitisation work — the harbour in
      the fifties, the first family shop, a wedding no one under sixty could place. Several
      of the unlabelled photographs were identified on the spot, which is exactly why the
      prints were laid out in the first place.</p>

      <h2>Next year</h2>
      <p>The date is already set for the second Friday of August. If you would like to help
      with hosting, catering or the archive table, write to the family council through the
      <a href="contact.html">contact page</a>.</p>
    `,
  },
  {
    slug: "education-fund-open",
    title: "Applications open for the Almail Education Fund",
    category: "Announcements",
    date: "2026-07-02",
    author: "Education Committee",
    excerpt:
      "The fund's fourth cycle is now accepting applications from family members in undergraduate and graduate study, in Kuwait and abroad.",
    body: `
      <p class="lede">The Almail Education Fund supports family members pursuing higher
      education. Applications for the 2026–2027 academic year are open until 30 September.</p>

      <h2>Who can apply</h2>
      <p>Any member of the extended family enrolled in, or holding an offer from, an
      accredited undergraduate or graduate programme. There is no restriction on field of
      study, and — new this cycle — no restriction on country.</p>

      <h2>What the fund covers</h2>
      <ul>
        <li>Tuition support, assessed on need rather than merit alone.</li>
        <li>A one-off relocation grant for those studying outside Kuwait.</li>
        <li>Access to a mentor from within the family working in a related field.</li>
      </ul>

      <h2>How to apply</h2>
      <p>Send a short letter of intent, your enrolment or offer letter, and a summary of
      costs to the education committee. Applications are reviewed in October and decisions
      are sent before the end of that month.</p>
      <p>Questions are welcome at any time through the <a href="contact.html">contact page</a>.</p>
    `,
  },
  {
    slug: "reading-the-old-ledgers",
    title: "Reading the old ledgers: what a merchant's notebook tells us",
    category: "Articles",
    date: "2026-06-18",
    author: "Archive Working Group",
    excerpt:
      "Three bound ledgers, kept between 1938 and 1961, turn out to be the most detailed record we have of the family's early trade.",
    featured: true,
    body: `
      <p class="lede">They were found in a tin trunk, wrapped in cloth: three ledgers in a
      careful hand, covering twenty-three years of buying and selling.</p>

      <p>The entries are terse — a date, a name, a quantity, a figure — but read in sequence
      they describe a working life. Dates cluster around the pearling season early on, then
      shift decisively after 1946 toward shipping and, later, construction supply.</p>

      <h2>What the numbers show</h2>
      <p>Three patterns stand out. First, the sheer number of counterparties: more than two
      hundred distinct names, most appearing only once or twice. Second, the persistence of
      a small handful of them across all three volumes — relationships lasting decades.
      Third, an abrupt widening of scale in the early fifties that matches, almost to the
      month, the country's own transformation.</p>

      <blockquote>A ledger is not a diary. But kept long enough, it becomes one.</blockquote>

      <h2>What we still don't know</h2>
      <p>Roughly one entry in six uses initials or a nickname we cannot resolve. If you
      recognise a name from family conversation, the working group would like to hear from
      you — a single identification can unlock a whole page.</p>

      <h2>Access</h2>
      <p>The ledgers have been photographed page by page. Scans are available to family
      members on request; the originals remain in archival storage.</p>
    `,
  },
  {
    slug: "archive-photographs-1960s",
    title: "From the archive: Kuwait City in the 1960s",
    category: "Photo Highlights",
    date: "2026-05-21",
    author: "Archive Working Group",
    excerpt:
      "Twelve photographs from the family collection, newly digitised — the harbour, the first shop, and a decade of gatherings.",
    body: `
      <p class="lede">A selection from the second batch of digitised negatives, covering
      roughly 1961 to 1969.</p>

      <p>These frames came from a single shoebox, unlabelled. Dating them has been a
      collaborative effort — car models, shopfronts and, in one case, a visible cinema
      listing narrowed several images to within a month.</p>

      <h2>The harbour</h2>
      <p>Four of the twelve show the old harbour front. They are the earliest colour images
      in the collection and the only ones we have of the original warehouse.</p>

      <h2>Gatherings</h2>
      <p>The remainder are family occasions: two weddings, an Eid lunch, and a long series
      taken across one afternoon in a courtyard we have not yet identified.</p>

      <h2>Help us caption these</h2>
      <p>Prints of all twelve are kept at the family house, and scans can be sent on
      request. If you can name a face or place, please write in — every caption we add
      makes the next batch easier to date.</p>
    `,
  },
  {
    slug: "majlis-restoration-complete",
    title: "The majlis restoration is complete",
    category: "Announcements",
    date: "2026-04-09",
    author: "Family Council",
    excerpt:
      "After fourteen months of work, the family house's majlis has reopened — original doors, original plasterwork, new everything else.",
    body: `
      <p class="lede">The restoration began in February 2025 with a simple brief: keep what
      can be kept, replace only what cannot, and change nothing for the sake of taste.</p>

      <h2>What was kept</h2>
      <ul>
        <li>The carved doors, stripped, repaired and re-oiled rather than replaced.</li>
        <li>The plaster niches along the western wall.</li>
        <li>The floor — lifted, numbered, relaid.</li>
      </ul>

      <h2>What was replaced</h2>
      <p>Wiring, plumbing, and the roof structure above the eastern span, which had been
      patched too many times to patch again. The new work is deliberately plain so that it
      reads as new.</p>

      <h2>Using the room</h2>
      <p>The majlis is available to any family member for gatherings, condolences and
      committee meetings. Bookings go through the family council.</p>
    `,
  },
  {
    slug: "why-we-keep-a-record",
    title: "Why we keep a record",
    category: "Articles",
    date: "2026-02-27",
    author: "Family Council",
    excerpt:
      "A note on the purpose of this site: not nostalgia, but a working record that the next generation can actually use.",
    body: `
      <p class="lede">Most families remember three generations back and no further. The
      fourth becomes a name, the fifth a rumour. This site exists to slow that down.</p>

      <h2>A record, not a monument</h2>
      <p>The aim is not to celebrate. It is to write things down while the people who know
      them are still here to correct us — who lived where, who married whom, which business
      began in which year, and why a decision was taken the way it was.</p>

      <h2>Three commitments</h2>
      <ul>
        <li><strong>Accuracy over polish.</strong> An uncertain date is marked uncertain.</li>
        <li><strong>Privacy by default.</strong> Nothing about a living family member is
        published without their agreement.</li>
        <li><strong>Durability.</strong> Plain files, open formats, no dependence on a
        service that may not exist in twenty years.</li>
      </ul>

      <blockquote>We are not writing for ourselves. We are writing for someone who will
      open this in 2070 and want to know what actually happened.</blockquote>

      <h2>Contribute</h2>
      <p>Corrections are as valuable as contributions. If something here is wrong, say so
      through the <a href="contact.html">contact page</a> and it will be changed.</p>
    `,
  },
];
