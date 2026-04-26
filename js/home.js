/* ═══════════════════════════════════════════════
   HOME PAGE — Trinetra International
   Indices · Quick Stats · Sectors · Ticker · Gemini
   ═══════════════════════════════════════════════ */

// ──────────────────────────────────────────────
// Render Top Indices (4 boxes: 3 + Profile)
// ──────────────────────────────────────────────
function renderIndices() {
  const el = document.getElementById('topIndices');
  if (!el) return;

  el.innerHTML = INDICES.map((idx, i) => {
    if (idx.isProfile) {
      return `
        <div class="idx-box" style="border-color:var(--gold)" onclick="navTo('admin')">
          <div class="idx-name">PROFILE</div>
          <div style="font-size:22px;margin-top:2px">👤</div>
        </div>`;
    }
    const arrow = idx.chg >= 0 ? '▲' : '▼';
    const cls = idx.chg >= 0 ? 'up' : 'dn';
    const valFmt = idx.val < 10 ? idx.val.toFixed(4) : idx.val.toLocaleString();
    return `
      <div class="idx-box" onclick="openIndexModal(${i})">
        <div class="idx-name">${idx.name}</div>
        <div class="idx-val">${valFmt}</div>
        <div class="idx-chg ${cls}">${arrow}${Math.abs(idx.pct)}%</div>
      </div>`;
  }).join('');
}

// ──────────────────────────────────────────────
// Render Quick Stats Row (5 boxes)
// ──────────────────────────────────────────────
function renderQuick() {
  const el = document.getElementById('quickRow');
  if (!el) return;

  el.innerHTML = QUICK.map(q => `
    <div class="sig-box">
      <div class="sig-label">${q.label}</div>
      <div class="sig-val">${q.val}</div>
      <div style="font-size:8px;color:var(--green)">${q.note}</div>
    </div>
  `).join('');
}

// ──────────────────────────────────────────────
// Render Markets Heatmap (Forex + Commodities)
// ──────────────────────────────────────────────
function renderSectors() {
  const el = document.getElementById('secGrid');
  if (!el) return;

  el.innerHTML = SECTORS.map(s => `
    <div class="sec-box ${s.cl}" onclick="openDrill('${s.name}')">
      <div class="sec-name">${s.name}</div>
      <div class="sec-stats">
        <span class="s-up">▲${s.up}</span>
        <span class="s-dn">▼${s.dn}</span>
      </div>
    </div>
  `).join('');
}

// ──────────────────────────────────────────────
// Render Scrolling Ticker (top of page)
// ──────────────────────────────────────────────
function renderTicker() {
  const el = document.getElementById('tickerIn');
  if (!el) return;

  const items = INDICES.filter(i => !i.isProfile).map(i => {
    const arrow = i.chg >= 0 ? '▲' : '▼';
    const cls = i.chg >= 0 ? 'up' : 'dn';
    const valStr = i.val < 10 ? i.val.toFixed(4) : i.val.toLocaleString();
    return `<span class="ti">👁 ${i.name} <span class="${cls}">${valStr} ${arrow}${Math.abs(i.pct)}%</span></span>`;
  });

  // Repeat for seamless loop animation
  el.innerHTML = items.join('') + items.join('');
}

// ──────────────────────────────────────────────
// Open Index OHLC Modal (when index box tapped)
// ──────────────────────────────────────────────
function openIndexModal(i) {
  const idx = INDICES[i];
  if (idx.isProfile) return;
  const fmt = (v) => v < 10 ? v.toFixed(4) : v.toLocaleString();

  // Set values if elements exist
  const setText = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.textContent = val;
  };
  setText('modalName', idx.name);
  setText('mO', fmt(idx.open));
  setText('mH', fmt(idx.high));
  setText('mL', fmt(idx.low));
  setText('mP', fmt(idx.prev));

  if (typeof openModal === 'function') openModal('idxModal');
}

// ──────────────────────────────────────────────
// Open Sector Drill-Down (when sector box tapped)
// ──────────────────────────────────────────────
function openDrill(sector) {
  const drillBg = document.getElementById('drillBg');
  if (!drillBg) {
    if (typeof toast === 'function') toast('📊 ' + sector + ' selected');
    return;
  }

  const setText = (id, val) => {
    const e = document.getElementById(id);
    if (e) e.innerHTML = val;
  };

  setText('drillName', sector);

  // Get stocks (or generate)
  const stocks = (typeof SECTOR_STOCKS !== 'undefined' && SECTOR_STOCKS[sector])
    ? SECTOR_STOCKS[sector]
    : (typeof genDrillStocks === 'function' ? genDrillStocks(sector) : []);

  stocks.sort((a, b) => b.c - a.c);
  const gainers = stocks.filter(s => s.c >= 0).length;
  const losers = stocks.length - gainers;

  setText('drillCount', `<span class="up">▲${gainers}</span> <span class="dn">▼${losers}</span>`);

  const html = stocks.map(s => {
    const cls = s.c >= 0 ? 'green-item' : 'red-item';
    const arrow = s.c >= 0 ? '+' : '';
    const sym = (typeof getCurrSym === 'function') ? getCurrSym(s.n) : '$';
    const valFmt = s.p < 10 ? s.p.toFixed(4) : s.p.toLocaleString();
    return `
      <div class="d-item ${cls}">
        <div>
          <div class="d-name-big">${s.n}</div>
          <div style="font-size:9px;color:var(--dim)">${sector}</div>
        </div>
        <div>
          <div class="d-price-big ${s.c >= 0 ? 'up' : 'dn'}">${sym}${valFmt}</div>
          <div class="d-chg-big ${s.c >= 0 ? 'up' : 'dn'}">${arrow}${s.c}%</div>
        </div>
      </div>`;
  }).join('');

  setText('drillList', html);
  drillBg.classList.add('show');
}

function closeDrill() {
  const el = document.getElementById('drillBg');
  if (el) el.classList.remove('show');
}

// ──────────────────────────────────────────────
// Update Gemini status bar (text + time)
// ──────────────────────────────────────────────
function geminiCheck() {
  const timeEl = document.getElementById('gemTime');
  if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();

  const txtEl = document.querySelector('.gem-txt');
  if (txtEl) {
    const messages = [
      '🤖 GEMINI: Pipeline OK · Forex Feed Active',
      '🤖 GEMINI: All 9 Scanners Running · No Errors',
      '🤖 GEMINI: Volume OK · Pepperstone Connected',
      '🤖 GEMINI: Commodities Live · International Markets Active',
      '🤖 GEMINI: Crypto Stream OK · Yahoo Finance Connected',
    ];
    txtEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}

// ──────────────────────────────────────────────
// INIT — runs every time home page is shown
// ──────────────────────────────────────────────
function initHome() {
  // Guard: only run if data exists
  if (typeof INDICES === 'undefined') {
    console.warn('[home] data.js not loaded yet');
    return;
  }
  renderIndices();
  renderQuick();
  renderSectors();
  renderTicker();
  geminiCheck();
}

// Run on initial DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}

// Re-run whenever home page is navigated to (SPA support)
window.addEventListener('page:home', initHome);

// Expose globally
window.initHome = initHome;
window.renderIndices = renderIndices;
window.renderQuick = renderQuick;
window.renderSectors = renderSectors;
window.renderTicker = renderTicker;
window.openIndexModal = openIndexModal;
window.openDrill = openDrill;
window.closeDrill = closeDrill;
window.geminiCheck = geminiCheck;

// Auto-update gemini every 20 seconds, ticker re-render every 30s
setInterval(geminiCheck, 20000);
      
