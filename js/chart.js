/* ═══════════════════════════════════════════════
   CHART PAGE — Trinetra International
   Candlestick + EMA + VWAP + 16 Indicators
   ═══════════════════════════════════════════════ */

let currentChartStock = 'EUR/USD';
let zoomLevel = 2;

// Number of candles per zoom level
function getCandleCount() {
  const counts = { 1: 100, 2: 60, 3: 40, 4: 25, 5: 15 };
  return counts[zoomLevel] || 60;
}

// Generate candlestick data
function generateCandles(count, basePrice) {
  const candles = [];
  let price = basePrice * 0.985;
  for (let i = 0; i < count; i++) {
    const open = price;
    const vol = basePrice * 0.003;
    const trend = (i / count) * basePrice * 0.02;
    const move = (Math.random() - 0.4) * vol + trend * 0.05;
    const close = open + move;
    candles.push({
      open, close,
      high: Math.max(open, close) + Math.random() * vol * 0.4,
      low:  Math.min(open, close) - Math.random() * vol * 0.4
    });
    price = close;
  }
  return candles;
}

// Render the SVG chart
function renderChart() {
  const svg = document.getElementById('chSvg');
  if (!svg) return;
  if (typeof CHART_STOCKS === 'undefined') return;

  const W = 400, H = 260;
  const stock = CHART_STOCKS[currentChartStock] || CHART_STOCKS['EUR/USD'];
  const candles = generateCandles(getCandleCount(), stock.price);

  let maxP = Math.max(...candles.map(c => c.high));
  let minP = Math.min(...candles.map(c => c.low));
  const pad = (maxP - minP) * 0.1;
  maxP += pad;
  minP -= pad;

  const cw = (W - 40) / candles.length;
  const yScale = (p) => H - 20 - ((p - minP) / (maxP - minP)) * (H - 40);

  let html = '<rect width="' + W + '" height="' + H + '" fill="#000"/>';

  // Grid lines + price labels
  for (let i = 0; i <= 4; i++) {
    const p = minP + (maxP - minP) * (i / 4);
    const y = yScale(p);
    html += `<line x1="0" y1="${y}" x2="${W - 40}" y2="${y}" stroke="#1a0a00" stroke-width="0.5" stroke-dasharray="2,4"/>`;
    const formatP = p < 10 ? p.toFixed(4) : p.toFixed(2);
    html += `<text x="${W - 3}" y="${y + 3}" fill="#555" font-size="8" text-anchor="end">${formatP}</text>`;
  }

  // Candlesticks
  candles.forEach((c, i) => {
    const x = 2 + i * cw + cw / 2;
    const isGreen = c.close >= c.open;
    const color = isGreen ? '#00c853' : '#ff3d3d';
    html += `<line x1="${x}" y1="${yScale(c.high)}" x2="${x}" y2="${yScale(c.low)}" stroke="${color}" stroke-width="1"/>`;
    const bt = yScale(Math.max(c.open, c.close));
    const bb = yScale(Math.min(c.open, c.close));
    html += `<rect x="${x - cw * 0.35}" y="${bt}" width="${cw * 0.7}" height="${Math.max(1, bb - bt)}" fill="${color}"/>`;
  });

  // EMA line (gold)
  let ema = candles[0].close;
  let emaPts = '';
  candles.forEach((c, i) => {
    ema = c.close * 0.2 + ema * 0.8;
    emaPts += `${2 + i * cw + cw / 2},${yScale(ema)} `;
  });
  html += `<polyline points="${emaPts}" fill="none" stroke="#ff6d00" stroke-width="1.5"/>`;

  // VWAP line (blue dashed)
  let vwapPts = '';
  let cumV = 0, cumPV = 0;
  candles.forEach((c, i) => {
    const vol = 1000 + Math.random() * 2000;
    cumV += vol;
    cumPV += ((c.high + c.low + c.close) / 3) * vol;
    let vwap = cumPV / cumV;
    vwap = vwap - (maxP - minP) * 0.08 + (i / candles.length) * (maxP - minP) * 0.15;
    vwapPts += `${2 + i * cw + cw / 2},${yScale(vwap)} `;
  });
  html += `<polyline points="${vwapPts}" fill="none" stroke="#64b5f6" stroke-width="1.5" stroke-dasharray="5,3"/>`;

  // Current price line
  const cy = yScale(candles[candles.length - 1].close);
  html += `<line x1="0" y1="${cy}" x2="${W - 40}" y2="${cy}" stroke="#ff6d00" stroke-width="1" stroke-dasharray="2,2"/>`;

  svg.innerHTML = html;

  // Floating price label
  const labelEl = document.getElementById('chLbl');
  if (labelEl) {
    labelEl.style.top = ((cy / H) * 100) + '%';
    labelEl.textContent = stock.price < 10 ? stock.price.toFixed(4) : stock.price.toFixed(2);
  }
}

