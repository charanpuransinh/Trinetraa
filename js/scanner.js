/* ═══════════════════════════════════════════════
   SCANNER PAGE (signal.html) — 9 Scanner Grid
   ═══════════════════════════════════════════════ */

// Render 9 scanner boxes
function renderScanners() {
  const grid = document.getElementById('scnGrid');
  if (!grid) return;
  if (typeof SCANNERS === 'undefined') {
    console.warn('[scanner] data.js not loaded yet');
    return;
  }

  grid.innerHTML = SCANNERS.map((sc, i) => `
    <div class="scn-box" onclick="openScannerDetail(${i})">
      <div class="scn-icon">${sc.icon}</div>
      <div class="scn-name">${sc.name}</div>
      <div class="scn-live"><div class="live-dot"></div>LIVE</div>
    </div>
  `).join('');
}

// Open scanner detail (placeholder — can be expanded)
function openScannerDetail(i) {
  if (typeof SCANNERS === 'undefined') return;
  const sc = SCANNERS[i];
  const name = sc.name.replace(/<br>/g, ' ');
  if (typeof toast === 'function') {
    toast(sc.icon + ' ' + name + ' scanner');
  }
}

// INIT
function initScanner() {
  renderScanners();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScanner);
} else {
  initScanner();
}
window.addEventListener('page:signal', initScanner);

// Expose globally
window.initScanner = initScanner;
window.renderScanners = renderScanners;
window.openScannerDetail = openScannerDetail;
