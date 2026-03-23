/* ════════════════════════════════════
   components.js  —  UI Builders
   ════════════════════════════════════ */

// ── BOOK CARD ──────────────────────────────────────
function bookCard(book, i = 0) {
  return `<div class="book-card" style="${stagger(i)}" onclick="openModal(${book.id})">
    <div class="book-cover">${makeCover(book)}</div>
    <div class="card-title">${book.title}</div>
    <div class="card-author">${book.author}</div>
    <span class="card-genre">${book.genre}</span>
  </div>`;
}

// ── HORIZONTAL ROW OF CARDS ───────────────────────
function bookRow(books) {
  return `<div class="book-row">${books.map((b, i) => bookCard(b, i)).join('')}</div>`;
}

// ── HOT LIST ITEM ──────────────────────────────────
function hotItem(book, rank) {
  const cls = rank <= 3 ? 'hot-rank top' : 'hot-rank';
  return `<div class="hot-item" onclick="openModal(${book.id})">
    <div class="${cls}">${rank}</div>
    <div class="hot-thumb">${makeCover(book, true)}</div>
    <div class="hot-info">
      <div class="hot-title">${book.title}</div>
      <div class="hot-author">${book.author}</div>
      <div class="hot-meta">👁 ${book.reads} · ⭐ ${book.rating}</div>
    </div>
  </div>`;
}

// ── READING PROGRESS ITEM ─────────────────────────
function readingItem(entry) {
  const b = getBook(entry.id);
  if (!b) return '';
  const left = Math.round(b.pages * (1 - entry.pct / 100));
  return `<div class="reading-item" onclick="openReader(${b.id})">
    <div class="ri-thumb">${makeCover(b, true)}</div>
    <div class="ri-info">
      <div class="ri-title">${b.title}</div>
      <div class="ri-author">by ${b.author} · ${entry.lastRead}</div>
      <div class="prog-bar"><div class="prog-fill" style="width:${entry.pct}%"></div></div>
      <div class="prog-pct">${entry.pct}% · ${left} pages left</div>
    </div>
    <button class="ri-btn">Continue</button>
  </div>`;
}

// ── FEATURED STRIP ────────────────────────────────
function featuredStrip(book) {
  return `<div class="featured-strip" onclick="openModal(${book.id})">
    <div class="fs-cover">${makeCover(book, true)}</div>
    <div style="flex:1">
      <div class="fs-tag">✦ Featured Story</div>
      <div class="fs-title">${book.title}</div>
      <div class="fs-author">by ${book.author} · ${book.year}</div>
      <div class="fs-desc">${book.desc}</div>
      <div class="fs-meta">
        <span>👁 ${book.reads}</span>
        <span>❤️ ${book.votes}</span>
        <span>⭐ ${book.rating}</span>
        <span>📄 ${book.pages} pages</span>
      </div>
    </div>
  </div>`;
}

// ── GENRE CARD ────────────────────────────────────
function genreCard(g) {
  return `<div class="genre-card" onclick="filterGenre('${g.name}', null)">
    <div class="gc-icon">${g.icon}</div>
    <div class="gc-name">${g.name}</div>
    <div class="gc-count">${g.count} stories</div>
  </div>`;
}

// ── SECTION ───────────────────────────────────────
function section(title, content, seeAllFn = null) {
  const seeAll = seeAllFn
    ? `<button class="see-all" onclick="${seeAllFn}">See all →</button>` : '';
  return `<div class="section">
    <div class="sec-hdr"><div class="sec-title">${title}</div>${seeAll}</div>
    ${content}
  </div>`;
}

// ── STAR RATING INPUT ─────────────────────────────
function starInput(currentStars = 0) {
  return [1,2,3,4,5].map(n =>
    `<span data-star="${n}" onclick="setReviewStar(${n})" style="color:${n<=currentStars?'var(--star)':'var(--border2)'}">${n<=currentStars?'★':'☆'}</span>`
  ).join('');
}

// ── REVIEW CARD ───────────────────────────────────
function reviewCard(rv) {
  return `<div class="review-card">
    <div class="rv-header">
      <div class="rv-avatar">${rv.avatar}</div>
      <div>
        <div class="rv-name">${rv.user}</div>
        <div class="rv-date">${rv.date}</div>
      </div>
      <div style="margin-left:auto;color:var(--star);font-size:13px">${'★'.repeat(rv.stars)}</div>
    </div>
    <div class="rv-text">${rv.text}</div>
    <div class="rv-helpful">
      <span>👍 ${rv.helpful} found this helpful</span>
      <button onclick="markHelpful(this, ${rv.helpful})">Mark helpful</button>
    </div>
  </div>`;
}

// ── ACTIVITY CHART ────────────────────────────────
function activityChart() {
  const { months, values } = ACTIVITY;
  const max = Math.max(...values);
  const bars = values.map((v, i) => `
    <div class="act-col">
      <div class="act-num">${v}</div>
      <div class="act-bar" style="height:${(v/max)*64}px;animation-delay:${i*.1}s"></div>
    </div>`).join('');
  const lbls = months.map(m => `<div class="act-lbl">${m}</div>`).join('');
  return `<div class="act-chart">${bars}</div><div class="act-labs">${lbls}</div>`;
}

// ── TOGGLE SWITCH ─────────────────────────────────
function toggleSwitch(key, value) {
  return `<div class="toggle ${value?'on':''}" id="toggle_${key}" onclick="toggleSetting('${key}')"></div>`;
}

// ── SKELETON LOADER ───────────────────────────────
function skeletonRow(count = 6) {
  return `<div class="book-row">${Array(count).fill(0).map(() =>
    `<div style="width:130px;flex-shrink:0">
      <div class="skeleton" style="width:130px;height:184px;border-radius:11px;margin-bottom:9px"></div>
      <div class="skeleton" style="height:14px;width:90%;margin-bottom:5px;border-radius:6px"></div>
      <div class="skeleton" style="height:11px;width:60%;border-radius:6px"></div>
    </div>`).join('')}
  </div>`;
}
