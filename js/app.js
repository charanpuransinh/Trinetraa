// TRINETRA APP - Main Logic with Swipe Navigation

// ============ NAVIGATION (Swipe + Click) ============
const PAGES = ['home','signal','power','chart','watchlist','admin'];
let currentPage = 0;

function navTo(pageIdx) {
  if (typeof pageIdx === 'string') pageIdx = PAGES.indexOf(pageIdx);
  if (pageIdx < 0 || pageIdx >= PAGES.length) return;

  currentPage = pageIdx;
  const swiper = document.getElementById('swiper');
  if (swiper) {
    swiper.scrollTo({left: pageIdx * swiper.clientWidth, behavior:'smooth'});
  }
  updateNavUI();
}

function updateNavUI() {
  // Update bottom nav
  document.querySelectorAll('.nav-btn').forEach((b,i) => {
    b.classList.toggle('active', i === currentPage);
  });
  // Update dots
  document.querySelectorAll('.dot').forEach((d,i) => {
    d.classList.toggle('active', i === currentPage);
  });
  // Re-render chart if needed
  if (PAGES[currentPage] === 'chart') setTimeout(renderChart, 100);
}

// Detect swipe end
function setupSwipeDetection() {
  const swiper = document.getElementById('swiper');
  if (!swiper) return;

  let scrollTimer;
  swiper.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = Math.round(swiper.scrollLeft / swiper.clientWidth);
      if (idx !== currentPage) {
        currentPage = idx;
        updateNavUI();
      }
    }, 100);
  });
}

// ============ LOGIN ============
function doLogin() {
  const name = document.getElementById('fullName').value.trim();
  if (!name) { toast('⚠️ Enter name'); return; }
  enterApp(name);
}

function doBio() {
  enterApp(document.getElementById('fullName').value.trim() || 'Trader');
}

function enterApp(name) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';
  const fn = name.split(' ')[0];
  document.getElementById('avLetter').textContent = fn[0].toUpperCase();
  document.getElementById('profId').textContent = 'ID: ' + fn + '007';
  toast('👁 Welcome ' + fn);
  initLive();
}

function panicExit() {
  if (confirm('🚨 PANIC EXIT — सब positions close करने हैं?')) toast('🚨 All closed!');
}

function doLogout() {
  if (confirm('Logout?')) {
    document.getElementById('appShell').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
  }
}

// ============ HOME PAGE ============
function renderIndices() {
  const html = INDICES.map((idx,i) => {
    if (idx.isProfile) return `<div class="idx-box" style="border-color:var(--gold)" onclick="navTo('admin')"><div class="idx-name">PROFILE</div><div style="font-size:24px">👤</div></div>`;
    const valStr = idx.val < 10 ? idx.val.toFixed(4) : idx.val.toLocaleString();
    return `<div class="idx-box"><div class="idx-name">${idx.name}</div><div class="idx-val">${valStr}</div><div class="idx-chg ${idx.chg>=0?'up':'dn'}">${idx.chg>=0?'▲':'▼'}${Math.abs(idx.pct)}%</div></div>`;
  }).join('');
  document.getElementById('topIndices').innerHTML = html;
}

function renderQuick() {
  document.getElementById('quickRow').innerHTML = QUICK.map(q =>
    `<div class="quick-box"><div class="quick-lbl">${q.label}</div><div class="quick-val">${q.val}</div><div class="quick-note">${q.note}</div></div>`
  ).join('');
}

function renderSectors() {
  document.getElementById('secGrid').innerHTML = SECTORS.map(s =>
    `<div class="sec-box ${s.cl}"><div class="sec-name">${s.name}</div><div class="sec-stats"><span class="s-up">▲${s.up}</span><span class="s-dn">▼${s.dn}</span></div></div>`
  ).join('');
}

function renderTicker() {
  const items = INDICES.filter(i=>!i.isProfile).map(i => {
    const v = i.val < 10 ? i.val.toFixed(4) : i.val.toLocaleString();
    return `<span class="ti">👁 ${i.name} <span class="${i.chg>=0?'up':'dn'}">${v} ${i.chg>=0?'▲':'▼'}${Math.abs(i.pct)}%</span></span>`;
  });
  document.getElementById('tickerIn').innerHTML = items.join('') + items.join('');
}

function geminiCheck() {
  const t = document.getElementById('gemTime');
  if (t) t.textContent = new Date().toLocaleTimeString();
}

// ============ SCANNER PAGE ============
function renderScanners() {
  document.getElementById('scnGrid').innerHTML = SCANNERS.map(s =>
    `<div class="scn-box" onclick="toast('${s.name.replace('<br>',' ')} Scanner')"><div class="scn-ico">${s.icon}</div><div class="scn-tag">👁 SCANNER</div><div class="scn-name">${s.name}</div><div class="scn-live"><div class="scn-dot"></div>LIVE</div></div>`
  ).join('');
}

