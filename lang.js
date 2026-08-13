
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