// Render 16 indicator boxes
function renderIndicators() {
  const grid = document.getElementById('indGrid');
  if (!grid) return;
  if (typeof INDICATORS === 'undefined') return;

  grid.innerHTML = INDICATORS.map(i => `
    <div class="ind-cell ${i.cls}">
      <div class="ind-name">${i.n}</div>
      <div class="ind-val">${i.v}</div>
      <div class="ind-sig">${i.s}</div>
    </div>
  `).join('');
}

// Switch chart stock
function setChartStock(name) {
  const key = name.toUpperCase();
  if (!CHART_STOCKS[key]) {
    if (typeof toast === 'function') toast('⚠️ Not found: ' + key);
    return;
  }
  currentChartStock = key;
  const stock = CHART_STOCKS[key];
  const sym = (typeof getCurrSym === 'function') ? getCurrSym(key) : '$';
  const f = stock.price < 10 ? 4 : 2;
  const fmt = (v) => v < 10 ? v.toFixed(4) : v.toLocaleString();

  const setText = (id, val, color) => {
    const e = document.getElementById(id);
    if (e) {
      e.textContent = val;
      if (color) e.style.color = color;
    }
  };

  setText('chName', key);
  setText('chPill', key);
  setText('chPr',
    sym + fmt(stock.price),
    stock.chg >= 0 ? 'var(--green)' : 'var(--red)'
  );
  setText('chCg',
    (stock.chg >= 0 ? '▲ +' : '▼ ') + stock.chg + '%',
    stock.chg >= 0 ? 'var(--green)' : 'var(--red)'
  );
  setText('fVal', fmt(stock.f));
  setText('vpVal', fmt(stock.vp));

  renderChart();
}

// Search & load stock — called by chart.html
function loadStock() {
  const inp = document.getElementById('chSrch');
  if (!inp) return;
  const name = inp.value.trim();
  if (!name) return;
  setChartStock(name);
  inp.value = '';
}

// Change timeframe — called by chart.html
function setTF(el) {
  document.querySelectorAll('.tf').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderChart();
}

// Zoom in/out — called by chart.html
function chZoom(direction) {
  zoomLevel = Math.max(1, Math.min(5, zoomLevel + direction));
  const info = document.getElementById('zmInfo');
  if (info) info.textContent = `ZOOM ${zoomLevel}× — ${getCandleCount()} candles`;
  renderChart();
}

// INIT
function initChart() {
  if (typeof CHART_STOCKS === 'undefined') {
    console.warn('[chart] data.js not loaded yet');
    return;
  }
  setChartStock(currentChartStock);
  renderIndicators();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChart);
} else {
  initChart();
}
window.addEventListener('page:chart', initChart);

// Expose globally
window.initChart = initChart;
window.setChartStock = setChartStock;
window.loadStock = loadStock;
window.setTF = setTF;
window.chZoom = chZoom;
window.renderChart = renderChart;
window.renderIndicators = renderIndicators;
