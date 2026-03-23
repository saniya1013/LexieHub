/* ════════════════════════════════════
   pages.js  —  All Page Builders
   ════════════════════════════════════ */

function goPage(name) {
  State.currentPage = name;
  document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
  const pages = { home:0, browse:1, ai:2, library:3 };
  const navBtns = document.querySelectorAll('.nav-link');
  if (pages[name] !== undefined && navBtns[pages[name]]) navBtns[pages[name]].classList.add('active');
  closeModal();
  buildPage(name);
}

function buildPage(name) {
  switch(name) {
    case 'home':      homePage(); break;
    case 'browse':    browsePage(BOOKS, 'Browse All Stories'); break;
    case 'ai':        aiPage(); break;
    case 'library':   libraryPage(); break;
    case 'profile':   profilePage(); break;
    case 'community': communityPage(); break;
    case 'settings':  settingsPage(); break;
    default:          homePage();
  }
}

/* ── HOME ─────────────────────────────────────── */
function homePage() {
  const trending = [...BOOKS].sort((a,b) => parseFloat(b.reads) - parseFloat(a.reads));
  const aiPicks  = BOOKS.filter(b => b.aiPick).sort(() => Math.random()-.5);
  const romance  = BOOKS.filter(b => b.genre === 'Romance');
  const fantasy  = BOOKS.filter(b => b.genre === 'Fantasy');
  const nonFic   = BOOKS.filter(b => b.genre === 'Non-Fiction');
  const featured = BOOKS[9]; // Pride and Prejudice

  const heroBooks = [BOOKS[7], BOOKS[4], BOOKS[6]].map((b, i) => {
    const rots = ['-6deg','2deg','-3deg'];
    return `<div class="hero-book" style="--rot:${rots[i]}">${makeCover(b)}</div>`;
  }).join('');

  setMain(`<div class="page">

    <div class="hero">
      <div class="hero-text">
        <div class="hero-eye">✦ Lexie — Where Every Story Finds You</div>
        <h1>Discover your next<br/><span>favourite story.</span></h1>
        <p>Millions of books across every genre. AI-powered recommendations tailored just for you. Read free, anytime, anywhere.</p>
        <div class="hero-btns">
          <button class="btn-orange" onclick="goPage('browse')">Start Reading Free</button>
          <button class="btn-outline" style="color:rgba(255,255,255,.8);border-color:rgba(255,255,255,.3)" onclick="goPage('ai')">🤖 Get AI Picks</button>
        </div>
      </div>
      <div class="hero-books">${heroBooks}</div>
    </div>

    ${featuredStrip(featured)}

    ${section('Continue Reading', `<div class="reading-list">${State.reading.map(readingItem).join('')}</div>`, "goPage('library')")}

    ${section('🤖 AI Picks For You', bookRow(aiPicks), "goPage('ai')")}

    ${section('🔥 Trending Now', bookRow(trending.slice(0, 10)), "goPage('browse')")}

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:38px">
      <div>
        <div class="sec-hdr"><div class="sec-title">📈 Hot List</div></div>
        <div class="hot-list">${trending.slice(0,6).map((b,i)=>hotItem(b,i+1)).join('')}</div>
      </div>
      <div>
        <div class="sec-hdr">
          <div class="sec-title">💕 Romance</div>
          <button class="see-all" onclick="filterGenre('Romance',null)">See all →</button>
        </div>
        ${bookRow(romance)}
      </div>
    </div>

    ${section('🐉 Fantasy & Adventure', bookRow(fantasy), "filterGenre('Fantasy',null)")}
    ${section('📖 Non-Fiction', bookRow(nonFic), "filterGenre('Non-Fiction',null)")}

    ${section('Browse by Genre', `<div class="genre-grid">${GENRES.map(genreCard).join('')}</div>`)}

  </div>`);
}

/* ── BROWSE ───────────────────────────────────── */
function browsePage(books, title, subtitle = '') {
  const cards = books.length
    ? `<div class="book-grid">${books.map((b,i)=>bookCard(b,i)).join('')}</div>`
    : `<div class="empty-state"><div class="ei">🔎</div><h3>No results found</h3><p>Try a different search or genre.</p></div>`;

  // Sort options
  const sortBar = `<div style="display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap">
    <span style="font-size:13px;color:var(--muted);font-weight:700">${books.length} stories</span>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button onclick="sortBooks('rating')"   class="btn-outline btn-sm">⭐ Rating</button>
      <button onclick="sortBooks('reads')"    class="btn-outline btn-sm">👁 Most Read</button>
      <button onclick="sortBooks('year')"     class="btn-outline btn-sm">🆕 Newest</button>
    </div>
  </div>`;

  setMain(`<div class="page">
    <div class="sec-hdr" style="margin-bottom:8px">
      <div>
        <div class="sec-title">${title}</div>
        ${subtitle ? `<div class="sec-sub">${subtitle}</div>` : ''}
      </div>
    </div>
    ${sortBar}
    <div id="browseGrid">${cards}</div>
  </div>`);
}

