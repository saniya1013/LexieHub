/* ════════════════════════════════════
   modal.js  —  Book Detail Modal
   ════════════════════════════════════ */

let _reviewStar = 0;

function openModal(bookId) {
  const book = getBook(bookId);
  if (!book) return;
  const inLib  = State.library.has(bookId);
  const voted  = State.votes.has(bookId);
  const prog   = State.getProgress(bookId);
  const rvs    = (State.reviews[bookId] || []).map(reviewCard).join('');
  const avgRating = book.rating;

  document.getElementById('modalContent').innerHTML = `
    <div class="modal-book-header">
      <div class="modal-cover">${makeCover(book)}</div>
      <div class="modal-meta">
        <div class="modal-genre-tag">${book.genre}</div>
        <div class="modal-title">${book.title}</div>
        <div class="modal-author">by ${book.author} · ${book.year}</div>
        <div class="rating-row">
          <span class="stars">${stars(avgRating)}</span>
          <span class="rating-num">${avgRating} (${fmt(book.ratingCount)} ratings)</span>
        </div>
        <div class="modal-chips">
          ${book.tags.map(t=>`<span class="modal-chip">${t}</span>`).join('')}
        </div>
        <div class="modal-stats">
          <div class="mstat"><div class="mstat-num">👁 ${book.reads}</div><div class="mstat-lbl">Reads</div></div>
          <div class="mstat"><div class="mstat-num">❤️ ${book.votes}</div><div class="mstat-lbl">Votes</div></div>
          <div class="mstat"><div class="mstat-num">📄 ${book.pages}</div><div class="mstat-lbl">Pages</div></div>
        </div>
      </div>
    </div>

    <div class="modal-body">
      <p class="modal-desc">${book.desc}</p>

      <!-- Reading Progress -->
      ${prog > 0 ? `<div style="margin-bottom:18px">
        <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;margin-bottom:6px">
          <span>Your Progress</span><span style="color:var(--orange)">${prog}%</span>
        </div>
        <div class="prog-bar"><div class="prog-fill" style="width:${prog}%"></div></div>
      </div>` : ''}

      <!-- Action buttons -->
      <div class="modal-actions" style="margin-bottom:22px">
        <button class="btn-orange" onclick="closeModal();openReader(${bookId})">📖 Read Now</button>
        <button class="btn-sm ${inLib?'btn-green':'btn-outline'}" id="modalLibBtn" onclick="modalToggleLib(${bookId})">
          ${inLib ? '✓ In Library' : '🔖 Save'}
        </button>
        <button class="btn-sm vote-btn ${voted?'voted':''}" id="modalVoteBtn" onclick="modalToggleVote(${bookId})">
          ${voted ? '❤️ Voted' : '🤍 Vote'}
        </button>
        <button class="btn-sm btn-outline" onclick="toast('🔗 Link copied!')">📤 Share</button>
      </div>

      <!-- Reviews -->
      <div style="border-top:1px solid var(--border);padding-top:18px">
        <div style="font-size:15px;font-weight:800;margin-bottom:14px">
          ⭐ Reviews ${rvs ? `(${(State.reviews[bookId]||[]).length})` : ''}
        </div>
        <div class="reviews-list" id="reviewsList">${rvs || '<p style="color:var(--muted);font-size:13px">No reviews yet. Be the first!</p>'}</div>

        <!-- Write review -->
        <div class="review-form" id="reviewForm">
          <div style="font-size:13px;font-weight:800;margin-bottom:6px">Write a Review</div>
          <div class="star-input" id="starInput">${starInput(0)}</div>
          <textarea class="review-textarea" id="reviewText" placeholder="Share your thoughts about this book…" rows="3"></textarea>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn-orange btn-sm" onclick="submitReview(${bookId})">Post Review</button>
            <button class="btn-outline btn-sm" onclick="document.getElementById('reviewText').value='';_reviewStar=0;document.getElementById('starInput').innerHTML=starInput(0)">Clear</button>
          </div>
        </div>
      </div>
    </div>`;

  document.getElementById('modalOverlay').classList.add('open');
  document.getElementById('modalBox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay')?.classList.remove('open');
  document.getElementById('modalBox')?.classList.remove('open');
  document.body.style.overflow = '';
}

function modalToggleLib(bookId) {
  const book = getBook(bookId);
  const btn = document.getElementById('modalLibBtn');
  if (State.library.has(bookId)) {
    State.library.delete(bookId);
    if (btn) { btn.textContent = '🔖 Save'; btn.className = 'btn-sm btn-outline'; }
    toast(`🗑 Removed from library`);
  } else {
    State.library.add(bookId);
    if (btn) { btn.textContent = '✓ In Library'; btn.className = 'btn-sm btn-green'; }
    toast(`🔖 Saved: ${book.title}`);
  }
}

function modalToggleVote(bookId) {
  const btn = document.getElementById('modalVoteBtn');
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

function setReviewStar(n) {
  _reviewStar = n;
  const inp = document.getElementById('starInput');
  if (inp) inp.innerHTML = starInput(n);
}

function submitReview(bookId) {
  const text = document.getElementById('reviewText')?.value.trim();
  if (!text) { toast('✏️ Please write something first!'); return; }
  if (!_reviewStar) { toast('⭐ Please select a star rating!'); return; }

  if (!State.reviews[bookId]) State.reviews[bookId] = [];
  State.reviews[bookId].unshift({
    user: USER.name, avatar: USER.avatar,
    stars: _reviewStar, text, date: 'Just now', helpful: 0
  });

  const list = document.getElementById('reviewsList');
  if (list) list.innerHTML = State.reviews[bookId].map(reviewCard).join('');

  document.getElementById('reviewText').value = '';
  _reviewStar = 0;
  document.getElementById('starInput').innerHTML = starInput(0);

  // Add notification
  State.notifications.unshift({
    id: Date.now(), icon: '⭐',
    text: `Your review of "${getBook(bookId)?.title}" was posted!`,
    time: 'Just now', unread: true
  });
  renderNotifDot();

  toast('✅ Review posted!');
}
