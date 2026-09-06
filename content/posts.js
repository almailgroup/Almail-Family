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
    titleAr: "لقاء العائلة السنوي 2026: ملاحظات من أمسية جمعتنا",
    excerptAr:
      "أربعة أجيال، ومائدة واحدة طويلة، وأول لقاء يُقام في بيت العائلة المُرمَّم في مدينة الكويت.",
    authorAr: "مجلس العائلة",
    bodyAr: `
      <p class="lede">في كل عام نخصّص أمسية واحدة في أغسطس. هذا العام جاءت في الرابع عشر منه،
      ولأول مرة منذ عقد أُقيمت في بيت العائلة بدلًا من قاعة فندق.</p>

      <p>بدأت التحضيرات قبل ثلاثة أسابيع. نُظِّف الفناء، وأُعيد دهن أبواب الديوانية القديمة،
      ومُدَّت المائدة الطويلة — المؤلَّفة من ستّ موائد أصغر — بطول الجانب المظلَّل من الفناء.
      وبحلول الثامنة كنّا واحدًا وتسعين شخصًا.</p>

      <h2>ما الذي ناقشناه</h2>
      <p>اللقاء اجتماعي في المقام الأول، لكنه أيضًا اللحظة الوحيدة في السنة التي تسمع فيها
      العائلة كلها التحديث نفسه في الوقت نفسه. وعُرضت ثلاثة أمور على الحاضرين:</p>
      <ul>
        <li>مشروع الأرشيف — 1,400 صورة جرت رقمنتها، أي نحو ثلث المجموعة.</li>
        <li>صندوق التعليم — دفعته الرابعة، وقرار فتح باب التقديم لأبناء العائلة الدارسين في الخارج.</li>
        <li>البيت نفسه — خطة صيانة تغطّي السنوات الخمس المقبلة.</li>
      </ul>

      <blockquote>ليست الإعلانات هي المقصد من الأمسية. المقصد أن يعرف الأطفال مئة وجهٍ
      ما كانوا ليلتقوا بها إلا في العزاء.</blockquote>

      <h2>طاولة الأرشيف</h2>
      <p>حملت طاولة قرب المدخل مطبوعات من أعمال الرقمنة — الميناء في الخمسينيات، وأول دكان
      للعائلة، وعرس لم يستطع أحد دون الستين أن يحدّده. وقد جرى التعرّف على عدد من الصور
      غير المُعنونة في الحال، وهذا تحديدًا سبب عرض المطبوعات من الأساس.</p>

      <h2>العام المقبل</h2>
      <p>التاريخ محدَّد سلفًا: الجمعة الثانية من أغسطس. وإن رغبت في المساعدة في الاستضافة
      أو الضيافة أو طاولة الأرشيف، فراسل مجلس العائلة عبر
      <a href="contact.html">صفحة التواصل</a>.</p>
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
    titleAr: "فتح باب التقديم لصندوق العائلة للتعليم",
    excerptAr:
      "الدورة الرابعة للصندوق تستقبل الآن طلبات أفراد العائلة في مرحلتَي البكالوريوس والدراسات العليا، في الكويت وخارجها.",
    authorAr: "لجنة التعليم",
    bodyAr: `
      <p class="lede">يدعم صندوق العائلة للتعليم أفرادَ العائلة في تعليمهم العالي.
      باب التقديم للعام الدراسي 2026–2027 مفتوح حتى 30 سبتمبر.</p>

      <h2>من يحقّ له التقديم</h2>
      <p>أي فرد من العائلة الممتدة مُلتحِق ببرنامج بكالوريوس أو دراسات عليا معتمَد، أو حاصل
      على قبول فيه. لا قيد على مجال الدراسة، ولا قيد — وهذا جديد هذه الدورة — على بلد الدراسة.</p>

      <h2>ما الذي يغطّيه الصندوق</h2>
      <ul>
        <li>دعم الرسوم الدراسية، ويُقدَّر على أساس الحاجة لا التفوّق وحده.</li>
        <li>منحة انتقال تُصرف مرة واحدة لمن يدرس خارج الكويت.</li>
        <li>التواصل مع مرشد من داخل العائلة يعمل في مجال قريب.</li>
      </ul>

      <h2>كيفية التقديم</h2>
      <p>أرسل خطاب نية موجزًا، وخطاب القيد أو القبول، وملخّصًا للتكاليف إلى لجنة التعليم.
      تُراجَع الطلبات في أكتوبر وتُرسَل القرارات قبل نهاية الشهر نفسه.</p>
      <p>الأسئلة مرحَّب بها في أي وقت عبر <a href="contact.html">صفحة التواصل</a>.</p>
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
    titleAr: "في قراءة الدفاتر القديمة: ماذا يخبرنا دفتر تاجر",
    excerptAr:
      "ثلاثة دفاتر مجلَّدة، حُفظت بين عامَي 1938 و1961، تبيَّن أنها أدقّ سجلّ نملكه عن تجارة العائلة المبكرة.",
    authorAr: "فريق عمل الأرشيف",
    bodyAr: `
      <p class="lede">وُجدت في صندوق من الصفيح، ملفوفةً بقماش: ثلاثة دفاتر بخطٍّ متأنٍّ،
      تغطّي ثلاثة وعشرين عامًا من البيع والشراء.</p>

      <p>القيود مقتضبة — تاريخ، واسم، وكمية، ورقم — لكنها إذا قُرئت متتابعةً وصفت حياة عمل
      كاملة. تتجمّع التواريخ حول موسم الغوص في البداية، ثم تتحوّل تحوّلًا حاسمًا بعد 1946
      نحو الشحن، ثم نحو توريد مواد البناء لاحقًا.</p>

      <h2>ما تُظهره الأرقام</h2>
      <p>تبرز ثلاثة أنماط. أولها كثرة الأطراف المتعاملة: أكثر من مائتَي اسم مختلف، معظمها
      يظهر مرة أو مرتين فقط. وثانيها بقاء حفنة صغيرة منها عبر المجلدات الثلاثة — علاقات
      امتدّت عقودًا. وثالثها اتّساع مفاجئ في الحجم مطلع الخمسينيات يوافق، بالشهر تقريبًا،
      تحوّل البلد نفسه.</p>

      <blockquote>الدفتر ليس مذكّرات. لكنه إذا حُفظ مدةً كافية صار مذكّرات.</blockquote>

      <h2>ما لا نزال نجهله</h2>
      <p>نحو قيدٍ من كل ستة يستخدم أحرفًا أولى أو لقبًا لا نستطيع تحديده. إن كنت تعرف اسمًا
      من أحاديث العائلة، فيسرّ فريق العمل أن يسمع منك — فتعريفٌ واحد قد يفكّ صفحة كاملة.</p>

      <h2>الاطّلاع</h2>
      <p>صُوِّرت الدفاتر صفحةً صفحة. النسخ الرقمية متاحة لأفراد العائلة عند الطلب،
      وتبقى الأصول في التخزين الأرشيفي.</p>
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
    titleAr: "من الأرشيف: مدينة الكويت في الستينيات",
    excerptAr:
      "اثنتا عشرة صورة من مجموعة العائلة، جرت رقمنتها حديثًا — الميناء، وأول دكان، وعقدٌ من اللقاءات.",
    authorAr: "فريق عمل الأرشيف",
    bodyAr: `
      <p class="lede">مختارات من الدفعة الثانية من الأفلام السالبة التي جرت رقمنتها، تغطّي ما بين
      1961 و1969 تقريبًا.</p>

      <p>جاءت هذه اللقطات من علبة أحذية واحدة، بلا أي بيانات. وكان تأريخها جهدًا جماعيًا —
      طُرز السيارات، وواجهات المحال، وفي حالة واحدة إعلان سينما ظاهر ضيَّق عدة صور إلى
      حدود شهر واحد.</p>

      <h2>الميناء</h2>
      <p>أربعٌ من الاثنتي عشرة تُظهر واجهة الميناء القديم. وهي أقدم الصور الملوّنة في
      المجموعة، والوحيدة التي نملكها للمخزن الأصلي.</p>

      <h2>اللقاءات</h2>
      <p>أما البقية فمناسبات عائلية: عرسان، وغداء عيد، وسلسلة طويلة التُقطت في عصر يوم
      واحد في فناء لم نتعرّف عليه بعد.</p>

      <h2>ساعدونا في التعريف</h2>
      <p>تُحفظ مطبوعات الصور الاثنتي عشرة جميعها في بيت العائلة، ويمكن إرسال النسخ الرقمية
      عند الطلب. إن استطعت تسمية وجه أو مكان، فاكتب إلينا — فكل تعريف نضيفه يجعل تأريخ
      الدفعة التالية أيسر.</p>
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
    titleAr: "اكتمال ترميم المجلس",
    excerptAr:
      "بعد أربعة عشر شهرًا من العمل، أُعيد افتتاح مجلس بيت العائلة — أبوابه الأصلية، وجصّه الأصلي، وكل ما عدا ذلك جديد.",
    authorAr: "مجلس العائلة",
    bodyAr: `
      <p class="lede">بدأ الترميم في فبراير 2025 بتكليف بسيط: احفظ ما يمكن حفظه، ولا تستبدل
      إلا ما لا سبيل إلى حفظه، ولا تغيّر شيئًا لمجرّد الذوق.</p>

      <h2>ما حُفظ</h2>
      <ul>
        <li>الأبواب المنقوشة، جُرِّدت وأُصلحت وأُعيد دهنها بدل استبدالها.</li>
        <li>الحنايا الجصّية على طول الجدار الغربي.</li>
        <li>الأرضية — رُفعت، ورُقِّمت، وأُعيد فرشها.</li>
      </ul>

      <h2>ما استُبدل</h2>
      <p>الأسلاك، والسباكة، وهيكل السقف فوق الجناح الشرقي الذي رُقِّع مرات أكثر من أن
      يُرقَّع مرة أخرى. والعمل الجديد بسيط عن قصد كي يُقرأ بوصفه جديدًا.</p>

      <h2>استخدام المجلس</h2>
      <p>المجلس متاح لأي فرد من العائلة للقاءات والعزاء واجتماعات اللجان.
      ويكون الحجز عبر مجلس العائلة.</p>
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
    titleAr: "لماذا نحفظ سجلًّا",
    excerptAr:
      "ملاحظة في الغرض من هذا الموقع: ليس حنينًا، بل سجلًّا عمليًّا يستطيع الجيل القادم أن يستعمله فعلًا.",
    authorAr: "مجلس العائلة",
    bodyAr: `
      <p class="lede">تتذكّر معظم العائلات ثلاثة أجيال إلى الوراء ولا تزيد. فيصير الرابع
      اسمًا، والخامس إشاعة. وُجد هذا الموقع ليُبطئ ذلك.</p>

      <h2>سجلٌّ لا نَصْبٌ تذكاري</h2>
      <p>ليس المقصد الاحتفاء. المقصد أن نكتب الأشياء ما دام مَن يعرفها بيننا ليصحّح لنا —
      من سكن أين، ومن تزوّج مَن، وأيّ عمل بدأ في أي سنة، ولماذا اتُّخذ قرارٌ على النحو
      الذي اتُّخذ به.</p>

      <h2>ثلاثة التزامات</h2>
      <ul>
        <li><strong>الدقّة قبل الأناقة.</strong> التاريخ غير المؤكَّد يُعلَّم بأنه غير مؤكَّد.</li>
        <li><strong>الخصوصية أولًا.</strong> لا يُنشر شيء عن فرد حيّ من العائلة دون موافقته.</li>
        <li><strong>الديمومة.</strong> ملفات بسيطة، وصيغ مفتوحة، ولا اعتماد على خدمة قد لا
        تكون موجودة بعد عشرين سنة.</li>
      </ul>

      <blockquote>نحن لا نكتب لأنفسنا. نكتب لمن سيفتح هذا في عام 2070 ويريد أن يعرف
      ما الذي حدث فعلًا.</blockquote>

      <h2>ساهِم</h2>
      <p>التصحيحات لا تقلّ قيمةً عن الإضافات. إن كان هنا خطأ، فأخبرنا عبر
      <a href="contact.html">صفحة التواصل</a> وسيُصحَّح.</p>
    `,
  },
];