// ============ POWER PAGE ============
let powerMode = 'average';
function setMode(m) {
  powerMode = m;
  document.querySelectorAll('.mode').forEach(b => b.classList.remove('active'));
  document.getElementById('m_'+m).classList.add('active');
  runPower();
}

function getCurrSym(name) {
  const u = (name||'').toUpperCase();
  if (u.includes('NIFTY')||u.includes('SENSEX')||u==='USD/INR') return '₹';
  return '$';
}

function runPower() {
  const nm = document.getElementById('iName').value || 'EUR/USD';
  const pr = parseFloat(document.getElementById('iPrice').value) || 1.0845;
  const atr = parseFloat(document.getElementById('iATR').value) || pr*0.0035;
  const av = parseFloat(document.getElementById('iAvgV').value) || 10;
  const cv = parseFloat(document.getElementById('iCurV').value) || 18;
  const qty = parseFloat(document.getElementById('iQty').value) || 100000;

  let sl, t1, color;
  if (powerMode === 'average') { sl=pr-atr; t1=pr+atr*1.2; color='g'; }
  else if (powerMode === 'intraday') { sl=pr-atr; t1=pr+atr*1.5; color='b'; }
  else if (powerMode === 'intradayfixed') { sl=pr*0.99; t1=pr*1.012; color='o'; }
  else { sl=pr-atr*0.5; t1=pr+atr*0.8; color='y'; }

  const sym = getCurrSym(nm);
  const f = pr < 10 ? 4 : 2;
  const vr = cv/av;
  const ab = vr>=2?5:vr>=1.5?4:vr>=1?3:2;
  const prob = Math.min(100, Math.round(50 + vr*15));

  document.getElementById('rStock').textContent = '👁 ' + nm.toUpperCase();
  document.getElementById('rMode').textContent = powerMode.toUpperCase() + ' MODE';
  document.getElementById('rSig').className = 'res-sig c' + color;
  document.getElementById('rSig').textContent = vr>=2 ? '⚡ STRONG' : '✅ NORMAL';
  document.getElementById('vEntry').textContent = sym + pr.toFixed(f);
  document.getElementById('vSL').textContent = sym + sl.toFixed(f);
  document.getElementById('vT1').textContent = sym + t1.toFixed(f);
  document.getElementById('posSize').textContent = sym + (pr*qty).toLocaleString(undefined,{maximumFractionDigits:0});
  document.getElementById('rrLive').textContent = '1:' + ((t1-pr)/(pr-sl)).toFixed(2);
  document.getElementById('probChip').textContent = prob + '%';
  document.getElementById('probFill').style.width = prob + '%';

  document.querySelectorAll('.bar').forEach((b,i) => {
    b.className = 'bar' + (i<ab ? ' on-'+color : '');
  });
}

function updateMeters() {
  const sec = 65 + Math.floor(Math.random()*25);
  if (document.getElementById('secVal')) document.getElementById('secVal').textContent = sec + '%';
  const vol = (1 + Math.random()*2.5).toFixed(1);
  if (document.getElementById('volVal')) document.getElementById('volVal').textContent = vol + 'x';
}

// ============ CHART PAGE ============
let curStock = 'EUR/USD', zoomLvl = 2;
function getCdlCount() { return ({1:100,2:60,3:40,4:25,5:15})[zoomLvl] || 60; }

function genCandles(n, base) {
  const c = []; let p = base*0.985;
  for (let i=0; i<n; i++) {
    const o = p, vol = base*0.003;
    const cl = o + (Math.random()-0.4)*vol + (i/n)*base*0.001;
    c.push({open:o, close:cl, high:Math.max(o,cl)+Math.random()*vol*0.4, low:Math.min(o,cl)-Math.random()*vol*0.4});
    p = cl;
  }
  return c;
}

function renderChart() {
  const svg = document.getElementById('chSvg');
  if (!svg) return;
  const W=400, H=260, s = CHART_STOCKS[curStock] || CHART_STOCKS['EUR/USD'];
  const cdls = genCandles(getCdlCount(), s.price);
  let mx=Math.max(...cdls.map(c=>c.high)), mn=Math.min(...cdls.map(c=>c.low));
  const pad=(mx-mn)*0.1; mx+=pad; mn-=pad;
  const cw=(W-40)/cdls.length, yS=p=>H-20-((p-mn)/(mx-mn))*(H-40);
  let html = '<rect width="'+W+'" height="'+H+'" fill="#000"/>';
  for(let i=0;i<=4;i++){const p=mn+(mx-mn)*(i/4),y=yS(p);html+=`<line x1="0" y1="${y}" x2="${W-40}" y2="${y}" stroke="#1a0a00" stroke-width=".5" stroke-dasharray="2,4"/><text x="${W-3}" y="${y+3}" fill="#555" font-size="8" text-anchor="end">${p<10?p.toFixed(4):p.toFixed(0)}</text>`;}
  cdls.forEach((c,i)=>{const x=2+i*cw+cw/2,g=c.close>=c.open,col=g?'#00c853':'#ff3d3d';html+=`<line x1="${x}" y1="${yS(c.high)}" x2="${x}" y2="${yS(c.low)}" stroke="${col}" stroke-width="1"/><rect x="${x-cw*0.35}" y="${yS(Math.max(c.open,c.close))}" width="${cw*0.7}" height="${Math.max(1,yS(Math.min(c.open,c.close))-yS(Math.max(c.open,c.close)))}" fill="${col}"/>`;});
  let ema=cdls[0].close,emp='';cdls.forEach((c,i)=>{ema=c.close*0.2+ema*0.8;emp+=`${2+i*cw+cw/2},${yS(ema)} `;});
  html+=`<polyline points="${emp}" fill="none" stroke="#ff6d00" stroke-width="1.5"/>`;
  svg.innerHTML = html;
  document.getElementById('chLbl').textContent = s.price < 10 ? s.price.toFixed(4) : s.price.toFixed(2);
}

