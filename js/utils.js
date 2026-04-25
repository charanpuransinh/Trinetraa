/* ═══════════════════════════════════════════════
   UTILITIES — Helpers, Modals, Toasts, Loading
   ═══════════════════════════════════════════════ */

// Open/Close any modal by ID
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Show loading overlay with text
function showLoading(txt) {
  document.getElementById('loadTxt').textContent = txt;
  document.getElementById('loadOv').classList.add('show');
}

function hideLoading() {
  document.getElementById('loadOv').classList.remove('show');
}

// Toast notification
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// Round number to 2 decimals
function fix(n) {
  return isNaN(n) ? 0 : +n.toFixed(2);
}

// Get currency symbol for stock name
function getCurrSym(name) {
  const up = name.toUpperCase();
  if (up.includes('NIFTY') || up.includes('SENSEX') || up === 'USD/INR') return '₹';
  return '$';
}

// Format price (4 decimals if < 10, else 2)
function formatPrice(price) {
  return price < 10 ? price.toFixed(4) : price.toFixed(2);
}

// Generate random drill-down stocks
function genDrillStocks(sectorName) {
  const names = ['STOCK A','STOCK B','STOCK C','STOCK D','STOCK E','STOCK F'];
  return names.map(x => ({
    n: x,
    p: Math.round(200 + Math.random() * 2000),
    c: parseFloat((Math.random() * 4 - 2).toFixed(1))
  }));
}

// Set bottom nav active state
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelectorAll('[data-page="' + page + '"]').forEach(n => n.classList.add('active'));
}

// Confirm dialog wrapper
function confirmAction(message, callback) {
  if (confirm(message)) callback();
}
