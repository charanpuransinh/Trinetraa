/* ═══════════════════════════════════════════════
   ADMIN / MASTER CONTROL PAGE
   Profile · P&L Tabs · Quick Nav · Logout
   ═══════════════════════════════════════════════ */

let currentTab = '1D';

// Switch P&L tab
function setTab(el, tab) {
  currentTab = tab;
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  updatePnL();
}

// Update P&L display
function updatePnL() {
  if (typeof PNL === 'undefined') return;
  const data = PNL[currentTab];
  if (!data) return;

  const setText = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.textContent = val;
  };

  setText('pnlVal', data.val);
  setText('trades', data.trades);
  setText('acc', data.acc);

  const pnl = document.getElementById('pnlVal');
  if (pnl) {
    pnl.style.color = data.val.startsWith('+') ? 'var(--green)' : 'var(--red)';
  }
}

// Toggle Light/Dark theme
function toggleTheme() {
  document.body.classList.toggle('light');
  const btn = document.getElementById('themeBtn');
  if (btn) {
    const isLight = document.body.classList.contains('light');
    btn.textContent = isLight ? '🌙 DARK' : '☀️ LIGHT';
  }
  try {
    localStorage.setItem('trinetra_theme', document.body.classList.contains('light') ? 'light' : 'dark');
  } catch (e) {}
}

// Logout
function doLogout() {
  if (typeof toast === 'function') toast('⏻ Logging out...');
  setTimeout(() => {
    if (typeof navTo === 'function') navTo('login');
  }, 800);
}

// Restore theme on load
function restoreTheme() {
  try {
    const saved = localStorage.getItem('trinetra_theme');
    if (saved === 'light') {
      document.body.classList.add('light');
      const btn = document.getElementById('themeBtn');
      if (btn) btn.textContent = '🌙 DARK';
    }
  } catch (e) {}
}

// INIT
function initAdmin() {
  restoreTheme();
  updatePnL();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
window.addEventListener('page:admin', initAdmin);

// Expose globally
window.initAdmin = initAdmin;
window.setTab = setTab;
window.toggleTheme = toggleTheme;
window.doLogout = doLogout;
window.updatePnL = updatePnL;
