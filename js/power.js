/* ═══════════════════════════════════════════════
   POWER CONTROL PANEL — Calculation Engine
   ═══════════════════════════════════════════════ */

let powerMode = 'average';
let lastPowerR = null;

// Switch between modes (Average/Intraday/Fixed/Scalp)
function setPowerMode(mode) {
  powerMode = mode;
  document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('m_' + mode).classList.add('active');
  runPower();
}

// Calculate Power Box outputs based on inputs and mode
function runPower() {
  // Gather inputs
  const nm = document.getElementById('iName').value || 'EUR/USD';
  const pr = parseFloat(document.getElementById('iPrice').value) || 1.0845;
  const atr = parseFloat(document.getElementById('iATR').value) || pr * 0.0035;
  const av = parseFloat(document.getElementById('iAvgV').value) * 100000 || 1000000;
  const cv = parseFloat(document.getElementById('iCurV').value) * 100000 || 1500000;
  const qty = parseFloat(document.getElementById('iQty').value) || 100000;
  const cl = parseFloat(document.getElementById('iCL').value) || pr * 0.99;
  const ch = parseFloat(document.getElementById('iCH').value) || pr * 1.01;

  // Calculate pivot and Fibonacci
  const pivot = { support: ((ch + cl + pr) / 3) * 2 - ch };
  const rng = ch - cl;
  const fib = {
    "38.2": pr + rng * 0.382,
    "61.8": pr + rng * 0.618,
    "100":  pr + rng
  };

  // Mode-specific calculations
  let sl, t1, t2, t3, asl, note, sig, color, audio;

  if (powerMode === 'average') {
    sl = Math.min(pr - atr, pivot.support);
    t1 = (pr + atr * 1.2 + fib["38.2"]) / 2;
    t2 = (pr + atr * 1.5 + fib["61.8"]) / 2;
    t3 = (pr + atr * 2 + fib["100"]) / 2;
    asl = sl;
    sig = cv > av * 2 ? '⚡ STRONG MIX' : '✅ NORMAL MIX';
    note = 'AVERAGE MODE ACTIVE';
    color = 'GREEN';
    audio = '🔔 Chime';
  }
  else if (powerMode === 'intraday') {
    sl = Math.min(pr - atr, pivot.support);
    t1 = Math.max(pr + atr * 1.2, fib["38.2"]);
    t2 = Math.max(pr + atr * 1.5, fib["61.8"]);
    t3 = Math.max(pr + atr * 2, fib["100"]);
    asl = sl;
    sig = cv > av * 2 ? '⚡ STRONG INTRADAY' : '✅ NORMAL INTRADAY';
    note = 'INTRADAY MODE ACTIVE';
    color = 'BLUE';
    audio = '🔵 Tick-Tak';
  }
  else if (powerMode === 'intradayfixed') {
    const d = pr * 0.01;
    sl = pr - d;
    t1 = pr + d * 1.2;
    t2 = pr + d * 1.5;
    t3 = pr + d * 2;
    asl = sl;
    sig = '📊 FIXED CALCULATION';
    note = 'FIXED MODE ACTIVE';
    color = 'ORANGE';
    audio = '🟠 Buzz';
  }
  else { // scalp
    sl = cl - atr * 0.5;
    t1 = ch + atr * 0.5;
    t2 = t1 + atr * 0.5;
    t3 = t2 + atr * 0.5;
    asl = sl;
    sig = '⚡ FAST SCALPING';
    note = 'SCALP MODE ACTIVE';
    color = 'YELLOW';
    audio = '⚡ Chirp';
  }

  // Risk/Reward calculations
  const rpu = fix(pr - asl);
  const rwt = fix(t1 - pr);
  const probability = Math.min(100, Math.round(50 + (cv / av) * 15 + (rwt / (rpu || 1)) * 10));

  // Save result globally
  lastPowerR = {
    sName: nm, price: fix(pr), sl: fix(sl), asl: fix(asl),
    t1: fix(t1), t2: fix(t2), t3: fix(t3),
    sig, note, color, audio, qty,
    rpu, rwt, rr: fix(rwt / (rpu || 1)),
    posSize: fix(pr * qty),
    probability
  };

  renderPower(lastPowerR);
}

