/* ════════════════════════════════════
   reader.js  —  Book Reader
   ════════════════════════════════════ */

function openReader(bookId) {
  closeModal();
  const book = getBook(bookId);
  if (!book) return;

  State.reader.bookId = bookId;
  const progress = State.getProgress(bookId);
  const voted = State.votes.has(bookId);
  const inLib = State.library.has(bookId);
  const paras = book.text.split('\n').filter(Boolean).map(p => `<p>${p}</p>`).join('');
  const { fontSize, theme, font } = State.reader;

  setMain(`<div class="reader-page">

    <!-- Top bar -->
    <div class="reader-topbar">
      <button class="btn-outline btn-sm" onclick="goPage('home')">← Back</button>
      <div class="reader-info">
        <h2>${book.title}</h2>
        <p>by ${book.author} · ${book.pages} pages · ${book.genre}</p>
      </div>
      <div class="reader-actions-bar">
        <button class="btn-sm ${inLib?'btn-green':'btn-outline'}" onclick="toggleLibrary(${bookId})" id="libBtn">
          ${inLib ? '✓ In Library' : '+ Library'}
        </button>
        <button class="btn-outline btn-sm settings-toggle-btn" onclick="toggleReadSettings()">⚙️</button>
      </div>
    </div>

    <!-- Reading progress bar -->
    <div class="reader-progress-bar">
      <div class="reader-progress-fill" id="readerProg" style="width:${progress}%"></div>
    </div>

    <!-- Chapter body -->
    <div class="reader-body theme-${theme} font-${font}" id="readerBody" style="font-size:${fontSize}px">
      <div class="chapter-title">${book.chapter}</div>
      ${paras}
      <p>The story continues beyond these opening pages. Every sentence pulls you deeper into the world the author has crafted with such care and precision. This is a preview — explore the full catalogue on Lexie for the complete reading experience.</p>
      <p><em>"A reader lives a thousand lives before he dies. The man who never reads lives only one."</em> — George R.R. Martin</p>
    </div>

    <!-- Footer -->
    <div class="reader-footer">
      <button class="vote-btn ${voted ? 'voted' : ''}" id="voteBtn" onclick="toggleVote(${bookId})">
        ${voted ? '❤️ Voted' : '🤍 Vote'}
      </button>
      <span style="font-size:13px;color:var(--muted)">❤️ ${book.votes} votes · 👁 ${book.reads}</span>
      <div class="reader-nav-btns">
        <button class="btn-outline btn-sm" onclick="openModal(${bookId})">📋 Details</button>
        <button class="btn-outline btn-sm" onclick="toast('💬 Comments coming soon!')">💬 Comments</button>
      </div>
    </div>

    <!-- Simulate reading progress slider -->
    <div style="margin-top:22px;background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
        <span style="font-size:13px;font-weight:700">Reading Progress</span>
        <span style="font-size:13px;font-weight:700;color:var(--orange)" id="progLabel">${progress}%</span>
      </div>
      <input type="range" id="progSlider" min="0" max="100" value="${progress}"
        style="width:100%;accent-color:var(--orange);cursor:pointer"
        oninput="updateProgress(${bookId}, this.value)"/>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:4px">
        <span>0%</span><span>50%</span><span>100%</span>
      </div>
    </div>

  </div>`);

  // Scroll-based reading progress simulation
  const body = document.getElementById('readerBody');
  if (body) {
    window.addEventListener('scroll', () => {
      const rect = body.getBoundingClientRect();
      const total = body.offsetHeight;
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      const fill = document.getElementById('readerProg');
      if (fill) fill.style.width = pct + '%';
    });
  }
}

// Update progress from slider
function updateProgress(bookId, value) {
  const pct = parseInt(value);
  State.setProgress(bookId, pct);
  const lbl = document.getElementById('progLabel');
  if (lbl) lbl.textContent = pct + '%';
  const fill = document.getElementById('readerProg');
  if (fill) fill.style.width = pct + '%';
  if (pct === 100) {
    State.completedBooks.add(bookId);
    toast('🎉 Congratulations! You finished the book!');
  }
}

// Vote toggle
function toggleVote(bookId) {
  const btn = document.getElementById('voteBtn');
  if (State.votes.has(bookId)) {
    State.votes.delete(bookId);
    if (btn) { btn.textContent = '🤍 Vote'; btn.classList.remove('voted'); }
    toast('Vote removed');
  } else {
    State.votes.add(bookId);
    if (btn) { btn.textContent = '❤️ Voted'; btn.classList.add('voted'); }
    toast('❤️ Voted!');
  }
}

// Library toggle from reader
function toggleLibrary(bookId) {
  const book = getBook(bookId);
  if (!book) return;
  const btn = document.getElementById('libBtn');
  if (State.library.has(bookId)) {
    State.library.delete(bookId);
    if (btn) { btn.textContent = '+ Library'; btn.className = 'btn-sm btn-outline'; }
    toast(`🗑 Removed: ${book.title}`);
  } else {
    State.library.add(bookId);
    if (btn) { btn.textContent = '✓ In Library'; btn.className = 'btn-sm btn-green'; }
    toast(`🔖 Saved: ${book.title}`);
  }
}

// Toggle reading settings panel
function toggleReadSettings() {
  document.getElementById('readSettings').classList.toggle('show');
}

// Change font size
function changeFontSize(delta) {
  State.reader.fontSize = Math.min(24, Math.max(13, State.reader.fontSize + delta));
  const body = document.getElementById('readerBody');
  if (body) body.style.fontSize = State.reader.fontSize + 'px';
  const lbl = document.getElementById('fontSizeLabel');
  if (lbl) lbl.textContent = State.reader.fontSize + 'px';
}

// Set reader theme
function setReaderTheme(theme, btn) {
  State.reader.theme = theme;
  const body = document.getElementById('readerBody');
  if (body) { body.className = body.className.replace(/theme-\w+/, `theme-${theme}`); }
  document.querySelectorAll('.rsp-controls .theme-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// Set reader font
function setReaderFont(font, btn) {
  State.reader.font = font;
  const body = document.getElementById('readerBody');
  if (body) { body.className = body.className.replace(/font-\w+/, `font-${font}`); }
  document.querySelectorAll('.rsp-row:last-child .theme-chip').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}
