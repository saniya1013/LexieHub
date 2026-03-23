/* ════════════════════════════════════
   search.js  —  Live Search
   ════════════════════════════════════ */

const doSearch = debounce(function(query) {
  const q = query.trim().toLowerCase();
  const dd = document.getElementById('searchDropdown');
  if (!q) { dd.classList.remove('show'); return; }

  const results = BOOKS.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.genre.toLowerCase().includes(q) ||
    b.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 7);

  if (!results.length) {
    dd.innerHTML = `<div class="sd-empty">No results for "${query}"</div>`;
  } else {
    dd.innerHTML = results.map(b => `
      <div class="sd-item" onclick="openModal(${b.id});document.getElementById('globalSearch').value='';document.getElementById('searchDropdown').classList.remove('show')">
        <div class="sd-cover">${makeCover(b, true)}</div>
        <div>
          <div class="sd-title">${b.title}</div>
          <div class="sd-author">${b.author}</div>
          <div class="sd-genre">${b.genre} · ⭐ ${b.rating}</div>
        </div>
      </div>`).join('');
  }
  dd.classList.add('show');
}, 250);

function initSearch() {
  const inp = document.getElementById('globalSearch');
  if (!inp) return;
  inp.addEventListener('input', e => doSearch(e.target.value));
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const q = e.target.value.trim().toLowerCase();
      const results = BOOKS.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q))
      );
      browsePage(results, `Results for "${e.target.value.trim()}"`, `${results.length} books found`);
      e.target.value = '';
      document.getElementById('searchDropdown').classList.remove('show');
    }
    if (e.key === 'Escape') { e.target.value = ''; document.getElementById('searchDropdown').classList.remove('show'); }
  });
}
