/* =============================================================================
   ARABIC STRING TABLE — content/i18n.js
   =============================================================================

   English is the source language: it lives in the HTML and in the scripts.
   This file holds only the Arabic. When the language is switched to Arabic,
   every element carrying data-i18n="key" has its content replaced from here,
   and every string the scripts render comes from here too.

   >>> THE ONE THING TO CHECK FIRST <<<
   `brand.family` below is our best transliteration of the family name into
   Arabic — we could not verify how the family actually spells it. Correct it
   here and it updates across the whole site: every string that names the family
   uses the {family} token rather than spelling it out.

   TOKENS
     {family}  → brand.family
     {year}    → the current year
     {n}       → a count
     {email}   → the contact address

   ADDING A STRING
     1. Add the key here.
     2. In HTML:  <p data-i18n="home.heroLede">English text…</p>
        In JS:    t("blog.read", "Read")      ← English default is the 2nd arg
     The English stays where it is; nothing is duplicated.
   ========================================================================== */

window.ALMAIL = window.ALMAIL || {};

window.ALMAIL.ar = {
  /* ---------------------------------------------------------------- brand */
  "brand.family": "آل مايل",          /* ← verify this spelling */

  /* ------------------------------------------------------------ interface */
  "nav.home": "الرئيسية",
  "nav.heritage": "التراث",
  "nav.directory": "الدليل",
  "nav.journal": "الأخبار",
  "nav.contact": "تواصل",
  "nav.cta": "تواصل معنا",
  "nav.skip": "تخطَّ إلى المحتوى",
  "nav.menuOpen": "فتح القائمة",
  "nav.menuClose": "إغلاق القائمة",
  "nav.home.aria": "عائلة {family} — الصفحة الرئيسية",
  "nav.primary": "التنقّل الرئيسي",
  "nav.mobile": "قائمة الجوال",

  "theme.toDark": "التبديل إلى الوضع الداكن",
  "theme.toLight": "التبديل إلى الوضع الفاتح",

  "lang.switch": "تغيير اللغة",
  "lang.toArabic": "العربية",
  "lang.toEnglish": "English",

  /* --------------------------------------------------------------- footer */
  "footer.about": "البوابة الخاصة بعائلة {family} — سجلٌّ لأهلنا، وتاريخنا، والعمل الذي نقوم به معًا. مدينة الكويت، الكويت.",
  "footer.explore": "تصفَّح",
  "footer.reach": "للتواصل",
  "footer.address": "مدينة الكويت، دولة الكويت",
  "footer.nav": "روابط أسفل الصفحة",
  "footer.rights": "© {year} عائلة {family}. جميع الحقوق محفوظة.",
  "footer.made": "صُنع بعناية في الكويت.",

  /* ------------------------------------------------------------- homepage */
  "home.heroEyebrow": "مدينة الكويت &nbsp;·&nbsp; سجلٌّ موثَّق منذ 1938",
  "home.heroTitle": "بوابة عائلة<br>{family}",
  "home.heroLede": "سجلٌّ لأهلنا، وتاريخنا، والعمل الذي نقوم به معًا — نحفظه ببساطة، ونحفظه للجيل القادم.",
  "home.ctaDirectory": "تصفَّح الدليل",
  "home.ctaHeritage": "تراثنا",
  "home.statMembers": "الأعضاء المُدرجون",
  "home.statYears": "السنوات الموثَّقة",
  "home.statImages": "الصور المؤرشفة",
  "home.exploreHeading": "تصفَّح البوابة",
  "home.c1eyebrow": "01 — التاريخ",
  "home.c1title": "التراث والجذور",
  "home.c1body": "خطٌّ زمنيٌّ مؤرَّخ لعائلتنا في الكويت، من أقدم سجلٍّ مكتوب حتى اليوم.",
  "home.c1link": "اعرض الخط الزمني",
  "home.c2eyebrow": "02 — الأشخاص",
  "home.c2title": "دليل الأعضاء",
  "home.c2body": "من نحن وماذا نعمل — قابلٌ للبحث بالاسم والمهنة وفرع العائلة.",
  "home.c2link": "افتح الدليل",
  "home.c3eyebrow": "03 — الآن",
  "home.c3title": "الأخبار",
  "home.c3body": "إعلانات، ولقاءات، ومقالات من الأرشيف، ومختارات مصوَّرة.",
  "home.c3link": "اقرأ الأخبار",
  "home.latestEyebrow": "آخر الأخبار",
  "home.latestTitle": "أخبار العائلة",
  "home.allPosts": "كل المنشورات",
  "home.noscript": "فعِّل جافاسكربت لقراءة آخر المنشورات، أو <a class=\"link-underline\" href=\"blog.html\">زُر صفحة الأخبار</a>.",
  "home.quoteEyebrow": "لماذا هذه البوابة",
  "home.quote": "«نحن لا نكتب لأنفسنا. نكتب لمن سيفتح هذا في عام 2070 ويريد أن يعرف ما الذي حدث فعلًا.»",
  "home.quoteAttr": "مجلس عائلة {family}",
  "home.ctaEyebrow": "شارِكنا",
  "home.ctaTitle": "أضِف إلى السجل",
  "home.ctaLede": "تصحيحٌ، أو صورة، أو اسمٌ كتبناه خطأً، أو ملفٌّ ينبغي إدراجه — كل ذلك مُرحَّبٌ به، وكل ذلك يفيد.",
  "home.ctaContact": "تواصل مع المجلس",
  "home.ctaAnnouncements": "اقرأ الإعلانات",

  /* ------------------------------------------------------------- heritage */
  "heritage.eyebrow": "التراث",
  "heritage.title": "من أين<br>جاءت العائلة",
  "heritage.lede": "سجلٌّ مؤرَّخ لعائلة {family} في الكويت — ما نستطيع توثيقه، وما ورثناه، وما لا يزال غير مؤكَّد.",
  "heritage.timelineHeading": "الخط الزمني للعائلة",
  "heritage.noscript": "يحتاج الخط الزمني إلى جافاسكربت لعرضه. السجل الكامل محفوظ أيضًا في بيت العائلة.",
  "heritage.archiveEyebrow": "الأرشيف",
  "heritage.archiveTitle": "محفوظٌ ومفهرَس<br>ومتاحٌ للعائلة",
  "heritage.stat1": "صورة جرت رقمنتها",
  "heritage.stat2": "دفاتر تجارية، 1938–1961",
  "heritage.stat3": "سنة من السجل المتصل",
  "heritage.archiveBody": "النسخ الرقمية متاحة لأي فرد من العائلة عند الطلب، والأصول محفوظة في تخزين أرشيفي. إن كنت تملك رسائل أو صورًا أو وثائق تنتمي إلى المجموعة، يسرّ فريق الأرشيف أن يسمع منك.",
  "heritage.archiveCta": "ساهِم في الأرشيف",

  /* ------------------------------------------------------------ directory */
  "directory.eyebrow": "الدليل",
  "directory.title": "أهل<br>العائلة",
  "directory.lede": "أفراد عائلة {family}، وأعمالهم، وأماكن إقامتهم. ابحث بالاسم أو المهنة أو المدينة، أو صنِّف حسب الفرع.",
  "directory.searchPh": "ابحث بالاسم أو المهنة أو المدينة",
  "directory.searchLabel": "البحث في الأعضاء",
  "directory.filterLabel": "تصفية حسب فرع العائلة",
  "directory.membersHeading": "الأعضاء",
  "directory.empty": "لا يوجد أعضاء مطابقون لهذا البحث. جرّب اسمًا أو مهنة أو فرعًا آخر.",
  "directory.noscript": "يحتاج الدليل إلى جافاسكربت لعرضه.",
  "directory.ctaTitle": "هل ينبغي إدراجك هنا؟",
  "directory.ctaBody": "تُضاف الملفات بموافقة صاحبها فقط. أرسل لنا ما تودّ إظهاره — وأخبرنا بما تفضّل عدم نشره.",
  "directory.ctaButton": "اطلب الإدراج",
  "directory.all": "الكل",

  "link.email": "البريد الإلكتروني",
  "link.linkedin": "لينكدإن",
  "link.x": "إكس",
  "link.instagram": "إنستغرام",
  "link.website": "الموقع الإلكتروني",

  /* -------------------------------------------------------------- journal */
  "blog.eyebrow": "الأخبار",
  "blog.title": "أخبارٌ وملاحظات<br>ومن الأرشيف",
  "blog.lede": "إعلانات من مجلس العائلة، وملاحظات من اللقاءات، ومقالات مستخرجة من الأرشيف، وصور فور رقمنتها.",
  "blog.searchPh": "ابحث في المنشورات",
  "blog.searchLabel": "البحث في المنشورات",
  "blog.filterLabel": "تصفية حسب التصنيف",
  "blog.allHeading": "كل المنشورات",
  "blog.empty": "لا شيء يطابق هذا البحث. جرّب كلمة أخرى، أو أزِل عوامل التصفية.",
  "blog.noscript": "تحتاج صفحة الأخبار إلى جافاسكربت لعرض المنشورات.",
  "blog.all": "الكل",
  "blog.read": "اقرأ",
  "blog.readFull": "اقرأ المنشور كاملًا",

  /* Post categories — the four the journal filters by. */
  "cat.Events": "مناسبات",
  "cat.Announcements": "إعلانات",
  "cat.Articles": "مقالات",
  "cat.Photo Highlights": "مختارات مصوَّرة",

  /* --------------------------------------------------------------- article */
  "post.allPosts": "كل المنشورات",
  "post.by": "بقلم",
  "post.minRead": "دقيقة قراءة",
  "post.share": "شارِك هذا المنشور",
  "post.copy": "انسخ الرابط",
  "post.copied": "تم نسخ الرابط",
  "post.prev": "السابق",
  "post.next": "التالي",
  "post.moreNav": "منشورات أخرى",
  "post.nfTitle": "لم نتمكّن من العثور على هذا المنشور",
  "post.nfBody": "ربما جرى تغيير اسمه أو حذفه. تجد كل ما نشرناه في صفحة الأخبار.",
  "post.nfCta": "العودة إلى الأخبار",

  /* --------------------------------------------------------------- contact */
  "contact.eyebrow": "تواصل",
  "contact.title": "تواصل معنا",
  "contact.lede": "التصحيحات، والمساهمات في الأرشيف، والأسئلة عن صندوق التعليم، أو طلب الإدراج في الدليل — كل ذلك يصل إلى هنا.",
  "contact.name": "اسمك",
  "contact.namePh": "الاسم الكامل",
  "contact.email": "البريد الإلكتروني",
  "contact.subject": "الموضوع",
  "contact.subjectPh": "اختر موضوعًا",
  "contact.s1": "مساهمة في الأرشيف أو تصحيح",
  "contact.s2": "الإدراج في الدليل",
  "contact.s3": "صندوق التعليم",
  "contact.s4": "المناسبات واللقاءات",
  "contact.s5": "شيء آخر",
  "contact.message": "الرسالة",
  "contact.messagePh": "أخبرنا بما تودّ مشاركته.",
  "contact.submit": "أرسل الرسالة",
  "contact.replyNote": "نردّ عادةً خلال أيام قليلة.",
  "contact.errName": "من فضلك أدخل اسمك.",
  "contact.errEmail": "من فضلك أدخل بريدًا إلكترونيًا صحيحًا.",
  "contact.errSubject": "من فضلك اختر موضوعًا.",
  "contact.errMessage": "من فضلك اكتب 20 حرفًا على الأقل.",
  "contact.errSummary": "من فضلك راجع الحقول المُعلَّمة وحاول مرة أخرى.",
  "contact.sending": "جارٍ الإرسال…",
  "contact.mailto": "يجري فتح تطبيق البريد لديك والرسالة جاهزة للإرسال.",
  "contact.sent": "شكرًا لك — وصلت رسالتك، وسنتواصل معك قريبًا.",
  "contact.failed": "تعذّر إرسال رسالتك. يرجى مراسلتنا مباشرة على {email}.",
  "contact.directTitle": "مباشرةً",
  "contact.directNote": "لأي شيء لا يحتاج إلى نموذج.",
  "contact.houseTitle": "بيت العائلة",
  "contact.houseNote": "الزيارات بالتنسيق مع المجلس.",
  "contact.committeesTitle": "اللجان",
  "contact.c1": "<span class=\"text-ink\">الأرشيف</span> &mdash; الصور والدفاتر والتصحيحات",
  "contact.c2": "<span class=\"text-ink\">التعليم</span> &mdash; صندوق العائلة",
  "contact.c3": "<span class=\"text-ink\">المجلس</span> &mdash; البيت واللقاءات وكل ما عدا ذلك",
  "contact.privacy": "من فضلك لا ترسل بيانات أفراد آخرين من العائلة دون موافقتهم.",

  /* ------------------------------------------------------------------- 404 */
  "nf.title": "هذه الصفحة غير موجودة",
  "nf.body": "قد يكون الرابط قديمًا، أو جرى تغيير اسم الصفحة. كل ما في البوابة متاحٌ من الأقسام الأربعة أدناه.",

  /* ----------------------------------------------------------------- misc */
  "misc.cardsHere": "البطاقات تُدرَج هنا",
};

/* -----------------------------------------------------------------------------
   Arabic counts. Arabic marks one, two, a few (3–10) and many (11+) differently,
   so a single plural form would read wrong. These return the whole phrase.
   -------------------------------------------------------------------------- */
window.ALMAIL.arCount = {
  posts: function (n) {
    if (n === 0) return "لا منشورات";
    if (n === 1) return "منشور واحد";
    if (n === 2) return "منشوران";
    if (n <= 10) return n + " منشورات";
    return n + " منشورًا";
  },
  members: function (n) {
    if (n === 0) return "لا أعضاء";
    if (n === 1) return "عضو واحد";
    if (n === 2) return "عضوان";
    if (n <= 10) return n + " أعضاء";
    return n + " عضوًا";
  },
};
