/* ═══════════════════════════════════════════════
   WATCHLIST PAGE — Trinetra International
   Table with 3-click popups (Trade / OHLC / Scanner)
   ═══════════════════════════════════════════════ */

let sortAsc = false;

// Render the watchlist table — called by watchlist.html oninput="renderWL()"
function renderWL() {
  if (typeof WATCHLIST === 'undefined') return;

  // Sort by score
  WATCHLIST.sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  // Filter by search
  const inp = document.getElementById('wlSrch');
  const filter = inp ? inp.value.toLowerCase() : '';
  const filtered = WATCHLIST.filter(s => s.name.toLowerCase().includes(filter));

  const html = filtered.map((s, i) => {
    const priceStr = s.price < 10 ? s.price.toFixed(4) : s.price.toFixed(2);
    return `
      <div class="tr-row">
        <div class="td-cell td-num">${i + 1}</div>
        <div class="td-cell td-stock" onclick="openTrade('${s.name}', ${s.price})">${s.name}</div>
        <div class="td-cell td-price" onclick="openOHLC('${s.name}', ${s.price})">${priceStr}</div>
        <div class="td-cell td-scan" onclick="openScanCrit('${s.scan}', '${s.name}')">${s.scan}</div>
        <div class="td-cell td-sig ${s.sig === 'BUY' ? 'buy' : 'sell'}">${s.sig}</div>
        <div class="td-cell td-score">${s.score}</div>
      </div>`;
  }).join('');

  const body = document.getElementById('tBody');
  if (body) body.innerHTML = html;
}

// Toggle sort order — called by watchlist.html
function toggleSort() {
  sortAsc = !sortAsc;
  renderWL();
  if (typeof toast === 'function') {
    toast(sortAsc ? '⇅ Score: Low → High' : '⇅ Score: High → Low');
  }
}

// ─── Helper: get currency symbol ───
function _getSym(name) {
  if (typeof getCurrSym === 'function') return getCurrSym(name);
  return '$';
}

// ─── Helper: open modal ───
function _openModal(id) {
  if (typeof openModal === 'function') return openModal(id);
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

// ─── Helper: safe set text ───
function _setText(id, val) {
  const e = document.getElementById(id);
  if (e) e.textContent = val;
}

// 1. STOCK CLICK → Trade Setup Popup
function openTrade(name, price) {
  const sym = _getSym(name);
  const f = price < 10 ? 4 : 2;

  _setText('tradeStock', name);
  _setText('trEntry', sym + price.toFixed(f));
  _setText('trSL',    sym + (price * 0.985).toFixed(f));
  _setText('trTSL',   sym + (price * 0.992).toFixed(f));
  _setText('trExit',  sym + (price * 1.025).toFixed(f));
  _setText('trT1',    sym + (price * 1.012).toFixed(f));
  _setText('trT2',    sym + (price * 1.022).toFixed(f));
  _setText('trT3',    sym + (price * 1.035).toFixed(f));

  _openModal('tradePopup');
}

// 2. PRICE CLICK → OHLC Popup
function openOHLC(name, price) {
  const sym = _getSym(name);
  const f = price < 10 ? 4 : 2;

  _setText('ohlcStock', name);
  _setText('ohlcO', sym + (price * 0.985).toFixed(f));
  _setText('ohlcH', sym + (price * 1.01).toFixed(f));
  _setText('ohlcL', sym + (price * 0.97).toFixed(f));
  _setText('ohlcC', sym + price.toFixed(f));

  _openModal('ohlcPopup');
}

// 3. SCANNER CLICK → Why Selected (Criteria) Popup
function openScanCrit(code, stockName) {
  const map = (typeof SCANNER_MAP !== 'undefined') ? SCANNER_MAP : {};
  const sc = map[code] || { name: code };

  _setText('scanTitle', sc.name);
  _setText('scanStock', stockName + ' — Why Selected');

  const criteria = [
    { name: 'VWAP',         val: 'Above (+1.2%)' },
    { name: 'EMA 9',        val: 'Crossover ↑' },
    { name: 'EMA 21',       val: 'Above' },
    { name: 'RSI (14)',     val: '62 — Bullish' },
    { name: 'ADX',          val: '28 — Strong' },
    { name: 'Volume',       val: '2.3x Average' },
    { name: 'MACD',         val: 'Positive' },
    { name: 'Support/Res',  val: 'At Support' },
  ];

  const html = criteria.map(c => `
    <div class="crit-row-in pass">
      <span class="crit-name-in">✅ ${c.name}</span>
      <span class="crit-val-in">${c.val}</span>
    </div>
  `).join('');

  const list = document.getElementById('critList');
  if (list) list.innerHTML = html;

  _openModal('scanPopup');
}

// INIT
function initWatchlist() {
  if (typeof WATCHLIST === 'undefined') {
    console.warn('[watchlist] data.js not loaded yet');
    return;
  }
  renderWL();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initWatchlist);
} else {
  initWatchlist();
}
window.addEventListener('page:watchlist', initWatchlist);

// Expose globally
window.initWatchlist = initWatchlist;
window.renderWL = renderWL;
window.toggleSort = toggleSort;
window.openTrade = openTrade;
window.openOHLC = openOHLC;
window.openScanCrit = openScanCrit;
