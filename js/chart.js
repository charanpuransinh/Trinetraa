/* ═══════════════════════════════════════════════
   CHART PAGE — Candlestick + EMA + VWAP + Indicators
   ═══════════════════════════════════════════════ */

let currentChartStock = 'EUR/USD';
let zoomLevel = 2;

// Number of candles per zoom level
function getCandleCount() {
  const counts = { 1: 100, 2: 60, 3: 40, 4: 25, 5: 15 };
  return counts[zoomLevel] || 60;
}

// Generate fake candlestick data
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
      open,
      close,
      high: Math.max(open, close) + Math.random() * vol * 0.4,
      low:  Math.min(open, close) - Math.random() * vol * 0.4
    });

    price = close;
  }

  return candles;
}

// Render the SVG chart
function renderChart() {
  const svg = document.getElementById('chartSvg');
  if (!svg) return;

  const W = 400;
  const H = 300;

  const stock = CHART_STOCKS[currentChartStock] || CHART_STOCKS['EUR/USD'];
  const candles = generateCandles(getCandleCount(), stock.price);

  // Calculate price range
  let maxP = Math.max(...candles.map(c => c.high));
  let minP = Math.min(...candles.map(c => c.low));
  const pad = (maxP - minP) * 0.1;
  maxP += pad;
  minP -= pad;

  const cw = (W - 40) / candles.length;
  const yScale = (p) => H - 20 - ((p - minP) / (maxP - minP)) * (H - 40);

  let html = '<rect width="' + W + '" height="' + H + '" fill="#000"/>';

  // Horizontal grid lines + price labels
  for (let i = 0; i <= 4; i++) {
    const p = minP + (maxP - minP) * (i / 4);
    const y = yScale(p);
    html += `<line x1="0" y1="${y}" x2="${W - 40}" y2="${y}" stroke="#1a0a00" stroke-width="0.5" stroke-dasharray="2,4"/>`;

    const formatP = p < 10 ? p.toFixed(4) : p.toFixed(2);
    html += `<text x="${W - 3}" y="${y + 3}" fill="#555" font-size="8" text-anchor="end">${formatP}</text>`;
  }

  // Draw candlesticks
  candles.forEach((c, i) => {
    const x = 2 + i * cw + cw / 2;
    const isGreen = c.close >= c.open;
    const color = isGreen ? '#00c853' : '#ff3d3d';

    // Wick
    html += `<line x1="${x}" y1="${yScale(c.high)}" x2="${x}" y2="${yScale(c.low)}" stroke="${color}" stroke-width="1"/>`;

    // Body
    const bt = yScale(Math.max(c.open, c.close));
    const bb = yScale(Math.min(c.open, c.close));
    html += `<rect x="${x - cw * 0.35}" y="${bt}" width="${cw * 0.7}" height="${Math.max(1, bb - bt)}" fill="${color}"/>`;
  });

  // EMA line (orange/gold)
  let ema = candles[0].close;
  let emaPts = '';
  candles.forEach((c, i) => {
    ema = c.close * 0.2 + ema * 0.8;
    emaPts += `${2 + i * cw + cw / 2},${yScale(ema)} `;
  });
  html += `<polyline points="${emaPts}" fill="none" stroke="#ff6d00" stroke-width="1.5"/>`;

  // VWAP line (blue dashed)
  let vwapPts = '';
  let cumV = 0;
  let cumPV = 0;

  candles.forEach((c, i) => {
    const vol = 1000 + Math.random() * 2000;
    cumV += vol;
    cumPV += ((c.high + c.low + c.close) / 3) * vol;

    let vwap = cumPV / cumV;
    // Adjust VWAP to be visible below candles
    vwap = vwap - (maxP - minP) * 0.08 + (i / candles.length) * (maxP - minP) * 0.15;

    vwapPts += `${2 + i * cw + cw / 2},${yScale(vwap)} `;
  });
  html += `<polyline points="${vwapPts}" fill="none" stroke="#64b5f6" stroke-width="1.5" stroke-dasharray="5,3"/>`;

  // Current price horizontal line
  const cy = yScale(candles[candles.length - 1].close);
  html += `<line x1="0" y1="${cy}" x2="${W - 40}" y2="${cy}" stroke="#ff6d00" stroke-width="1" stroke-dasharray="2,2"/>`;

  svg.innerHTML = html;

  // Update floating price label
  const labelEl = document.getElementById('priceLabel');
  if (labelEl) {
    labelEl.style.top = ((cy / H) * 100) + '%';
    labelEl.textContent = stock.price < 10 ? stock.price.toFixed(4) : stock.price.toFixed(2);
  }
}

// Render 16 indicator boxes
function renderIndicators() {
  const grid = document.getElementById('indGrid');
  if (!grid) return;

  const html = INDICATORS.map(i => `
    <div class="ind-cell ${i.cls}">
      <div class="ind-name">${i.n}</div>
      <div class="ind-val">${i.v}</div>
      <div class="ind-sig">${i.s}</div>
    </div>
  `).join('');

  grid.innerHTML = html;
}

// Switch chart stock
function setChartStock(name) {
  const key = name.toUpperCase();

  if (!CHART_STOCKS[key]) {
    toast('⚠️ Not found: ' + key);
    return;
  }

  currentChartStock = key;
  const stock = CHART_STOCKS[key];
  const sym = getCurrSym(key);
  const f = stock.price < 10 ? 4 : 2;

  document.getElementById('chartStockName').textContent = key;

  const priceEl = document.getElementById('chartPrice');
  priceEl.textContent = sym + (stock.price < 10 ? stock.price.toFixed(4) : stock.price.toLocaleString());
  priceEl.style.color = stock.chg >= 0 ? 'var(--green)' : 'var(--red)';

  const chgEl = document.getElementById('chartChg');
  chgEl.textContent = (stock.chg >= 0 ? '▲ +' : '▼ ') + stock.chg + '%';
  chgEl.style.color = stock.chg >= 0 ? 'var(--green)' : 'var(--red)';

  document.getElementById('fVal').textContent = stock.f.toLocaleString();
  document.getElementById('vpVal').textContent = stock.vp.toLocaleString();

  renderChart();
}

// Search & load stock
function loadChartStock() {
  const name = document.getElementById('chartSearch').value.trim();
  if (!name) return;

  setChartStock(name);
  document.getElementById('chartSearch').value = '';
}

// Change timeframe
function setChartTF(el, tf) {
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderChart();
}

// Zoom in/out
function chartZoom(direction) {
  zoomLevel = Math.max(1, Math.min(5, zoomLevel + direction));

  document.getElementById('zoomInfo').textContent =
    `ZOOM ${zoomLevel}× — ${getCandleCount()} candles`;

  renderChart();
}
