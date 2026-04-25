/* ═══════════════════════════════════════════════
   SIGNAL / SCANNER PAGE — 9 Scanner Boxes
   ═══════════════════════════════════════════════ */

// Render 9 scanner boxes in 3x3 grid
function renderScanners() {
  const html = SCANNERS_DATA.map((sc, i) => `
    <div class="sc-box-scanner" onclick="openScannerModal(${i})">
      <div class="scn-icon">${sc.icon}</div>
      <div class="scn-tag">👁 SCANNER</div>
      <div class="scn-name">${sc.name.replace('\\n', '<br>')}</div>
      <div class="scn-live">
        <div class="live-dot"></div>
        <span>LIVE</span>
      </div>
    </div>
  `).join('');

  document.getElementById('scannerGrid').innerHTML = html;
}

// Open Scanner Performance Modal
function openScannerModal(i) {
  const sc = SCANNERS_DATA[i];

  // Header
  document.getElementById('scModalIcon').textContent = sc.icon;
  document.getElementById('scModalName').textContent = sc.name.replace('\n', ' ');

  // Today's stats
  document.getElementById('scTotal').textContent = sc.total;
  document.getElementById('scWin').textContent = sc.win;
  document.getElementById('scSL').textContent = sc.sl;
  document.getElementById('scPend').textContent = sc.pending;

  // Win Ratio
  const ratio = Math.round((sc.win / sc.total) * 100);
  document.getElementById('scRatioFill').style.width = ratio + '%';
  document.getElementById('scRatioPct').textContent = ratio + '%';

  // BUY/SELL breakdown
  document.getElementById('scBuy').textContent = sc.buy;
  document.getElementById('scSell').textContent = sc.sell;

  // Criteria list
  const criteriaHtml = sc.criteria.map(c => `
    <div class="crit-row-in pass">
      <span class="crit-name-in">✅ ${c}</span>
      <span class="crit-val-in">OK</span>
    </div>
  `).join('');

  document.getElementById('scCritList').innerHTML = criteriaHtml;

  openModal('scannerModal');
}
