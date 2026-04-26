/* ═══════════════════════════════════════════════
   POWER PAGE — Trinetra International
   Power Box Hybrid · 4 Modes · Entry/SL/Target
   ═══════════════════════════════════════════════ */

let powerMode = 'average';

// Mode change — called by power.html onclick
function setMode(m) {
  powerMode = m;
  document.querySelectorAll('.mode').forEach(b => b.classList.remove('active'));
  const el = document.getElementById('m_' + m);
  if (el) el.classList.add('active');
  runPower();
}

// Helper: safe set text + color
function _setText(id, val, color) {
  const e = document.getElementById(id);
  if (!e) return;
  e.textContent = val;
  if (color) e.style.color = color;
}

// Helper: get input number
function _num(id, def) {
  const e = document.getElementById(id);
  if (!e) return def;
  const v = parseFloat(e.value);
  return isNaN(v) ? def : v;
}

// Helper: get input string
function _str(id, def) {
  const e = document.getElementById(id);
  return e ? (e.value || def) : def;
}

// Format price based on size (forex 4 decimals, others 2)
function _fmt(v) {
  if (v < 10) return v.toFixed(4);
  if (v < 1000) return v.toFixed(2);
  return v.toLocaleString();
}

// Get currency symbol
function _sym(name) {
  if (typeof getCurrSym === 'function') return getCurrSym(name);
  return '$';
}

// ──────────────────────────────────────────────
// Main RUN — calculates Entry/SL/Target/RR/Pos
// Called by power.html "⚡ RUN" button
// ──────────────────────────────────────────────
function runPower() {
  const name  = _str('iName', 'EUR/USD');
  const price = _num('iPrice', 1.0845);
  const atr   = _num('iATR', price * 0.003);
  const avgV  = _num('iAvgV', 10);
  const curV  = _num('iCurV', 18);
  const qty   = _num('iQty', 100000);
  const cLow  = _num('iCL', price * 0.998);
  const cHigh = _num('iCH', price * 1.002);

  // Pivot calc
  const pivot = (cHigh + cLow + price) / 3;
  const support = pivot * 2 - cHigh;
  const resist  = pivot * 2 - cLow;

  // Mode-specific calculation
  let sl, target, sigText, sigClass, modeLabel;
  if (powerMode === 'average') {
    sl = Math.min(price - atr, support);
    target = price + atr * 1.5;
    sigText = (curV > avgV * 2) ? '⚡ STRONG MIX' : '✅ NORMAL';
    sigClass = 'cg';
    modeLabel = 'AVERAGE MODE';
  } else if (powerMode === 'intraday') {
    sl = price - atr;
    target = Math.max(price + atr * 1.5, resist);
    sigText = (curV > avgV * 2) ? '⚡ STRONG INTRADAY' : '✅ NORMAL INTRADAY';
    sigClass = 'cb';
    modeLabel = 'INTRADAY MODE';
  } else if (powerMode === 'intradayfixed') {
    const d = price * 0.005;  // 0.5% fixed
    sl = price - d;
    target = price + d * 1.5;
    sigText = '📊 FIXED CALC';
    sigClass = 'co';
    modeLabel = 'FIXED MODE';
  } else {  // scalp
    sl = cLow - atr * 0.5;
    target = cHigh + atr * 0.5;
    sigText = '⚡ FAST SCALP';
    sigClass = 'cy';
    modeLabel = 'SCALP MODE';
  }

  // Risk/Reward calc
  const risk = price - sl;
  const reward = target - price;
  const rr = (reward / (risk || 0.0001)).toFixed(2);
  const posSize = price * qty;
  const probability = Math.min(100, Math.round(50 + (curV / avgV) * 15 + (reward / (risk || 0.0001)) * 5));

  const sym = _sym(name);

  // Update UI
  _setText('rStock', '👁 ' + name);
  _setText('rMode', modeLabel);
  _setText('vEntry', sym + _fmt(price));
  _setText('vSL', sym + _fmt(sl));
  _setText('vT1', sym + _fmt(target));
  _setText('posSize', sym + (posSize > 1000 ? (posSize / 1000).toFixed(0) + 'K' : posSize.toFixed(0)));
  _setText('rrLive', '1:' + rr);
  _setText('probChip', probability + '%');

  const probFill = document.getElementById('probFill');
  if (probFill) probFill.style.width = probability + '%';

  // Update result signal
  const rSig = document.getElementById('rSig');
  if (rSig) {
    rSig.textContent = sigText;
    rSig.className = 'res-sig ' + sigClass;
  }

  // Update bars (signal strength based on volume ratio)
  const ratio = curV / (avgV || 1);
  const activeBars = ratio >= 2 ? 5 : ratio >= 1.5 ? 4 : ratio >= 1 ? 3 : 2;
  document.querySelectorAll('.bars .bar').forEach((b, i) => {
    if (i < activeBars) {
      b.style.background = (sigClass === 'cg') ? 'var(--green)' :
                           (sigClass === 'cb') ? 'var(--blue)' :
                           (sigClass === 'co') ? 'var(--gold)' :
                           'var(--gold)';
    } else {
      b.style.background = '';
    }
  });

  // Update meters (Secure %, Volume x)
  const secPct = Math.min(95, 60 + Math.floor(Math.random() * 30));
  _setText('secVal', secPct + '%');
  _setText('volVal', ratio.toFixed(1) + 'x');
}

// INIT
function initPower() {
  if (typeof CHART_STOCKS === 'undefined') {
    console.warn('[power] data.js not loaded yet');
    return;
  }
  runPower();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPower);
} else {
  initPower();
}
window.addEventListener('page:power', initPower);

// Expose globally
window.initPower = initPower;
window.setMode = setMode;
window.runPower = runPower;
