/* ═══════════════════════════════════════════════
   WATCHLIST PAGE — Table with 3 click popups
   ═══════════════════════════════════════════════ */

let sortAsc = false;

// Render the watchlist table
function renderWatchlist() {
  // Sort by score
  WATCHLIST.sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  // Filter by search input
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const filtered = WATCHLIST.filter(s => s.name.toLowerCase().includes(filter));

  // Render rows
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

  document.getElementById('tableBody').innerHTML = html;
}

// Toggle sort order
function toggleSort() {
  sortAsc = !sortAsc;
  renderWatchlist();
  toast(sortAsc ? '⇅ Score: Low → High' : '⇅ Score: High → Low');
}

// ─── 3 CLICK POPUPS ───

// 1. Stock Click → Trade Setup Popup
function openTrade(name, price) {
  const sym = getCurrSym(name);
  const f = price < 10 ? 4 : 2;

  document.getElementById('tradeStock').textContent = name;
  document.getElementById('trEntry').textContent = sym + price.toFixed(f);
  document.getElementById('trSL').textContent    = sym + (price * 0.985).toFixed(f);
  document.getElementById('trTSL').textContent   = sym + (price * 0.992).toFixed(f);
  document.getElementById('trExit').textContent  = sym + (price * 1.025).toFixed(f);
  document.getElementById('trT1').textContent    = sym + (price * 1.012).toFixed(f);
  document.getElementById('trT2').textContent    = sym + (price * 1.022).toFixed(f);
  document.getElementById('trT3').textContent    = sym + (price * 1.035).toFixed(f);

  openModal('tradePopup');
}

// 2. Price Click → OHLC Popup
function openOHLC(name, price) {
  const sym = getCurrSym(name);
  const f = price < 10 ? 4 : 2;

  document.getElementById('ohlcStock').textContent = name;
  document.getElementById('ohlcO').textContent = sym + (price * 0.985).toFixed(f);
  document.getElementById('ohlcH').textContent = sym + (price * 1.01).toFixed(f);
  document.getElementById('ohlcL').textContent = sym + (price * 0.97).toFixed(f);
  document.getElementById('ohlcC').textContent = sym + price.toFixed(f);

  openModal('ohlcPopup');
}

// 3. Scanner Click → Why Selected (Criteria) Popup
function openScanCrit(code, stockName) {
  const sc = SCANNER_MAP[code] || { name: code };

  document.getElementById('scanTitle').textContent = sc.name;
  document.getElementById('scanStock').textContent = stockName + ' — Why Selected';

  // Sample criteria (in real app, fetch live values)
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

  document.getElementById('critList').innerHTML = html;

  openModal('scanPopup');
}
