const ITEMS_PER_PAGE = 8;
let currentPage   = 1;
let currentItems  = [];
let contentData   = [];

const grid       = document.getElementById('content-grid');
const tabBtns    = document.querySelectorAll('.tab-btn');
const newsFilter = document.getElementById('news-filter');
const charFilter = document.getElementById('char-filter');
const newsBtns   = document.querySelectorAll('.news-btn');
const charBtns   = document.querySelectorAll('.char-btn');

let currentTab        = 'news';
let currentNewsFilter = 'all';
let currentChar       = 'all';

// ---- مساعد الترجمة ----
function t(key) {
  const lang = localStorage.getItem('voc_lang') || 'en';
  return (typeof translations !== 'undefined' && translations[key])
    ? translations[key][lang] : key;
}

// ---- debounce ----
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ---- IntersectionObserver لأنيميشن ظهور البطاقات ----
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

// ---- تنزيل ملف (blob) ----
async function downloadFile(url, filename) {
  const btn = event && event.target;
  if (btn) { btn.textContent = '⏳'; btn.disabled = true; }
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('fetch failed');
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename || url.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
  } catch {
    window.open(url, '_blank');
  } finally {
    if (btn) { btn.textContent = t('download'); btn.disabled = false; }
  }
}

// ---- بناء بطاقة واحدة ----
function buildCard(item, index) {
  const card = document.createElement('div');
  card.className = 'instagram-card';
  const descId = `desc-${Date.now()}-${index}`;

  if (item.type === 'news') {
    card.innerHTML = `
      <div class="insta-header">
        <span class="insta-author">${item.author || 'Vault of Curses'}</span>
        ${item.date ? `<span class="insta-date">${item.date}</span>` : ''}
      </div>
      <h3 class="insta-title">${item.title}</h3>
      ${item.desc ? `
        <p class="insta-desc" id="${descId}">${item.desc}</p>
        <button class="read-more-btn" data-target="${descId}">${t('read-more')}</button>
      ` : ''}
      ${item.img ? `<img src="${item.img}" alt="${item.title}" loading="lazy">` : ''}
    `;
  } else if (item.type === 'videos') {
    card.innerHTML = `
      <div class="insta-header">
        <span class="insta-author">${item.author}</span>
        <button class="download-btn" data-src="${item.video}" data-name="${item.title}.mp4">${t('download')}</button>
      </div>
      <h3 class="insta-title">${item.title}</h3>
      <video src="${item.video}" poster="${item.poster}" controls preload="none" loading="lazy"></video>
    `;
  } else {
    card.innerHTML = `
      <div class="insta-header">
        <span class="insta-author">${item.author}</span>
        <button class="download-btn" data-src="${item.img}" data-name="${item.title}.jpg">${t('download')}</button>
      </div>
      <h3 class="insta-title">${item.title}</h3>
      <img src="${item.img}" alt="${item.title}" loading="lazy">
    `;
  }

  cardObserver.observe(card);
  return card;
}

// ---- رسم دفعة من العناصر ----
function renderBatch(items, append) {
  if (!append) grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  items.forEach((item, i) => fragment.appendChild(buildCard(item, i)));
  grid.appendChild(fragment);
}

// ---- زر "تحميل المزيد" ----
function removeLoadMoreBtn() {
  const old = document.getElementById('load-more-btn');
  if (old) old.remove();
}

function addLoadMoreBtn() {
  removeLoadMoreBtn();
  const btn = document.createElement('button');
  btn.id        = 'load-more-btn';
  btn.className = 'load-more-btn';
  btn.textContent = t('load-more') || 'Load More';
  btn.addEventListener('click', debounce(loadMore, 300));
  grid.after(btn);
}

function loadMore() {
  currentPage++;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end   = Math.min(start + ITEMS_PER_PAGE, currentItems.length);
  renderBatch(currentItems.slice(start, end), true);
  if (end >= currentItems.length) removeLoadMoreBtn();
}

// ---- عرض المحتوى الرئيسي ----
function renderContent(tab, newsFltr, char) {
  currentPage = 1;
  removeLoadMoreBtn();

  let filtered = contentData.filter(item => item.type === tab);

  if (tab === 'news' && newsFltr !== 'all')
    filtered = filtered.filter(item => item.category === newsFltr);

  if ((tab === 'pictures' || tab === 'videos') && char !== 'all')
    filtered = filtered.filter(item => item.character === char);

  currentItems = filtered;

  if (!filtered.length) {
    grid.innerHTML = '<p class="no-results">لا يوجد محتوى لهذا التصنيف بعد.</p>';
    return;
  }

  renderBatch(filtered.slice(0, ITEMS_PER_PAGE), false);

  if (filtered.length > ITEMS_PER_PAGE) addLoadMoreBtn();
}

// ---- التبويبات ----
tabBtns.forEach(btn => {
  btn.addEventListener('click', debounce(() => {
    if (btn.classList.contains('active')) return;
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTab = btn.getAttribute('data-tab');

    currentNewsFilter = 'all';
    currentChar = 'all';
    newsBtns.forEach(b => b.classList.remove('active'));
    newsBtns[0].classList.add('active');
    charBtns.forEach(b => b.classList.remove('active'));
    charBtns[0].classList.add('active');

    if (currentTab === 'news') {
      newsFilter.style.display = 'block';
      charFilter.style.display = 'none';
    } else {
      newsFilter.style.display = 'none';
      charFilter.style.display = 'block';
    }
    renderContent(currentTab, currentNewsFilter, currentChar);
  }, 200));
});

// ---- فلتر الأخبار ----
newsBtns.forEach(btn => {
  btn.addEventListener('click', debounce(() => {
    if (btn.classList.contains('active')) return;
    newsBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentNewsFilter = btn.getAttribute('data-news');
    renderContent(currentTab, currentNewsFilter, currentChar);
  }, 200));
});

// ---- فلتر الشخصيات ----
charBtns.forEach(btn => {
  btn.addEventListener('click', debounce(() => {
    if (btn.classList.contains('active')) return;
    charBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentChar = btn.getAttribute('data-char');
    renderContent(currentTab, currentNewsFilter, currentChar);
  }, 200));
});

// ---- تفويض الأحداث (read-more + download) ----
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('read-more-btn')) {
    const desc = document.getElementById(e.target.dataset.target);
    if (!desc) return;
    desc.classList.toggle('expanded');
    e.target.textContent = desc.classList.contains('expanded') ? t('read-less') : t('read-more');
  }
  if (e.target.classList.contains('download-btn')) {
    downloadFile(e.target.getAttribute('data-src'), e.target.getAttribute('data-name'));
  }
});

// ---- تحميل البيانات من Firebase ----
if (typeof db !== 'undefined') {
  db.collection('content').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      if (!snapshot.empty) contentData = snapshot.docs.map(doc => doc.data());
      renderContent('news', 'all', 'all');
    })
    .catch(() => renderContent('news', 'all', 'all'));
} else {
  renderContent('news', 'all', 'all');
}
