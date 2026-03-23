/* ════════════════════════════════════
   app.js  —  App Bootstrap & Init
   ════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Dark mode ── */
  document.getElementById('themeBtn').addEventListener('click', toggleDark);

  /* ── Genre pills ── */
  document.querySelectorAll('.gpill').forEach(pill => {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.gpill').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      filterGenre(this.dataset.genre, null);
    });
  });

  /* ── Navbar scroll effect ── */
  window.addEventListener('scroll', () => {
    document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ── Escape key closes modal / panel ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('readSettings').classList.remove('show');
      document.getElementById('notifPanel').classList.remove('show');
    }
  });

  /* ── Init all modules ── */
  initSearch();
  initNotifications();

  /* ── Load home page ── */
  goPage('home');
});

/* ── Dark Mode ── */
function toggleDark() {
  State.isDark = !State.isDark;
  document.documentElement.setAttribute('data-theme', State.isDark ? 'dark' : 'light');
  document.getElementById('themeBtn').textContent = State.isDark ? '☀️' : '🌙';
  toast(State.isDark ? '🌙 Dark mode on' : '☀️ Light mode on');
}
