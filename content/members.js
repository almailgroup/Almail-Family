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
   years     (optional)  e.g. "1947–1997". Shown on the card under the role.
   born      (optional)  Shown in the profile's facts panel.
   died      (optional)  Shown in the profile's facts panel.
   location  (optional)  City, Country.
   bio       (required)  2–3 sentences. The card blurb.
   story     (optional)  The long biography at /member/?id=<id>. Trusted HTML:
                         <p>, <h2>, <ul>, <em>, <blockquote> all work. Give the
                         opening paragraph class="lede" for the standfirst.
                         Omit it and the profile falls back to `bio`.
   photo     (optional)  e.g. "/assets/img/members/Mansour_Abdulreda_Almail.png".
                         Omit for a monogram placeholder.
   photoDate   (optional) ISO date the photograph was taken, e.g. "1994-02-17".
   photoRights (optional) Rights note shown under the portrait.
   links     (optional)  Any of: email, linkedin, x, instagram, website.
                         Omit a key entirely to hide that icon.

   Every field has an Arabic twin: nameAr, roleAr, branchAr, locationAr, bioAr,
   storyAr, photoRightsAr. Leave one out and the English shows in both.

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
    role: "Sports journalist, broadcaster and academic",
    // TO FILL IN: which branch of the family he belongs to.
    branch: "Almail Family",
    years: "1947–1997",
    born: "1947",
    died: "1997",
    location: "Kuwait City, Kuwait",
    bio:
      "A pioneering Kuwaiti sports journalist, radio broadcaster, academic and " +
      "entrepreneur. He founded Radio Kuwait's sports department and the Youth " +
      "and Sports Radio station, and was named among ten pioneers of Kuwaiti " +
      "sports media.",

    photo: "/assets/img/members/Mansour_Abdulreda_Almail.png",
    photoDate: "1994-02-17",
    photoRights: "Copyright free",

    story:
      '<p class="lede">Mansour Abdulreda Almail (1947–1997) was a pioneering ' +
      "Kuwaiti sports journalist, radio broadcaster, academic and entrepreneur " +
      "who played a foundational role in shaping Kuwait's athletic and media " +
      "landscapes.</p>" +

      "<h2>Early life and athletics</h2>" +
      "<p>Born in Kuwait City's Sharq district, Almail earned a diploma from the " +
      "Teachers' Institute and began his career in the 1960s as a physical " +
      "education teacher. A former international gymnastics competitor, he went " +
      "on to become an international judge and served as a head judge for the " +
      "International Gymnastics Federation.</p>" +

      "<h2>Broadcasting and media</h2>" +
      "<p>Joining the Ministry of Information in 1969, Almail founded and led " +
      "Radio Kuwait's sports programming department. He went on to establish the " +
      "Youth and Sports Radio station in 1994, serving as its first director " +
      "before his appointment as Assistant Undersecretary for Radio Affairs in " +
      "1996.</p>" +

      "<h2>Print journalism</h2>" +
      "<p>Active in print journalism from the early 1970s, Almail managed sports " +
      "desks for prominent publications including Al Rai Al Aam and Al Qabas. He " +
      "held the licence and served as editor-in-chief for the magazine " +
      "<em>Dunya al Shabab wal Riyada</em> (“World of Youth and Sport”).</p>" +

      "<h2>Academia and business</h2>" +
      "<p>Outside of media, Almail was an assistant professor at Kuwait's College " +
      "of Basic Education from 1994 to 1996 and supervised graduate candidates in " +
      "physical education. He also expanded his family's commercial legacy by " +
      "founding the Almail Group in the early 1970s, which operated across " +
      "trading, contracting, transport and consumer goods.</p>" +

      "<h2>Legacy and honours</h2>" +
      "<p>Following his death in 1997, the Ministry of Information named a radio " +
      "studio in his memory, and the Kuwait Olympic Committee recognised him as " +
      "one of ten pioneering figures in the history of Kuwaiti sports media. His " +
      "legacy is also honoured through the Mansour Almail Studio, the Late " +
      "Mansour Almail Award for Best Journalist — introduced at the 16th Arabian " +
      "Gulf Cup — and an annual media football tournament held in his name.</p>",

    /* ---- Arabic ---------------------------------------------------------
       Translated from the English above. Worth a read by a native speaker
       before it is treated as final. Western digits throughout, matching the
       rest of the site (see formatDate in assets/js/site.js). */
    nameAr: "منصور عبدالرضا الميل",
    roleAr: "صحفي رياضي وإذاعي وأكاديمي",
    branchAr: "عائلة الميل",
    locationAr: "مدينة الكويت، الكويت",
    photoRightsAr: "خالية من حقوق النشر",
    bioAr:
      "صحفي رياضي وإذاعي وأكاديمي ورجل أعمال كويتي رائد. أسّس قسم البرامج " +
      "الرياضية في إذاعة الكويت وإذاعة الشباب والرياضة، واختير من بين عشرة " +
      "روّاد في الإعلام الرياضي الكويتي.",

    storyAr:
      '<p class="lede">منصور عبدالرضا الميل (1947–1997) صحفي رياضي وإذاعي ' +
      "وأكاديمي ورجل أعمال كويتي رائد، كان له دور تأسيسي في تشكيل المشهد " +
      "الرياضي والإعلامي في الكويت.</p>" +

      "<h2>النشأة والرياضة</h2>" +
      "<p>وُلد في منطقة شرق بمدينة الكويت، وحصل على دبلوم من معهد المعلمين، " +
      "وبدأ مسيرته في ستينيات القرن الماضي مدرّسًا للتربية البدنية. كان لاعب " +
      "جمباز على المستوى الدولي، ثم أصبح حكمًا دوليًا، وعمل حكمًا رئيسيًا في " +
      "الاتحاد الدولي للجمباز.</p>" +

      "<h2>الإذاعة والإعلام</h2>" +
      "<p>التحق بوزارة الإعلام عام 1969، وأسّس قسم البرامج الرياضية في إذاعة " +
      "الكويت وترأسه. ثم أنشأ إذاعة الشباب والرياضة عام 1994 وكان أول مدير " +
      "لها، قبل تعيينه وكيلًا مساعدًا لشؤون الإذاعة عام 1996.</p>" +

      "<h2>الصحافة المطبوعة</h2>" +
      "<p>عمل في الصحافة المطبوعة منذ مطلع السبعينيات، وأدار الأقسام الرياضية " +
      "في صحف بارزة منها الرأي العام والقبس. وكان صاحب امتياز مجلة " +
      "<em>دنيا الشباب والرياضة</em> ورئيس تحريرها.</p>" +

      "<h2>الأكاديمية والأعمال</h2>" +
      "<p>إلى جانب عمله الإعلامي، كان أستاذًا مساعدًا في كلية التربية الأساسية " +
      "في الكويت بين عامي 1994 و1996، وأشرف على طلبة الدراسات العليا في " +
      "التربية البدنية. كما وسّع الإرث التجاري لعائلته بتأسيس مجموعة الميل في " +
      "مطلع السبعينيات، وعملت في التجارة والمقاولات والنقل والسلع " +
      "الاستهلاكية.</p>" +

      "<h2>الإرث والتكريم</h2>" +
      "<p>بعد وفاته عام 1997، أطلقت وزارة الإعلام اسمه على أحد استوديوهات " +
      "الإذاعة، واختارته اللجنة الأولمبية الكويتية واحدًا من عشرة روّاد في " +
      "تاريخ الإعلام الرياضي الكويتي. ويُخلَّد ذكره أيضًا من خلال «استوديو " +
      "منصور الميل»، و«جائزة الراحل منصور الميل لأفضل صحفي» التي استُحدثت في " +
      "كأس الخليج العربي السادسة عشرة، ودورة سنوية لكرة القدم للإعلاميين تحمل " +
      "اسمه.</p>",
  },
];
