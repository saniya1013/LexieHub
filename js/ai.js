/* ════════════════════════════════════
   ai.js  —  AI Chat
   ════════════════════════════════════ */

const AI_SYSTEM = `You are Lexie AI, a warm and enthusiastic book recommendation assistant for an e-library called Lexie. The user reads Romance, Fantasy, Sci-Fi, Mystery, and Non-Fiction. Be friendly and concise. Use **bold** for book titles. Keep replies under 120 words. Suggest 2-3 books with short reasons why they'd love each one.`;

function initAIChat() {
  const box = document.getElementById('aiMessages');
  if (!box || box.children.length > 0) return;
  addAIMsg('bot', "👋 Hey! I'm Lexie AI — your personal reading guide!\n\nI've checked your profile: you love **Romance**, **Fantasy**, and **Sci-Fi**. Tell me your mood or click a chip above, and I'll find your perfect book. 📚");
}

function addAIMsg(type, text) {
  const box = document.getElementById('aiMessages');
  if (!box) return null;
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = md(text);
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function quickAsk(q) {
  const inp = document.getElementById('aiInput');
  if (inp) inp.value = q;
  sendAI();
}

async function sendAI() {
  const inp = document.getElementById('aiInput');
  if (!inp) return;
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';
  addAIMsg('user', val);
  const loading = addAIMsg('loading', '🤖 Finding perfect books for you…');

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: AI_SYSTEM,
        messages: [{ role: 'user', content: val }]
      })
    });
    const data = await res.json();
    if (loading) loading.remove();
    addAIMsg('bot', data.content?.map(c => c.text || '').join('') || getFallback(val));
  } catch {
    if (loading) loading.remove();
    addAIMsg('bot', getFallback(val));
  }
}

function getFallback(q) {
  const l = q.toLowerCase();
  for (const [k, v] of Object.entries(AI_REPLIES)) {
    if (k !== 'default' && l.includes(k)) return v;
  }
  return AI_REPLIES.default[Math.floor(Math.random() * AI_REPLIES.default.length)];
}

function refreshAIPicks() {
  const grid = document.getElementById('aiGrid');
  if (!grid) return;
  const picks = BOOKS.filter(b => b.aiPick).sort(() => Math.random() - .5);
  grid.innerHTML = picks.map((b, i) => bookCard(b, i)).join('');
  toast('🤖 Refreshed AI picks!');
}
