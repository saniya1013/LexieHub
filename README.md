# 📖 Lexie — Where Every Story Finds You

> A fully functional AI-powered E-Library web application built with pure HTML, CSS, and JavaScript.

![Lexie Preview](https://img.shields.io/badge/Lexie-E--Library-ff6122?style=for-the-badge&logo=bookstack)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Live Demo

Just open `index.html` in any modern browser — no server, no build step needed.

---

## ✨ Features

### 📚 Core
- **Home Page** — Hero banner, featured book, continue reading, trending rows, hot list, genre sections
- **Browse Page** — Full book grid with sort by Rating / Most Read / Newest
- **Book Detail Modal** — Cover, stats, description, tags, reviews, read/save/vote buttons
- **Book Reader** — Full reading view with chapter text, progress bar, vote, and details link

### 🤖 AI
- **Lexie AI Chat** — Live Claude API integration for personalized book recommendations
- **Quick-ask chips** — One-click prompts: Romance, Fantasy, Sci-Fi, Horror, and more
- **AI-Curated Grid** — Refreshable grid of AI-picked books
- **Smart Fallback** — Keyword-matched offline responses when API is unavailable

### 🎨 UI/UX
- **Dark / Light Mode** — Smooth toggle with full theme transition
- **Live Search** — Debounced search with dropdown results as you type
- **Genre Filter Pills** — Filter books by genre from the navbar
- **Wattpad-style Layout** — Top navbar, portrait book covers, horizontal scrolling rows

### 📖 Reader
- **Adjustable Font Size** — A− / A+ controls
- **3 Reader Themes** — White, Sepia, Dark
- **3 Font Styles** — Sans, Serif, Monospace
- **Progress Slider** — Manually set reading progress (0–100%)
- **Scroll-based Progress** — Auto-updates as you scroll

### 👤 Personal
- **My Library** — Tabs: Reading / Saved / Completed / Want to Read
- **Reading Progress** — Visual progress bars per book
- **Vote on Books** — Toggle ❤️ vote in reader and modal
- **Save to Library** — Add/remove books with live button updates
- **Profile Page** — Stats, editable preferences, activity chart
- **Settings Page** — Toggle switches for AI, notifications, privacy, dark mode

### 💬 Social
- **Write Reviews** — Star rating + text, posts live in the modal
- **Mark Helpful** — Vote reviews as helpful
- **Community Page** — Join/leave reading communities
- **Trending Discussions** — Community post feed
- **Notification Panel** — Unread dot, mark individual / all as read

---

## 📁 Project Structure

```
lexie/
│
├── index.html              ← App shell: navbar, modal, panels, scripts
│
├── css/
│   ├── theme.css           ← CSS variables (light/dark) + reset + animations
│   ├── navbar.css          ← Top nav, search bar, genre pills, notifications
│   ├── components.css      ← Book cards, buttons, reading items, hot list, reviews
│   ├── pages.css           ← Hero, profile header, AI chat, settings
│   ├── modal.css           ← Book detail modal + reading settings panel
│   └── reader.css          ← Book reader: themes, fonts, progress, TOC
│
└── js/
    ├── data.js             ← All books, genres, communities, AI replies
    ├── state.js            ← App state: library, votes, reviews, notifications
    ├── helpers.js          ← Utilities: toast, getBook, makeCover, debounce
    ├── components.js       ← HTML builders: bookCard, hotItem, reviewCard, etc.
    ├── pages.js            ← Page builders: home, browse, AI, library, profile…
    ├── reader.js           ← Reader: font size, themes, progress, vote, library
    ├── ai.js               ← Claude API integration + fallback responses
    ├── search.js           ← Live debounced search with dropdown
    ├── notifications.js    ← Notification panel: render, mark read
    ├── modal.js            ← Book modal: open/close, reviews, save, vote
    └── app.js              ← Bootstrap: init, dark mode, genre pills, events
```

---

## 🛠️ How to Run

### Option 1 — Direct Open (simplest)
```bash
# Just double-click index.html
# Or right-click → Open with → Chrome / Firefox / Edge
```

### Option 2 — Local Server (recommended)
```bash
# With Python
python3 -m http.server 8080
# Then open: http://localhost:8080

# With Node.js
npx serve .
# Then open: http://localhost:3000

# With VS Code
# Install "Live Server" extension → Right-click index.html → Open with Live Server
```

---

## 🤖 AI Setup

The AI chat uses the **Anthropic Claude API**. It works automatically when run inside Claude.ai.

For standalone deployment, you need to add your API key. In `js/ai.js`, update the fetch call:

```js
const res = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY_HERE',       // ← Add this line
    'anthropic-version': '2023-06-01',       // ← Add this line
  },
  ...
});
```

> ⚠️ Never commit your API key to GitHub. Use environment variables or a backend proxy for production.

If no API key is present, the app uses smart **keyword-matched fallback responses** that still work great.

---

## 📚 Books Included (16 titles)

| # | Title | Author | Genre |
|---|-------|--------|-------|
| 1 | Dune | Frank Herbert | Science Fiction |
| 2 | Atomic Habits | James Clear | Non-Fiction |
| 3 | The Great Gatsby | F. Scott Fitzgerald | Romance |
| 4 | Sapiens | Yuval Noah Harari | Non-Fiction |
| 5 | The Hobbit | J.R.R. Tolkien | Fantasy |
| 6 | 1984 | George Orwell | Mystery |
| 7 | It Ends with Us | Colleen Hoover | Romance |
| 8 | Harry Potter & The Sorcerer's Stone | J.K. Rowling | Fantasy |
| 9 | The Night Circus | Erin Morgenstern | Fantasy |
| 10 | Pride and Prejudice | Jane Austen | Romance |
| 11 | The Alchemist | Paulo Coelho | Fantasy |
| 12 | Thinking, Fast and Slow | Daniel Kahneman | Non-Fiction |
| 13 | Man's Search for Meaning | Viktor E. Frankl | Non-Fiction |
| 14 | A Brief History of Time | Stephen Hawking | Non-Fiction |
| 15 | Divergent | Veronica Roth | Teen Fiction |
| 16 | The Shadow of the Wind | Carlos Ruiz Zafón | Mystery |

---

## 🔧 How to Customize

### Add a new book
Open `js/data.js` and add an entry to the `BOOKS` array:
```js
{
  id: 17,
  title: "Your Book Title",
  author: "Author Name",
  genre: "Fantasy",           // must match a genre in the filter
  emoji: "🔥",
  colors: ["#ff6122", "#8b2500"],  // gradient colors for cover
  rating: 4.5,
  ratingCount: 1000,
  pages: 300,
  reads: "500K",
  votes: "42K",
  aiPick: true,               // show AI badge on cover
  tags: ["Fantasy", "Epic"],
  year: 2024,
  desc: "A short description of the book.",
  chapter: "Chapter One",
  text: "First paragraph.\n\nSecond paragraph.",
}
```

### Change the user profile
Edit the `USER` object in `js/data.js`.

### Add AI fallback responses
Add keywords to `AI_REPLIES` in `js/data.js`.

### Change colors / theme
Edit CSS variables in `css/theme.css` under `[data-theme="light"]` or `[data-theme="dark"]`.

---

## ⚠️ What's Not Included (needs a backend)

| Feature | What You'd Need |
|---------|----------------|
| Real user login/signup | Node.js + database (MongoDB/PostgreSQL) |
| Data persistence across sessions | localStorage (basic) or backend API |
| Real book content (full text) | Licensed ebook API or gutenberg.org |
| Email notifications | SMTP mail server |
| Real community chat | WebSockets (Socket.io) |
| Payment / premium plans | Stripe API + backend |

---

## 🏫 Project Info

- **Project Name:** Lexie — E-Library with AI Recommendation System
- **Type:** College Final Year Project
- **Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Claude AI API
- **Developed by:** Arjun Kumar

---

## 📄 License

This project is for educational purposes. Book descriptions and titles are used for demonstration only.
