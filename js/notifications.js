/* ════════════════════════════════════
   notifications.js
   ════════════════════════════════════ */

function initNotifications() {
  renderNotifDot();
  renderNotifList();

  document.getElementById('notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifPanel').classList.toggle('show');
  });
}

function renderNotifDot() {
  const dot = document.getElementById('notifDot');
  if (dot) dot.classList.toggle('show', State.unreadCount > 0);
}

function renderNotifList() {
  const list = document.getElementById('notifList');
  if (!list) return;
  list.innerHTML = State.notifications.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="ni-icon">${n.icon}</div>
      <div>
        <div class="ni-text">${n.text}</div>
        <div class="ni-time">${n.time}</div>
      </div>
    </div>`).join('');
}

function readNotif(id) {
  const n = State.notifications.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifDot();
  renderNotifList();
}

function markAllRead() {
  State.notifications.forEach(n => n.unread = false);
  renderNotifDot();
  renderNotifList();
  toast('✓ All notifications marked as read');
}
