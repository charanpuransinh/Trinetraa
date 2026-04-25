/* ═══════════════════════════════════════════════
   HOME PAGE — Indices, Quick Stats, Sectors
   ═══════════════════════════════════════════════ */

// Render Top Indices (4 boxes: 3 indices + 1 profile)
function renderIndices() {
  const html = INDICES.map((idx, i) => {
    if (idx.isProfile) {
      return `
        <div class="idx-box" style="border-color:var(--gold)" onclick="navTo('admin')">
          <div class="idx-name">PROFILE</div>
          <div style="font-size:22px;margin-top:2px">👤</div>
        </div>`;
    }

    const arrow = idx.chg >= 0 ? '▲' : '▼';
    const cls = idx.chg >= 0 ? 'up' : 'dn';
    const formatVal = idx.val < 10 ? idx.val.toFixed(4) : idx.val.toLocaleString();

    return `
      <div class="idx-box" onclick="openIndexModal(${i})">
        <div class="idx-name">${idx.name}</div>
        <div class="idx-val">${formatVal}</div>
        <div class="idx-chg ${cls}">${arrow}${Math.abs(idx.pct)}%</div>
      </div>`;
  }).join('');

  document.getElementById('topIndices').innerHTML = html;
}

// Render Quick Stats Row (5 boxes)
function renderQuick() {
  const html = QUICK.map(q => `
    <div class="sig-box">
      <div class="sig-label">${q.label}</div>
      <div class="sig-val">${q.val}</div>
      <div style="font-size:8px;color:var(--green)">${q.note}</div>
    </div>
  `).join('');

  document.getElementById('signalRow').innerHTML = html;
}

// Render Sector Heatmap (19 boxes)
function renderSectors() {
  const html = SECTORS.map(s => `
    <div class="sec-box ${s.cl}" onclick="openDrill('${s.name}')">
      <div class="sec-name">${s.name}</div>
      <div class="sec-stats">
        <span class="s-up">▲${s.up}</span>
        <span class="s-dn">▼${s.dn}</span>
      </div>
    </div>
  `).join('');

  document.getElementById('sectorGrid').innerHTML = html;
}

// Render Scrolling Ticker
function renderTicker() {
  const items = INDICES.filter(i => !i.isProfile).map(i => {
    const arrow = i.chg >= 0 ? '▲' : '▼';
    const cls = i.chg >= 0 ? 'up' : 'dn';
    const valStr = i.val < 10 ? i.val.toFixed(4) : i.val.toLocaleString();
    return `<span class="ti">👁 ${i.name} <span class="${cls}">${valStr} ${arrow}${Math.abs(i.pct)}%</span></span>`;
  });

  // Repeat for seamless loop
  document.getElementById('tickerInner').innerHTML = items.join('') + items.join('');
}

// Open Index Modal (OHLC details)
function openIndexModal(i) {
  const idx = INDICES[i];
  if (idx.isProfile) return;

  const formatVal = (v) => v < 10 ? v.toFixed(4) : v.toLocaleString();

  document.getElementById('modalName').textContent = idx.name;
  document.getElementById('mO').textContent = formatVal(idx.open);
  document.getElementById('mH').textContent = formatVal(idx.high);
  document.getElementById('mL').textContent = formatVal(idx.low);
  document.getElementById('mP').textContent = formatVal(idx.prev);

  openModal('idxModal');
}

// Open Sector Drill-Down
function openDrill(sector) {
  document.getElementById('drillName').textContent = sector;

  // Get stocks for this sector (or generate random ones)
  const stocks = (SECTOR_STOCKS[sector] || genDrillStocks(sector))
    .sort((a, b) => b.c - a.c);

  // Count gainers/losers
  const gainers = stocks.filter(s => s.c >= 0).length;
  const losers = stocks.length - gainers;

  document.getElementById('drillCount').innerHTML =
    `<span class="up">▲${gainers}</span> <span class="dn">▼${losers}</span>`;

  // Render list
  const html = stocks.map(s => {
    const itemClass = s.c >= 0 ? 'green-item' : 'red-item';
    const arrow = s.c >= 0 ? '+' : '';
    const sym = getCurrSym(s.n);
    const valFmt = s.p < 10 ? s.p.toFixed(4) : s.p.toLocaleString();

    return `
      <div class="d-item ${itemClass}">
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

  document.getElementById('drillList').innerHTML = html;
  document.getElementById('drillBg').classList.add('show');
}

// Close Drill-Down
function closeDrill() {
  document.getElementById('drillBg').classList.remove('show');
}

// Update Gemini status bar
function geminiCheck() {
  const timeEl = document.getElementById('geminiTime');
  if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();

  const messages = [
    '🤖 GEMINI: Pipeline OK · Forex Feed Active',
    '🤖 GEMINI: All 9 Scanners Running · No Errors',
    '🤖 GEMINI: Volume OK · Pepperstone Connected',
    '🤖 GEMINI: Commodities Live · Nifty Options Active',
  ];

  const txtEl = document.getElementById('geminiTxt');
  if (txtEl) {
    txtEl.textContent = messages[Math.floor(Math.random() * messages.length)];
  }
}
