/* ════════════════════════════════════
   helpers.js  —  Shared utilities
   ════════════════════════════════════ */

// Show a toast message
function toast(msg, duration = 2800) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), duration);
}

// Find a book by id
function getBook(id) { return BOOKS.find(b => b.id === id) || null; }

// Set main page content + scroll to top
function setMain(html) {
  document.getElementById('main').innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Animation delay string for stagger
function stagger(i, step = 0.05) { return `animation-delay:${i * step}s`; }

// Bold markdown **text** → <strong>
function md(t) { return t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br/>'); }

// Generate star string e.g. "★★★★☆"
function stars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

// Format large numbers
function fmt(n) {
  if (typeof n === 'number') {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return (n / 1000).toFixed(1) + 'K';
    return String(n);
  }
  return n; // already formatted string
}

// Build book cover HTML
function makeCover(book, small = false) {
  const eSize = small ? '18px' : '30px';
  const tSize = small ? '9px' : '11px';
  const aiBadge = book.aiPick ? '<span class="cover-ai">AI</span>' : '';
  const readsBadge = small ? '' : `<span class="cover-reads">👁 ${book.reads}</span>`;
  return `<div class="cover-inner" style="background:linear-gradient(155deg,${book.colors[0]},${book.colors[1]})">
    <div class="cover-emoji" style="font-size:${eSize}">${book.emoji}</div>
    <div class="cover-title" style="font-size:${tSize}">${book.title}</div>
    <div class="cover-author">${book.author}</div>
    ${aiBadge}${readsBadge}
  </div>`;
}

// Debounce helper
function debounce(fn, delay = 300) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), delay); };
}

// Close all dropdowns/panels when clicking elsewhere
document.addEventListener('click', (e) => {
  if (!e.target.closest('#navSearchBox') && !e.target.closest('#searchDropdown')) {
    document.getElementById('searchDropdown')?.classList.remove('show');
  }
  if (!e.target.closest('#notifBtn') && !e.target.closest('.notif-panel')) {
    document.getElementById('notifPanel')?.classList.remove('show');
  }
  if (!e.target.closest('#readSettings') && !e.target.closest('.settings-toggle-btn')) {
    document.getElementById('readSettings')?.classList.remove('show');
  }
});
