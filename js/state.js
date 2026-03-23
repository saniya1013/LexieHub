/* ════════════════════════════════════
   state.js  —  All mutable app state
   ════════════════════════════════════ */

const State = {
  // Pages
  currentPage: 'home',

  // Theme
  isDark: false,

  // Library
  library: new Set(LIBRARY_IDS),
  reading: READING.map(r => ({ ...r })),    // copy
  votes: new Set(),
  completedBooks: new Set([1, 3, 6]),

  // Reviews: { bookId: [{user,stars,text,date,helpful}] }
  reviews: JSON.parse(JSON.stringify(REVIEWS_DATA)),

  // Communities joined
  joinedCommunities: new Set(COMMUNITIES.filter(c => c.joined).map(c => c.id)),

  // Notifications
  notifications: [
    { id:1, icon:"🤖", text:"AI found 3 new recommendations based on your reading!", time:"Just now",  unread:true  },
    { id:2, icon:"❤️", text:"Your review of 'Dune' got 12 helpful votes!",           time:"2h ago",    unread:true  },
    { id:3, icon:"📖", text:"You're 88% through 'Deep Work' — almost done!",         time:"Yesterday", unread:false },
    { id:4, icon:"🌟", text:"New books added in Fantasy this week — check them out!", time:"2 days ago",unread:false },
  ],

  // User preferences (editable)
  prefs: [...USER.prefs],

  // Settings toggles
  settings: {
    aiRecommendations: true,
    emailNotifications: false,
    readingReminders: true,
    publicProfile: true,
    darkMode: false,
  },

  // Reader state
  reader: {
    bookId: null,
    fontSize: 17,
    theme: 'white',
    font: 'sans',
    chapter: 0,
  },

  // Get reading progress for a book
  getProgress(bookId) {
    const entry = this.reading.find(r => r.id === bookId);
    return entry ? entry.pct : 0;
  },

  // Update reading progress
  setProgress(bookId, pct) {
    const entry = this.reading.find(r => r.id === bookId);
    if (entry) { entry.pct = pct; entry.lastRead = 'Just now'; }
    else this.reading.push({ id: bookId, pct, lastRead: 'Just now' });
  },

  // Count unread notifications
  get unreadCount() {
    return this.notifications.filter(n => n.unread).length;
  },
};