function sortBooks(by) {
  let sorted = [...BOOKS];
  if (by === 'rating') sorted.sort((a,b) => b.rating - a.rating);
  else if (by === 'reads') sorted.sort((a,b) => parseFloat(b.reads) - parseFloat(a.reads));
  else if (by === 'year') sorted.sort((a,b) => b.year - a.year);
  const grid = document.getElementById('browseGrid');
  if (grid) grid.innerHTML = `<div class="book-grid">${sorted.map((b,i)=>bookCard(b,i)).join('')}</div>`;
  toast(`Sorted by ${by}`);
}

/* ── AI PAGE ──────────────────────────────────── */
function aiPage() {
  const picks = BOOKS.filter(b => b.aiPick).sort(() => Math.random()-.5);
  const chips = ['Romance 💕','Fantasy 🐉','Sci-Fi 🚀','Mystery 🔎','Horror 👻','Classics 📜','Make me cry 😭','Something funny 😂','Like Harry Potter ⚡','Like Dune 🪐','History 🏛️'];

  setMain(`<div class="page">
    <div class="ai-chat-box">
      <div class="ai-chat-header">
        <div class="ai-orb">🤖</div>
        <div>
          <h3>Lexie AI — Your Personal Reading Assistant</h3>
          <p>Powered by Claude AI · Personalized recommendations based on your reading profile</p>
        </div>
      </div>
      <div class="ai-messages" id="aiMessages"></div>
      <div class="ai-input-area">
        <div class="ai-chips">${chips.map(c=>`<button class="ai-chip" onclick="quickAsk('${c}')">${c}</button>`).join('')}</div>
        <div class="ai-input-row">
          <input class="ai-input" id="aiInput" placeholder="e.g. 'something romantic', 'books like Dune', 'I want to cry'…" onkeydown="if(event.key==='Enter')sendAI()"/>
          <button class="btn-orange btn-sm" onclick="sendAI()">Ask →</button>
        </div>
      </div>
    </div>

    <div class="sec-hdr">
      <div class="sec-title">✦ AI-Curated For You</div>
      <button class="see-all" onclick="refreshAIPicks()">↻ Refresh</button>
    </div>
    <div class="book-grid" id="aiGrid">${picks.map((b,i)=>bookCard(b,i)).join('')}</div>
  </div>`);

  initAIChat();
}

/* ── LIBRARY ──────────────────────────────────── */
function libraryPage() {
  const reading  = State.reading.map(readingItem).join('');
  const libBooks = [...State.library].map(getBook).filter(Boolean);
  const completed = [...State.completedBooks].map(getBook).filter(Boolean);
  const planned  = BOOKS.filter(b => !State.reading.find(r=>r.id===b.id) && !State.library.has(b.id)).slice(0,8);

  setMain(`<div class="page">
    <div class="sec-hdr" style="margin-bottom:20px">
      <div class="sec-title">📚 My Library</div>
    </div>
    <div class="tab-bar">
      <button class="tab-btn active" onclick="switchTab(this,'lib-reading')">📖 Reading (${State.reading.length})</button>
      <button class="tab-btn"        onclick="switchTab(this,'lib-saved')">🔖 Saved (${State.library.size})</button>
      <button class="tab-btn"        onclick="switchTab(this,'lib-done')">✅ Completed (${State.completedBooks.size})</button>
      <button class="tab-btn"        onclick="switchTab(this,'lib-plan')">⏳ Want to Read</button>
    </div>

    <div id="lib-reading"><div class="reading-list">${reading}</div></div>
    <div id="lib-saved"   style="display:none"><div class="book-grid">${libBooks.map((b,i)=>bookCard(b,i)).join('')}</div></div>
    <div id="lib-done"    style="display:none"><div class="book-grid">${completed.map((b,i)=>bookCard(b,i)).join('')}</div></div>
    <div id="lib-plan"    style="display:none"><div class="book-grid">${planned.map((b,i)=>bookCard(b,i)).join('')}</div></div>
  </div>`);
}

