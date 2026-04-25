/* ═══════════════════════════════════════════════
   NAVIGATION — Page Switching Logic
   ═══════════════════════════════════════════════ */

/**
 * Switch to a specific page by hiding all and showing the target
 * @param {string} page - Page name (home, signal, power, chart, watchlist, admin)
 */
function navTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  // Show target page
  const targetPage = document.getElementById('page-' + page);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Update bottom nav active state
  setActiveNav(page);

  // Special handling: re-render chart when chart page opens
  if (page === 'chart') {
    setTimeout(() => {
      if (typeof renderChart === 'function') renderChart();
    }, 50);
  }

  // Special handling: refresh watchlist when watchlist page opens
  if (page === 'watchlist') {
    if (typeof renderWatchlist === 'function') renderWatchlist();
  }
}
