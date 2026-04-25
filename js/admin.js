/* ═══════════════════════════════════════════════
   ADMIN PAGE — Profile, P&L, Theme Toggle, Password
   ═══════════════════════════════════════════════ */

// Toggle Light/Dark theme
function toggleTheme() {
  document.body.classList.toggle('light');
  const btn = document.getElementById('themeBtn');

  if (document.body.classList.contains('light')) {
    btn.innerHTML = '🌙 DARK';
    toast('☀️ Light Mode');
  } else {
    btn.innerHTML = '☀️ LIGHT';
    toast('🌙 Dark Mode');
  }
}

// Switch P&L tab (1D / 1W / 1M)
function setAdminTab(el, range) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const data = PNL_DATA[range];
  document.getElementById('pnlVal').textContent = data.val;
  document.getElementById('trades').textContent = data.trades;
  document.getElementById('acc').textContent = data.acc;

  toast('📊 P&L: ' + range);
}

// Submit password change
function submitPassword() {
  closeModal('pwModal');
  toast('✅ Password updated successfully!');
}
