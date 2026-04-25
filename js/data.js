// TRINETRA DATA
const INDICES = [
  {name:'EUR/USD',val:1.0845,chg:0.0023,pct:0.21,open:1.0822,high:1.0860,low:1.0810,prev:1.0822},
  {name:'GOLD',val:2685,chg:12,pct:0.45,open:2673,high:2692,low:2668,prev:2673},
  {name:'NIFTY OPT',val:24150,chg:145,pct:0.61,open:24005,high:24210,low:23980,prev:24005},
  {name:'PROFILE',isProfile:true},
];

const QUICK = [
  {label:'USD/INR',val:'83.12',note:'↑'},
  {label:'DXY',val:'103.4',note:'NTRL'},
  {label:'BRENT',val:'78.20',note:'↑'},
  {label:'VIX',val:'14.5',note:'LOW'},
  {label:'10Y',val:'4.23%',note:'↑'},
];

const SECTORS = [
  {name:'EUR/USD',up:7,dn:2,cl:'sc-1'},{name:'GBP/USD',up:6,dn:3,cl:'sc-3'},
  {name:'USD/JPY',up:5,dn:4,cl:'sc-5'},{name:'AUD/USD',up:4,dn:5,cl:'sc-6'},
  {name:'USD/CHF',up:3,dn:6,cl:'sc-8'},{name:'USD/CAD',up:5,dn:4,cl:'sc-5'},
  {name:'NZD/USD',up:6,dn:3,cl:'sc-3'},{name:'USD/INR',up:8,dn:1,cl:'sc-1'},
  {name:'EUR/GBP',up:4,dn:5,cl:'sc-6'},{name:'EUR/JPY',up:7,dn:2,cl:'sc-2'},
  {name:'GOLD',up:9,dn:0,cl:'sc-0'},{name:'SILVER',up:8,dn:1,cl:'sc-1'},
  {name:'COPPER',up:6,dn:3,cl:'sc-3'},{name:'CRUDE',up:2,dn:7,cl:'sc-11'},
  {name:'NAT GAS',up:3,dn:6,cl:'sc-9'},{name:'ZINC',up:5,dn:4,cl:'sc-5'},
  {name:'NICKEL',up:4,dn:5,cl:'sc-6'},{name:'ALUMIN.',up:6,dn:3,cl:'sc-3'},
  {name:'LEAD',up:3,dn:6,cl:'sc-9'},
];

const SCANNERS = [
  {name:'MORNING<br>BELL',icon:'🔔'},{name:'MAHAKAL',icon:'⚡'},{name:'BHERVE',icon:'🌊'},
  {name:'INDEX<br>POWER',icon:'📡'},{name:'TRISHUL',icon:'🔱'},{name:'SUDARSHAN',icon:'☸️'},
  {name:'BRAHMASTRA',icon:'💥'},{name:'EXPIRY<br>SCALPER',icon:'⏱️'},{name:'ALL-IN-ONE',icon:'🚐'},
];

const CHART_STOCKS = {
  'EUR/USD':{price:1.0845,f:1.0840,vp:1.0820,chg:0.21},
  'GBP/USD':{price:1.2680,f:1.2675,vp:1.2650,chg:0.18},
  'USD/JPY':{price:149.85,f:149.80,vp:149.50,chg:0.22},
  'GOLD':{price:2685,f:2680,vp:2673,chg:0.45},
  'SILVER':{price:31.25,f:31.20,vp:30.90,chg:1.2},
  'CRUDE':{price:78.20,f:78.50,vp:79.60,chg:-1.8},
  'NIFTY':{price:24150,f:24120,vp:24005,chg:0.61},
  'SENSEX':{price:79850,f:79800,vp:79430,chg:0.53},
};

const INDICATORS = [
  {n:'RSI',v:'61',s:'BUY',cls:'buy'},{n:'MACD',v:'+7.0',s:'BUY',cls:'buy'},
  {n:'ADX',v:'12',s:'NTRL',cls:'ntrl'},{n:'CCI',v:'142',s:'BUY',cls:'buy'},
  {n:'MFI',v:'69',s:'BUY',cls:'buy'},{n:'OBV',v:'+407K',s:'BUY',cls:'buy'},
  {n:'CVD',v:'+427K',s:'BUY',cls:'buy'},{n:'ATR',v:'58.9',s:'SELL',cls:'sell'},
  {n:'STOCH',v:'69',s:'NTRL',cls:'ntrl'},{n:'Z-LAG',v:'24958',s:'BUY',cls:'buy'},
  {n:'ORB',v:'BRK↑',s:'BUY',cls:'buy'},{n:'VWAP',v:'1.0840',s:'BUY',cls:'buy'},
  {n:'PCR',v:'1.00',s:'NTRL',cls:'ntrl'},{n:'OI',v:'+7.3%',s:'BUY',cls:'buy'},
  {n:'VROC',v:'+402%',s:'BUY',cls:'buy'},{n:'MFI-D',v:'69',s:'BUY',cls:'buy'},
];

const WATCHLIST = [
  {name:'EUR/USD',price:1.0845,scan:'TS',sig:'BUY',score:94},
  {name:'GOLD',price:2685.00,scan:'BMS',sig:'BUY',score:93},
  {name:'GBP/USD',price:1.2680,scan:'SS',sig:'BUY',score:92},
  {name:'SILVER',price:31.25,scan:'AiO',sig:'BUY',score:91},
  {name:'USD/JPY',price:149.85,scan:'IND',sig:'SELL',score:90},
  {name:'COPPER',price:4.28,scan:'BMS',sig:'BUY',score:89},
  {name:'NIFTY',price:24150,scan:'TS',sig:'BUY',score:88},
  {name:'SENSEX',price:79850,scan:'SS',sig:'BUY',score:87},
  {name:'CRUDE',price:78.20,scan:'SCP',sig:'SELL',score:86},
  {name:'USD/INR',price:83.12,scan:'IND',sig:'BUY',score:85},
  {name:'AUD/USD',price:0.6620,scan:'MH',sig:'SELL',score:84},
  {name:'NAT GAS',price:2.85,scan:'SCP',sig:'SELL',score:83},
  {name:'USD/CAD',price:1.3650,scan:'BMS',sig:'BUY',score:82},
  {name:'BANKNIFTY',price:51320,scan:'AiO',sig:'BUY',score:80},
];

const PNL = {'1D':{val:'+$245.50',trades:14,acc:'78%'},'1W':{val:'+$1820',trades:68,acc:'72%'},'1M':{val:'+$7340',trades:284,acc:'74%'}};