function renderInds() {
  document.getElementById('indGrid').innerHTML = INDICATORS.map(i =>
    `<div class="ind ${i.cls}"><div class="ind-n">${i.n}</div><div class="ind-v">${i.v}</div><div class="ind-s">${i.s}</div></div>`
  ).join('');
}

function loadStock() {
  const v = document.getElementById('chSrch').value.trim().toUpperCase();
  if (!v) return;
  if (CHART_STOCKS[v]) { curStock = v; setStock(); document.getElementById('chSrch').value=''; }
  else toast('⚠️ Not found: ' + v);
}

function setStock() {
  const s = CHART_STOCKS[curStock];
  const sym = getCurrSym(curStock);
  document.getElementById('chName').textContent = curStock;
  document.getElementById('chPr').textContent = sym + (s.price<10?s.price.toFixed(4):s.price.toLocaleString());
  document.getElementById('chPr').style.color = s.chg>=0?'var(--green)':'var(--red)';
  document.getElementById('chCg').textContent = (s.chg>=0?'▲ +':'▼ ') + s.chg + '%';
  document.getElementById('chCg').style.color = s.chg>=0?'var(--green)':'var(--red)';
  renderChart();
}

function chZoom(d) {
  zoomLvl = Math.max(1, Math.min(5, zoomLvl + d));
  document.getElementById('zmInfo').textContent = `ZOOM ${zoomLvl}× — ${getCdlCount()} candles`;
  renderChart();
}

function setTF(el) {
  document.querySelectorAll('.tf').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  renderChart();
}

// ============ WATCHLIST ============
let sortAsc = false;
function renderWL() {
  WATCHLIST.sort((a,b) => sortAsc ? a.score-b.score : b.score-a.score);
  const f = (document.getElementById('wlSrch').value || '').toLowerCase();
  document.getElementById('tBody').innerHTML = WATCHLIST.filter(s => s.name.toLowerCase().includes(f)).map((s,i) => {
    const pr = s.price < 10 ? s.price.toFixed(4) : s.price.toFixed(2);
    return `<div class="t-row"><div class="td td-num">${i+1}</div><div class="td td-stk" onclick="toast('${s.name}: ${pr}')">${s.name}</div><div class="td td-pr">${pr}</div><div class="td td-sc">${s.scan}</div><div class="td td-sg ${s.sig==='BUY'?'buy':'sell'}">${s.sig}</div><div class="td td-scr">${s.score}</div></div>`;
  }).join('');
}

function toggleSort() { sortAsc = !sortAsc; renderWL(); }

// ============ ADMIN ============
function toggleTheme() {
  document.body.classList.toggle('light');
  const b = document.getElementById('themeBtn');
  if (document.body.classList.contains('light')) { b.textContent='🌙 DARK'; toast('☀️ Light'); }
  else { b.textContent='☀️ LIGHT'; toast('🌙 Dark'); }
}

function setTab(el, range) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const d = PNL[range];
  document.getElementById('pnlVal').textContent = d.val;
  document.getElementById('trades').textContent = d.trades;
  document.getElementById('acc').textContent = d.acc;
}

// ============ UTILS ============
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ============ LIVE UPDATES ============
function initLive() {
  setInterval(() => {
    INDICES.forEach(i => { if (!i.isProfile) i.val += (Math.random()-0.48) * (i.val<10?0.0005:15); });
    renderIndices(); renderTicker();
  }, 5000);
  setInterval(geminiCheck, 20000);
  setInterval(updateMeters, 5000);
  setInterval(() => {
    WATCHLIST.forEach(s => s.price += (Math.random()-0.5) * s.price * 0.001);
    if (currentPage === 4) renderWL();
  }, 8000);
}

// ============ INIT ============
function initApp() {
  renderIndices(); renderQuick(); renderSectors(); renderTicker();
  renderScanners(); renderInds(); renderWL();
  geminiCheck(); runPower(); setStock(); updateMeters();
  setupSwipeDetection();
}

window.addEventListener('DOMContentLoaded', initApp);
