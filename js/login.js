/* ═══════════════════════════════════════════════
   LOGIN — Authentication & Broker Setup
   ═══════════════════════════════════════════════ */

// Stores user info during login flow
let pendingUser = { name: '', broker: '' };

// Broker-specific API help text
const BROKER_HELP = {
  'Pepperstone':         'Login to Pepperstone → Account → API Access → Generate API Key',
  'Interactive Brokers': 'Login to IBKR Client Portal → Settings → API → Configure',
  'Saxo Bank':           'Login to Saxo Developer Portal → developer.saxo → Create App',
  'IC Markets':          'Login to IC Markets Secure Client Area → API → Request Access',
  'Exness':              'Login to Personal Area → API → Generate Token',
  'XM':                  'Contact XM Support to enable API access for your account',
  'OANDA':               'Login to OANDA fxTrade → My Account → API Access → Generate Token',
  'FXTM':                'Login to FXTM MyFXTM → Account → API Settings',
  'Tickmill':            'Login to Tickmill Portal → Profile → API Management',
};

// Step 1: Initial login
function doLogin() {
  const name = document.getElementById('fullName').value.trim();
  const broker = document.getElementById('brokerSel').value;

  if (!name) {
    toast('⚠️ Enter full name');
    return;
  }

  // Simulate 2-step verification
  showLoading('LAYER 1 — BIOMETRIC...');
  setTimeout(() => {
    showLoading('LAYER 2 — TOTP CHECK...');
    setTimeout(() => {
      hideLoading();
      goToBrokerSetup(name, broker);
    }, 600);
  }, 600);
}

// Biometric quick login
function doBio() {
  showLoading('🔐 BIOMETRIC SCAN...');
  setTimeout(() => {
    hideLoading();
    const name = document.getElementById('fullName').value.trim() || 'Trader';
    const broker = document.getElementById('brokerSel').value || 'Pepperstone';
    goToBrokerSetup(name, broker);
  }, 1000);
}

// Step 2: Move to Broker Setup screen
function goToBrokerSetup(name, broker) {
  pendingUser = { name, broker };

  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('brokerSetupScreen').style.display = 'flex';

  // Clean broker name (remove parentheses)
  const cleanBroker = broker.replace(/\s*\(.*\)/, '');
  document.getElementById('brSetupTitle').textContent = cleanBroker.toUpperCase() + ' SETUP';

  // Set broker-specific help text
  let helpKey = Object.keys(BROKER_HELP).find(k =>
    broker.toUpperCase().includes(k.toUpperCase())
  ) || 'Pepperstone';

  document.getElementById('apiHelp').textContent = BROKER_HELP[helpKey];
}

// Step 3: Connect with broker API credentials
function doBrokerConnect() {
  const apiKey = document.getElementById('apiKey').value.trim();
  const apiSecret = document.getElementById('apiSecret').value.trim();
  const clientId = document.getElementById('clientId').value.trim();

  if (!apiKey) {
    toast('⚠️ Enter API Key');
    return;
  }

  if (!apiSecret) {
    toast('⚠️ Enter API Secret');
    return;
  }

  if (!clientId) {
    toast('⚠️ Enter Client ID');
    return;
  }

  // Save credentials (in production, encrypt these!)
  try {
    localStorage.setItem('trinetra_broker', JSON.stringify({
      broker: pendingUser.broker,
      apiKey: apiKey,
      clientId: clientId,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.warn('LocalStorage not available');
  }

  // Animated connection sequence
  showLoading('🔗 CONNECTING TO BROKER...');
  setTimeout(() => {
    showLoading('✅ VERIFYING CREDENTIALS...');
    setTimeout(() => {
      showLoading('🔄 FETCHING MARKET DATA...');
      setTimeout(() => {
        hideLoading();
        enterApp(pendingUser.name, pendingUser.broker);
        toast('✅ Connected to ' + pendingUser.broker);
      }, 800);
    }, 700);
  }, 700);
}

// Skip broker setup (Demo mode)
function skipBrokerSetup() {
  confirmAction(
    'Demo mode में चलाना है? Live trading के लिए बाद में setup कर सकते हैं।',
    () => {
      enterApp(pendingUser.name, pendingUser.broker);
      toast('🎮 Demo Mode Active');
    }
  );
}

// Step 4: Enter the main app
function enterApp(name, broker) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('brokerSetupScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';

  const firstName = name.split(' ')[0];
  const cleanBroker = broker.replace(/\s*\(.*\)/, '');

  // Update Admin page profile
  document.getElementById('avatarLetter').innerHTML =
    firstName[0].toUpperCase() + '<div class="active-dot"></div>';
  document.getElementById('adminId').textContent = 'ID: ' + firstName + '007';
  document.getElementById('adminBroker').textContent = cleanBroker.toUpperCase();

  // Go to Home
  navTo('home');

  // Start live data updates
  if (typeof initLive === 'function') initLive();
}

// Panic Exit - close all positions
function panicExit() {
  confirmAction(
    '🚨 PANIC EXIT सभी positions close करेगा। Confirm?',
    () => toast('🚨 All positions closed!')
  );
}

// Logout
function doLogout() {
  confirmAction('Logout करना है?', () => {
    document.getElementById('appShell').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    toast('⏻ Logged out');
  });
}