/* ── PROFILE ──────────────────────────────────── */
function profilePage() {
  const prefTags = State.prefs.map(p =>
    `<button class="pref-tag active" onclick="togglePref(this,'${p}')">${p}</button>`
  ).join('');

  setMain(`<div class="page">
    <div class="profile-header">
      <div class="profile-avatar-lg">${USER.avatar}</div>
      <div>
        <div class="profile-name">${USER.name}</div>
        <div class="profile-handle">${USER.handle} · Member since ${USER.joinedYear}</div>
        <div class="profile-stats">
          <div class="pstat"><div class="pstat-num">${State.reading.length + State.library.size}</div><div class="pstat-lbl">Books</div></div>
          <div class="pstat"><div class="pstat-num">${State.completedBooks.size}</div><div class="pstat-lbl">Finished</div></div>
          <div class="pstat"><div class="pstat-num">${State.votes.size + 8}</div><div class="pstat-lbl">Votes</div></div>
          <div class="pstat"><div class="pstat-num">${State.joinedCommunities.size}</div><div class="pstat-lbl">Communities</div></div>
        </div>
      </div>
    </div>

    <div class="profile-card">
      <h3>📖 Currently Reading</h3>
      <div class="reading-list">${State.reading.map(readingItem).join('')}</div>
    </div>

    <div class="profile-card">
      <h3>❤️ Reading Preferences <span style="font-size:12px;color:var(--muted);font-weight:500">(click to toggle)</span></h3>
      <div class="pref-tags" id="prefTagsContainer">${prefTags}</div>
    </div>

    <div class="profile-card">
      <h3>📊 Monthly Reading Activity</h3>
      ${activityChart()}
    </div>

    <div class="profile-card">
      <h3>🏆 Reading Stats</h3>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
        ${[['📚','847','Pages this month'],['⭐','4.8','Avg rating given'],['🔥','12','Day streak']].map(([icon,val,lbl])=>
          `<div style="background:var(--surface2);border-radius:11px;padding:16px;text-align:center">
            <div style="font-size:22px">${icon}</div>
            <div style="font-size:20px;font-weight:800;color:var(--orange)">${val}</div>
            <div style="font-size:11px;color:var(--muted)">${lbl}</div>
          </div>`).join('')}
      </div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="btn-orange" onclick="goPage('settings')">⚙️ Settings</button>
      <button class="btn-outline" onclick="toast('📤 Profile link copied!')">📤 Share Profile</button>
    </div>
  </div>`);
}

