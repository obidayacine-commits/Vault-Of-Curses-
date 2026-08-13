const ITEMS_PER_PAGE = 8;
let currentPage   = 1;
let currentItems  = [];
let contentData   = [];
let currentMode   = 'full'; // 'full' للأخبار | 'pin' للصور | 'video' للفيديوهات

const grid       = document.getElementById('content-grid');
const tabBtns    = document.querySelectorAll('.tab-btn');
const newsFilter = document.getElementById('news-filter');
const newsBtns   = document.querySelectorAll('.news-btn');
const searchBox   = document.getElementById('search-box');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const cardModal        = document.getElementById('card-modal');
const cardModalContent = document.getElementById('card-modal-content');
const cardModalClose   = document.getElementById('card-modal-close');

let currentTab        = 'news';
let currentNewsFilter = 'all';
let currentSearch     = '';

// ---- نصوص عربية ثابتة (الموقع بالعربية فقط) ----
const AR_TEXT = {
  'read-more': 'قراءة المزيد',
  'read-less': 'عرض أقل',
  'download':  'تحميل',
  'load-more': 'تحميل المزيد'
};
function t(key) {
  return AR_TEXT[key] || key;
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

// ---- بناء بطاقة كاملة (الأخبار + محتوى نافذة التفاصيل) ----
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

// ---- بناء صورة مصغّرة بأسلوب Pinterest (للصور فقط) ----
function buildThumb(item) {
  const thumb = document.createElement('div');
  thumb.className = 'pin-thumb';
  thumb.innerHTML = `<img src="${item.img}" alt="${item.title || ''}" loading="lazy">`;
  thumb.addEventListener('click', () => openCardModal(item));
  cardObserver.observe(thumb);
  return thumb;
}

// ---- بناء مصغّرة مستطيلة بأسلوب قوائم الفيديو (للفيديوهات فقط) ----
function buildVideoThumb(item) {
  const thumb = document.createElement('div');
  thumb.className = 'video-thumb';
  thumb.innerHTML = `
    <div class="video-thumb-img-wrap">
      <img src="${item.poster || item.video}" alt="${item.title || ''}" loading="lazy">
      ${item.duration ? `<span class="video-duration">${item.duration}</span>` : ''}
    </div>
    <p class="video-thumb-title">${item.title || ''}</p>
  `;
  thumb.addEventListener('click', () => openCardModal(item));
  cardObserver.observe(thumb);
  return thumb;
}

// ---- نافذة تفاصيل البطاقة ----
function openCardModal(item) {
  cardModalContent.innerHTML = '';
  cardModalContent.appendChild(buildCard(item, 0));
  cardModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCardModal() {
  cardModal.classList.remove('open');
  cardModalContent.innerHTML = '';
  document.body.style.overflow = '';
}
if (cardModalClose) cardModalClose.addEventListener('click', closeCardModal);
if (cardModal) {
  cardModal.addEventListener('click', (e) => {
    if (e.target === cardModal) closeCardModal();
  });
}

// ---- رسم دفعة من العناصر ----
function renderBatch(items, append, mode) {
  if (!append) grid.innerHTML = '';

  const fragment = document.createDocumentFragment();
  items.forEach((item, i) => {
    let node;
    if (mode === 'pin')   node = buildThumb(item);
    else if (mode === 'video') node = buildVideoThumb(item);
    else node = buildCard(item, i);
    fragment.appendChild(node);
  });
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
  btn.textContent = t('load-more');
  btn.addEventListener('click', debounce(loadMore, 300));
  grid.after(btn);
}

function loadMore() {
  currentPage++;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end   = Math.min(start + ITEMS_PER_PAGE, currentItems.length);
  renderBatch(currentItems.slice(start, end), true, currentMode);
  if (end >= currentItems.length) removeLoadMoreBtn();
}

// ---- عرض المحتوى الرئيسي ----
function renderContent(tab, newsFltr, search) {
  currentPage = 1;
  removeLoadMoreBtn();

  let filtered = contentData.filter(item => item.type === tab);

  if (tab === 'news' && newsFltr !== 'all')
    filtered = filtered.filter(item => item.category === newsFltr);

  if ((tab === 'pictures' || tab === 'videos') && search && search.trim() !== '') {
    const q = search.trim().toLowerCase();
    filtered = filtered.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.character && item.character.toLowerCase().includes(q))
    );
  }

  currentItems = filtered;
  currentMode  = tab === 'pictures' ? 'pin' : (tab === 'videos' ? 'video' : 'full');
  grid.classList.toggle('pin-grid', currentMode === 'pin');
  grid.classList.toggle('video-grid', currentMode === 'video');

  if (!filtered.length) {
    grid.innerHTML = '<p class="no-results">لا يوجد محتوى لهذا التصنيف بعد.</p>';
    return;
  }

  renderBatch(filtered.slice(0, ITEMS_PER_PAGE), false, currentMode);

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
    currentSearch = '';
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';
    newsBtns.forEach(b => b.classList.remove('active'));
    newsBtns[0].classList.add('active');

    if (currentTab === 'news') {
      newsFilter.style.display = 'block';
      if (searchBox) searchBox.style.display = 'none';
    } else {
      newsFilter.style.display = 'none';
      if (searchBox) searchBox.style.display = 'flex';
    }
    renderContent(currentTab, currentNewsFilter, currentSearch);
  }, 200));
});

// ---- فلتر الأخبار ----
newsBtns.forEach(btn => {
  btn.addEventListener('click', debounce(() => {
    if (btn.classList.contains('active')) return;
    newsBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentNewsFilter = btn.getAttribute('data-news');
    renderContent(currentTab, currentNewsFilter, currentSearch);
  }, 200));
});

// ---- صندوق البحث (الصور والفيديوهات) ----
if (searchInput) {
  searchInput.addEventListener('input', debounce(() => {
    currentSearch = searchInput.value;
    if (searchClear) searchClear.style.display = currentSearch ? 'flex' : 'none';
    renderContent(currentTab, currentNewsFilter, currentSearch);
  }, 250));
}
if (searchClear) {
  searchClear.addEventListener('click', () => {
    currentSearch = '';
    searchInput.value = '';
    searchClear.style.display = 'none';
    renderContent(currentTab, currentNewsFilter, currentSearch);
  });
}

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
grid.innerHTML = `
  <div class="loading-msg">
    <span class="loading-spinner"></span>
    جاري التحميل...
  </div>
`;

if (typeof db !== 'undefined') {
  db.collection('content').orderBy('createdAt', 'desc').get()
    .then(snapshot => {
      if (!snapshot.empty) contentData = snapshot.docs.map(doc => doc.data());
      renderContent('news', 'all', '');
    })
    .catch(() => renderContent('news', 'all', ''));
} else {
  renderContent('news', 'all', '');
}