// Render Power Box UI
function renderPower(r) {
  const colorMap = {
    GREEN:  'cg on-green',
    BLUE:   'cb on-blue',
    ORANGE: 'co on-orange',
    YELLOW: 'cy on-yellow'
  };

  const bc = colorMap[r.color];
  const cc = bc.split(' ')[0];
  const barCls = bc.split(' ')[1];

  // Stock info
  document.getElementById('rStock').textContent = '👁 ' + r.sName.toUpperCase();
  document.getElementById('rMode').textContent = powerMode.toUpperCase() + ' MODE';

  document.getElementById('rSig').className = 'r-signal ' + cc;
  document.getElementById('rSig').textContent = r.sig;

  document.getElementById('rNote').className = 'r-note ' + cc;
  document.getElementById('rNote').textContent = r.note;

  document.getElementById('rAudio').textContent = r.audio;

  // Signal bars based on volume ratio
  const av = parseFloat(document.getElementById('iAvgV').value);
  const cv = parseFloat(document.getElementById('iCurV').value);
  const vr = cv / av;
  const activeBars = vr >= 2 ? 5 : vr >= 1.5 ? 4 : vr >= 1 ? 3 : 2;

  document.querySelectorAll('.sig-bar').forEach((b, i) => {
    b.className = 'sig-bar ' + (i < activeBars ? barCls : '');
  });

  // Currency symbol based on stock
  const sym = getCurrSym(r.sName);
  const f = r.price < 10 ? 4 : 2;

  document.getElementById('vEntry').textContent = sym + r.price.toFixed(f);
  document.getElementById('vSL').textContent = sym + r.sl.toFixed(f);
  document.getElementById('vASL').textContent = sym + r.asl.toFixed(f);

  document.getElementById('posSize').textContent = sym + r.posSize.toLocaleString();
  document.getElementById('rrLive').textContent = '1:' + r.rr;
  document.getElementById('probChip').textContent = r.probability + '%';
  document.getElementById('probFill').style.width = r.probability + '%';
}

// Show Full Signal Popup
function showPowerPopup() {
  if (!lastPowerR) return;

  const r = lastPowerR;
  const sym = getCurrSym(r.sName);
  const f = r.price < 10 ? 4 : 2;

  const popupText =
`🚀 [POWER BOX] : ${r.sName}<br>━━━━━━━━━━━━━━━━━━━━━━<br>
MODE   : ${powerMode.toUpperCase()}<br>
SIGNAL : ${r.sig}<br>
PROB   : ${r.probability}%<br>
━━━━━━━━━━━━━━━━━━━━━━<br>
ENTRY  : ${sym}${r.price.toFixed(f)}<br>
SL     : ${sym}${r.sl.toFixed(f)}<br>
ACT SL : ${sym}${r.asl.toFixed(f)}<br>
━━━━━━━━━━━━━━━━━━━━━━<br>
T1     : ${sym}${r.t1.toFixed(f)}<br>
T2     : ${sym}${r.t2.toFixed(f)}<br>
T3     : ${sym}${r.t3.toFixed(f)}<br>
━━━━━━━━━━━━━━━━━━━━━━<br>
POS    : ${sym}${r.posSize.toLocaleString()}<br>
RR     : 1:${r.rr}<br>
RISK   : ${sym}${(r.rpu * r.qty).toFixed(2)}<br>
REW    : ${sym}${(r.rwt * r.qty).toFixed(2)}`;

  document.getElementById('powerPopTxt').innerHTML = popupText;
  openModal('powerPopup');
}

// ─── 3 INTELLIGENCE METERS ───

let audioCtx = null;
let lastVolSpikeTime = 0;

// Initialize Web Audio API
function initAudio() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Audio not available');
    }
  }
}

// Play volume spike beep sound
function playVolumeBeep() {
  initAudio();
  if (!audioCtx) return;

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {}
}

// Render volume bars (live animation)
function renderVolBars() {
  const container = document.getElementById('volBars');
  if (!container) return;

  let html = '';
  for (let i = 0; i < 8; i++) {
    const h = 30 + Math.random() * 70;
    const isRed = Math.random() > 0.7;
    html += `<div class="vol-bar${isRed ? ' red' : ''}" style="height:${h}%"></div>`;
  }
  container.innerHTML = html;
}

// Update all 3 meters with random simulated values
function updatePowerMeters() {
  // Secure Meter
  const secVal = 65 + Math.floor(Math.random() * 25);
  const secValEl = document.getElementById('secVal');

  if (secValEl) {
    secValEl.textContent = secVal + '%';
    document.getElementById('secFill').style.width = secVal + '%';

    const secBadge = document.getElementById('secBadge');
    if (secVal >= 85)      secBadge.textContent = '⭐ ULTRA';
    else if (secVal >= 75) secBadge.textContent = '💪 STRONG';
    else                   secBadge.textContent = '✅ BUY';
  }

  // Volume Meter with sound alert
  const volX = (1 + Math.random() * 2.5).toFixed(1);
  const volValEl = document.getElementById('volVal');

  if (volValEl) {
    volValEl.textContent = volX + 'x';

    const volBadge = document.getElementById('volBadge');
    const volMeter = document.getElementById('volMeter');
    const soundPulse = document.getElementById('soundPulse');

    if (parseFloat(volX) >= 2.0) {
      volBadge.className = 'm-badge b-buy';
      volBadge.textContent = '🚀 SPIKE';
      volMeter.classList.add('alert');
      soundPulse.classList.add('on');

      // Play beep (throttled to once per 6 seconds)
      const now = Date.now();
      if (now - lastVolSpikeTime > 6000) {
        playVolumeBeep();
        lastVolSpikeTime = now;
      }
    } else {
      volBadge.className = 'm-badge b-wait';
      volBadge.textContent = '⚡ NORMAL';
      volMeter.classList.remove('alert');
      soundPulse.classList.remove('on');
    }
  }

  renderVolBars();
}
