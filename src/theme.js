// ============================================================
//  theme.js — Dark mode toggle with localStorage persistence
// ============================================================
function applyTheme() {
  var saved = localStorage.getItem('shm-theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
}

function toggleTheme() {
  var isDark = document.body.classList.toggle('dark');
  localStorage.setItem('shm-theme', isDark ? 'dark' : 'light');
}