/* ── COMMUNITY ────────────────────────────────── */
function communityPage() {
  const cards = COMMUNITIES.map(c => {
    const joined = State.joinedCommunities.has(c.id);
    return `<div class="comm-card">
      <div class="cc-emoji">${c.emoji}</div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-desc">${c.desc}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px">
        <span class="cc-members">👥 ${c.members} members</span>
        <button onclick="toggleCommunity('${c.id}',this)" class="btn-sm ${joined?'btn-outline':'btn-orange'}">
          ${joined ? '✓ Joined' : '+ Join'}
        </button>
      </div>
    </div>`;
  }).join('');

  setMain(`<div class="page">
    <div class="sec-hdr" style="margin-bottom:6px">
      <div class="sec-title">💬 Community</div>
    </div>
    <p style="color:var(--muted);font-size:14px;margin-bottom:24px">Connect with readers who share your passion.</p>
    <div class="comm-grid">${cards}</div>

    <div style="margin-top:38px">
      <div class="sec-hdr"><div class="sec-title">📣 What's Trending in Communities</div></div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${[
          {emoji:"💕",tag:"#RomanceReads",text:"Best Colleen Hoover book ranked by the community! 1,204 votes",time:"2h ago"},
          {emoji:"🐉",tag:"#FantasyFriday",text:"Recommend a hidden fantasy gem — over 500 replies!",time:"5h ago"},
          {emoji:"📖",tag:"#BookChallenge",text:"Reading 52 books in 2025 challenge — join 14K readers!",time:"1d ago"},
        ].map(p=>`<div style="background:var(--surface);border:1px solid var(--border);border-radius:13px;padding:14px 16px;cursor:pointer;display:flex;gap:12px;align-items:flex-start" onclick="toast('Opening discussion...')">
          <span style="font-size:22px">${p.emoji}</span>
          <div>
            <div style="font-size:12px;font-weight:800;color:var(--orange);margin-bottom:3px">${p.tag}</div>
            <div style="font-size:13px;color:var(--text2)">${p.text}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:4px">${p.time}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>`);
}

/* ── SETTINGS ─────────────────────────────────── */
function settingsPage() {
  const s = State.settings;
  setMain(`<div class="page">
    <div class="sec-hdr" style="margin-bottom:22px">
      <div class="sec-title">⚙️ Settings</div>
      <button class="btn-outline btn-sm" onclick="goPage('profile')">← Back to Profile</button>
    </div>

    <div class="settings-section">
      <h3>🤖 AI & Recommendations</h3>
      <div class="settings-row">
        <div><div class="sr-label">AI Recommendations</div><div class="sr-sub">Get personalized book suggestions from Lexie AI</div></div>
        ${toggleSwitch('aiRecommendations', s.aiRecommendations)}
      </div>
      <div class="settings-row">
        <div><div class="sr-label">Reading Reminders</div><div class="sr-sub">Daily nudge to keep your reading streak going</div></div>
        ${toggleSwitch('readingReminders', s.readingReminders)}
      </div>
    </div>

    <div class="settings-section">
      <h3>🔔 Notifications</h3>
      <div class="settings-row">
        <div><div class="sr-label">Email Notifications</div><div class="sr-sub">Receive updates about new books and community activity</div></div>
        ${toggleSwitch('emailNotifications', s.emailNotifications)}
      </div>
    </div>

    <div class="settings-section">
      <h3>👤 Privacy</h3>
      <div class="settings-row">
        <div><div class="sr-label">Public Profile</div><div class="sr-sub">Let other readers find and follow your reading journey</div></div>
        ${toggleSwitch('publicProfile', s.publicProfile)}
      </div>
    </div>

    <div class="settings-section">
      <h3>🎨 Appearance</h3>
      <div class="settings-row">
        <div><div class="sr-label">Dark Mode</div><div class="sr-sub">Easy on the eyes for night reading</div></div>
        <div class="toggle ${State.isDark?'on':''}" onclick="toggleDark()"></div>
      </div>
    </div>

    <div class="settings-section">
      <h3>📊 Your Data</h3>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn-outline" onclick="toast('📦 Export started — check your email!')">Export Reading Data</button>
        <button class="btn-danger btn-sm" onclick="if(confirm('Clear all data?'))toast('🗑 Data cleared')">Clear All Data</button>
      </div>
    </div>
  </div>`);
}

/* ── HELPERS ──────────────────────────────────── */
function filterGenre(genre, pill) {
  if (pill) {
    document.querySelectorAll('.gpill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
  }
  if (genre === 'All') { browsePage(BOOKS, 'Browse All Stories'); return; }
  const results = BOOKS.filter(b =>
    b.genre.toLowerCase().includes(genre.toLowerCase()) ||
    b.tags.some(t => t.toLowerCase().includes(genre.toLowerCase()))
  );
  browsePage(results, genre, `${results.length} stories found`);
}

function switchTab(btn, id) {
  btn.closest('.tab-bar').querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  ['lib-reading','lib-saved','lib-done','lib-plan'].forEach(tid => {
    const el = document.getElementById(tid);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
}

function togglePref(btn, pref) {
  const idx = State.prefs.indexOf(pref);
  if (idx >= 0) { State.prefs.splice(idx, 1); btn.classList.remove('active'); }
  else { State.prefs.push(pref); btn.classList.add('active'); }
  toast(idx >= 0 ? `Removed "${pref}" preference` : `Added "${pref}" preference`);
}

function toggleCommunity(id, btn) {
  if (State.joinedCommunities.has(id)) {
    State.joinedCommunities.delete(id);
    btn.textContent = '+ Join';
    btn.className = 'btn-sm btn-orange';
    toast('Left community');
  } else {
    State.joinedCommunities.add(id);
    btn.textContent = '✓ Joined';
    btn.className = 'btn-sm btn-outline';
    toast('🎉 Joined community!');
  }
}

function toggleSetting(key) {
  State.settings[key] = !State.settings[key];
  const el = document.getElementById(`toggle_${key}`);
  if (el) el.classList.toggle('on', State.settings[key]);
  toast(`${State.settings[key] ? '✅ Enabled' : '❌ Disabled'}: ${key.replace(/([A-Z])/g,' $1')}`);
}

function markHelpful(btn, count) {
  btn.textContent = 'Marked!';
  btn.disabled = true;
  toast('👍 Marked as helpful!');
}
