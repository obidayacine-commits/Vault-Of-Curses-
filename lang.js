// ===== نظام الترجمة =====
const LANG_KEY = 'voc_lang';

const translations = {
  // ناف
  'nav-home':    { en: 'Home',           ar: 'الرئيسية' },
  'nav-about':   { en: 'About',          ar: 'حول' },
  'nav-dmca':    { en: 'DMCA & Contact', ar: 'DMCA والتواصل' },

  'cta-browse':   { en: 'Browse Now',   ar: 'تصفح الآن'},
  // تبويبات الرئيسية
  'tab-news':     { en: 'News',     ar: 'الأخبار' },
  'tab-pictures': { en: 'Pictures', ar: 'الصور' },
  'tab-videos':   { en: 'Videos',   ar: 'الفيديوهات' },

  // فلتر الأخبار
  'nf-all':       { en: 'All',               ar: 'الكل' },
  'nf-schedule':  { en: 'Episode Schedule',  ar: 'مواعيد نزول الحلقات' },
  'nf-author':    { en: 'Author Statements', ar: 'تصريحات الكاتب' },
  'nf-fans':      { en: 'Fan Opinions',      ar: 'آراء الفانز' },
  'nf-important': { en: 'Important',         ar: 'مُهِمة' },

  // فلتر الشخصيات
  'cf-all':    { en: 'All',    ar: 'الكل' },
  'cf-gojo':   { en: 'Gojo',   ar: 'غوجو' },
  'cf-sukuna': { en: 'Sukuna', ar: 'سوكونا' },
  'cf-toji':   { en: 'Toji',   ar: 'توجي' },
  'cf-megumi': { en: 'Megumi', ar: 'ميغومي' },
  'cf-yoji':   { en: 'Yoji',   ar: 'يوجي' },
  'cf-suguru': { en: 'Suguru', ar: 'سوغورو' },
  'cf-shosso': { en: 'Shosso', ar: 'شوسو' },
  'cf-yuta':   { en: 'Yuta',   ar: 'يوتا' },

  // صفحة About
  'about-page-title':    { en: 'About Vault Of Curses', ar: 'Vault of Curses حول' },
  'about-dark-p':        { en: 'Vault of Curses is an unofficial website dedicated to fans of the anime Jujutsu Kaisen . Our goal is to collect high-quality content in one tidy and easy-to-browse place. The site is constantly renewed with new additions.This website was created as a hobby for anime fans. Some of the content used belongs to its original owners, and we simply organize and display it for our followers. We already have our own content on the site, so we do not claim ownership of any anime, images, videos, or news found here. If you have any suggestions or notice any content that should be removed due to copyright infringement, please contact us as soon as possible.', ar: ' قبو اللعنات : هو موقع غير رسمي مخصص لمحبي أنمي جوجوتسو كايسن. هدفنا هو جمع محتوى عالي الجودة في مكان واحد منظم وسهل التصفح. يتم تحديث الموقع باستمرار بإضافات جديدة.تم إنشاء هذا الموقع كهواية لمحبي الأنمي. بعض المحتويات المستخدمة تعود ملكيتها لأصحابها الأصليين، ونحن نقوم فقط بتنظيمها وعرضها للمتابعين. لدينا محتوانا الخاص بنا بالفعل على الموقع ، لذلك لا ندّعي أي ملكية للأنمي أو لبعض الصور و الفيديوهات و الأخبار الموجودة على الموقع. إذا كان لديكم أي اقتراح أو لاحظتم أي محتوى يجب حذفه لمخالفته حقوق النشر، يُرجى التواصل معنا في أقرب وقت ممكن.' },
  'about-sidebar-title': { en: "What You'll Find", ar: 'ما ستجده' },
  'about-sidebar-p':     { en: 'Everything related to the Jujutsu Kaisen anime: the latest news and statements, a gallery of high-resolution images and videos. Everything is organized and arranged for quick access.', ar:'كل ما يخص انمي جوجيتسو كايسن : آخر الأخبار و التصريحات ، معرض للصور و الفيديوهات بدقة عالية . كل شيء منظم و مرتب ليسهل الوصول اليه بسرعة '},

  // صفحة DMCA & Contact
  'dmca-page-title':   { en: 'DMCA Notice',       ar: 'DMCA إشعار' },
  'dmca-h3-copyright': { en: 'Copyright Policy',  ar: 'سياسة حقوق الملكية' },
  'dmca-p-copyright':  { en: 'Vault Of Curses respects the intellectual property rights of others. Some of the images and videos displayed are the property of their respective owners, particularly MAPPA Ltd. and author Gigi Akutami.', ar: 'نحن نحترم حقوق الملكية الفكرية للآخرين. بعض الصور ومقاطع الفيديو المعروضة هي ملك لأصحابها المعنيين،  وخاصة شركة MAPPA  والمؤلف جيجي أكوتامي.'},
  'dmca-h3-disclaimer':{ en: '1. Disclaimer',     ar: '1. إخلاء المسؤولية' },
  'dmca-p-disclaimer': { en: 'We are not responsible for the use of images and videos in a way that violates our publishing policy when downloading or sharing them with others.', ar: 'نحن لسنا مسؤولين عن استخدام الصور ومقاطع الفيديو بطريقة تنتهك سياسة النشر عند تنزيلها او مشاركتها مع الآخرين ' },
  'dmca-h3-procedure': { en: '2. Procedure for Reporting Infringement', ar: '2. إجراءات الإبلاغ عن الانتهاك' },
  'dmca-p-procedure':  { en: 'If you believe that a protected work has been posted on our site in a manner that constitutes infringement, please provide us with:', ar: 'إذا كنت تعتقد أن عملاً محمياً قد نُشر على موقعنا بطريقة تشكل انتهاكاً، يرجى تزويدنا بـ:' },
  'dmca-li-1': { en: '1. Your physical or electronic signature.', ar: '1. توقيعك الورقي أو الإلكتروني.' },
  'dmca-li-2': { en: '2. Identification of the protected work that you claim has been infringed.', ar: '2. تحديد العمل المحمي الذي تدّعي انتهاكه.' },
  'dmca-li-3': { en: '3. A direct link to the infringing material on our site.', ar: '3. رابط مباشر للمحتوى المنتهَك على موقعنا.' },
  'dmca-li-4': { en: '4. Your contact information: email address.', ar: '4. معلومات الاتصال الخاصة بك: البريد الإلكتروني.' },
  'dmca-li-5': { en: '5. A statement that the use is not authorized by the owner.', ar: '5. إقرار بأن الاستخدام غير مصرح به من قبل المالك.'},
  'dmca-li-6': { en: '6. A statement that the information is accurate under penalty of perjury.', ar: '6.إقرار بصحة المعلومات تحت طائلة الحنث باليمين .' },
  'contact-title':     { en: 'Contact Us',      ar: 'تواصل معنا' },
  'contact-h3':        { en: 'How to Contact',  ar: 'طريقة التواصل' },
  // أزرار البطاقات
  'read-more': { en: 'Read More', ar: 'عرض المزيد' },
  'read-less': { en: 'Read Less', ar: 'عرض أقل' },
  'download':  { en: '⬇ Download', ar: '⬇ تنزيل' },

  'lang-btn-label':{ en: '🌐 العربية', ar: '🌐 English' },
};

function applyLang(lang) {
  document.documentElement.lang = lang;

  // نضيف class على body لتفعيل RTL على المحتوى فقط (لا الهيدر)
  if (lang === 'ar') {
    document.body.classList.add('lang-ar');
  } else {
    document.body.classList.remove('lang-ar');
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key] && translations[key][lang] !== undefined) {
      el.textContent = translations[key][lang];
    }
  });

  // حفظ الاختيار
  localStorage.setItem(LANG_KEY, lang);

  // تحديث نص زر اللغة
  const btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    btn.textContent = translations['lang-btn-label'][lang];
    btn.setAttribute('data-current-lang', lang);
  }
}

function initLang() {
  const saved = localStorage.getItem(LANG_KEY) || 'en';
  applyLang(saved);
}

document.addEventListener('DOMContentLoaded', () => {
  initLang();

  const btn = document.getElementById('lang-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = btn.getAttribute('data-current-lang') || 'en';
      applyLang(current === 'en' ? 'ar' : 'en');
    });
  }
});
