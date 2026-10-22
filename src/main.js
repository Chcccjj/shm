// ============================================================
//  main.js — State, DOM refs, core loop, init
// ============================================================

// --- Canvas setup ---
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var wCanvas = document.getElementById('waveCanvas');
var wCtx = wCanvas.getContext('2d');
var phaseCanvas = document.getElementById('phaseCanvas');
var phaseCtx = phaseCanvas.getContext('2d');

function resizeAll() {
  var wrap = canvas.parentElement, w = wrap.clientWidth;
  canvas.width = w * window.devicePixelRatio;
  canvas.height = w / 1.05 * window.devicePixelRatio;
  canvas.style.width = w + 'px';
  canvas.style.height = (w / 1.05) + 'px';
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  var ww = wCanvas.parentElement, ww2 = ww.clientWidth;
  wCanvas.width = ww2 * window.devicePixelRatio;
  wCanvas.height = 100 * window.devicePixelRatio;
  wCanvas.style.width = ww2 + 'px';
  wCanvas.style.height = '100px';
  wCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

  var pw = phaseCanvas.parentElement, pw2 = pw.clientWidth;
  phaseCanvas.width = pw2 * window.devicePixelRatio;
  phaseCanvas.height = 180 * window.devicePixelRatio;
  phaseCanvas.style.width = pw2 + 'px';
  phaseCanvas.style.height = '180px';
  phaseCtx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

resizeAll();
window.addEventListener('resize', resizeAll);

// --- State ---
var mode = MODE.PENDULUM;
var pend = { theta: 0, omega: 0 }, pend2 = { theta: 0, omega: 0 };
var springS = { x: 0, v: 0 };
var L = 2, g = 9.8, mass = 1, initAngle = 15 * Math.PI / 180, k = 10, initDisp = 0.1, zeta = 0;
var dualMode = false, showForces = false, paused = false, pausedByVisibility = false;
var simTime = 0, prevState = 0, lastRise = null, measuredPeriod = null;
var perBuf = [];
var trackedAmp = 0, initialEnergy = 0, timeScale = 1;

var waveData = [];
var waveTick = 0;
var phaseData = [];
var phaseTick = 0;

// --- DOM refs ---
var $ = function (id) { return document.getElementById(id); };
var lenSl = $('lenSlider'), gravSl = $('gravSlider'), massSl = $('massSlider');
var angleSl = $('angleSlider'), zetaSl = $('zetaSlider');
var kSl = $('kSlider'), initDispSl = $('initDispSlider');
var lenV = $('lenVal'), gravV = $('gravVal'), massV = $('massVal'), angleV = $('angleVal'), zetaV = $('zetaVal'), kV = $('kVal'), initDispV = $('dispVal');
var tT = $('tTheory'), tM = $('tMeasured'), fV = $('freqVal');
var thetaV = $('thetaVal'), omegaV = $('omegaVal'), xV = $('xVal'), vV = $('vVal'), aV = $('aVal'), ampV = $('ampVal');
var keV = $('keVal'), peV = $('peVal'), keN = $('keNum'), peN = $('peNum'), totalE = $('totalENum');
var keB = $('keBar'), peB = $('peBar'), deltaEVal = $('deltaEVal');
var liveF = $('liveFormula'), formulaLabel = $('formulaLabel');
var badge = $('badge'), footerMsg = $('footerMsg'), massNote = $('massNote');
var dualChk = $('dualToggle'), pauseBtn = $('pauseBtn'), resetBtn = $('resetBtn');

massNote._hide = null;

// --- Core functions ---

function resetSim() {
  pend.theta = initAngle; pend.omega = 0; pend2.theta = initAngle; pend2.omega = 0;
  springS.x = initDisp; springS.v = 0;
  simTime = 0; lastRise = null; measuredPeriod = null; perBuf.length = 0; trackedAmp = initDisp;
  waveData.length = 0; waveTick = 0;
  phaseData.length = 0; phaseTick = 0;
  var p = mode === MODE.PENDULUM;
  var e = p ? pendEnergy(pend.theta, pend.omega, mass, L, g) : springEnergy(springS.x, springS.v, mass, k);
  initialEnergy = e.total;
}

function detectRise(cur) {
  if (cur >= 0 && prevState < 0 && lastRise !== null) {
    var p = simTime - lastRise;
    if (p > 0.1) {
      perBuf.push(p);
      if (perBuf.length > CONFIG.PER_SAMPLES) perBuf.shift();
      if (perBuf.length >= 2) measuredPeriod = perBuf.reduce(function (a, b) { return a + b; }, 0) / perBuf.length;
    }
  }
  if (cur >= 0 && prevState < 0) lastRise = simTime;
}

function switchMode(m) {
  mode = m;
  var p = mode === MODE.PENDULUM;
  document.querySelectorAll('.mode-tab').forEach(function (t) { t.classList.toggle('active', t.dataset.mode === mode); });
  document.querySelectorAll('.pend-only').forEach(function (e) { e.style.display = p ? '' : 'none'; });
  document.querySelectorAll('.spring-only').forEach(function (e) { e.style.display = p ? 'none' : (e.tagName === 'SPAN' ? 'inline' : ''); });
  document.querySelectorAll('.mode-specific.pend').forEach(function (e) { e.style.display = p ? '' : 'none'; });
  document.querySelectorAll('.mode-specific.spring').forEach(function (e) { e.style.display = p ? 'none' : ''; });
  dualChk.closest('.tgl').style.display = p ? '' : 'none';
  badge.textContent = T[lang][p ? 'badgePend' : 'badgeSpring'];
  badge.className = p ? 'badge' : 'badge blue';
  formulaLabel.innerHTML = T[lang][p ? 'formPend' : 'formSpring'];
  footerMsg.innerHTML = T[lang][p ? 'footerPend' : 'footerSpring'];
  document.getElementById('phaseTitle').innerHTML = lang === 'zh' ? (p ? '相空间 · <i>θ</i>-<i>ω</i>' : '相空间 · <i>x</i>-<i>v</i>') : (p ? 'Phase Space · <i>θ</i>-<i>ω</i>' : 'Phase Space · <i>x</i>-<i>v</i>');
  if (paused) { paused = false; pauseBtn.textContent = T[lang].pauseBtn; pauseBtn.classList.remove('paused'); }
  timeScale = 1; updateTimeScaleUI();
  updateWarnVisibility();
  resetSim();
}

function updateUI() {
  var p = mode === MODE.PENDULUM;
  var Tt = p ? theoT(L, g) : theoS(k, mass), f = 1 / Tt;
  liveF.innerHTML = p ? '<i>T</i> = 2π√(' + L.toFixed(2) + '/' + g.toFixed(2) + ') = ' + Tt.toFixed(3) + ' s' : '<i>T</i> = 2π√(' + mass.toFixed(2) + '/' + k.toFixed(2) + ') = ' + Tt.toFixed(3) + ' s';
  tT.textContent = Tt.toFixed(4) + ' s';
  tM.textContent = measuredPeriod !== null ? measuredPeriod.toFixed(4) + ' s' : T[lang].measWait;
  tM.style.color = measuredPeriod !== null ? '#2a6f8f' : '#9a958f';
  fV.textContent = f.toFixed(4) + ' Hz';
  if (p) {
    thetaV.textContent = (pend.theta * 180 / Math.PI).toFixed(2) + '°';
    omegaV.textContent = pend.omega.toFixed(3) + ' rad/s';
  } else {
    xV.textContent = springS.x.toFixed(4) + ' m';
    vV.textContent = springS.v.toFixed(4) + ' m/s';
    var w0 = Math.sqrt(k / mass);
    aV.textContent = (-w0 * w0 * springS.x - 2 * zeta * w0 * springS.v).toFixed(4) + ' m/s²';
    trackedAmp = Math.max(trackedAmp, Math.abs(springS.x));
    ampV.textContent = trackedAmp.toFixed(4) + ' m';
    document.getElementById('hookeVal').textContent = (-k * springS.x).toFixed(3) + ' N';
  }
  var e = p ? pendEnergy(pend.theta, pend.omega, mass, L, g) : springEnergy(springS.x, springS.v, mass, k);
  keV.textContent = e.ke.toFixed(4) + ' J'; peV.textContent = e.pe.toFixed(4) + ' J';
  keN.textContent = e.ke.toFixed(4) + ' J'; peN.textContent = e.pe.toFixed(4) + ' J';
  totalE.textContent = e.total.toFixed(4);
  var s = e.ke + e.pe;
  keB.style.width = (s > 1e-12 ? e.ke / s * 100 : 0) + '%';
  peB.style.width = (s > 1e-12 ? e.pe / s * 100 : 0) + '%';

  var deltaE = initialEnergy > 0 ? ((e.total - initialEnergy) / initialEnergy * 100) : 0;
  deltaEVal.textContent = (deltaE >= 0 ? '+' : '') + deltaE.toFixed(3) + '%';
  deltaEVal.className = 'energy-error ' + (Math.abs(deltaE) < 0.1 ? 'good' : Math.abs(deltaE) < 1 ? 'warn' : 'bad');
}

function tick() {
  var p = mode === MODE.PENDULUM;
  var dt = CONFIG.DT * timeScale;

  if (!paused) {
    if (p) {
      prevState = pend.theta;
      var r = stepPendulum(pend.theta, pend.omega, L, g, zeta, dt);
      pend.theta = r.theta; pend.omega = r.omega;
      if (dualMode) {
        var r2 = stepPendulum(pend2.theta, pend2.omega, L, g, zeta, dt);
        pend2.theta = r2.theta; pend2.omega = r2.omega;
      }
      if (Math.abs(pend.omega) > 0.0001 || Math.abs(pend.theta) > 0.005) detectRise(pend.theta);
      renderPendulum();
    } else {
      prevState = springS.x;
      var r = stepSpring(springS.x, springS.v, k, mass, zeta, dt);
      springS.x = r.x; springS.v = r.v;
      if (Math.abs(springS.v) > 0.0001 || Math.abs(springS.x) > 0.0005) detectRise(springS.x);
      renderSpring();
    }
    simTime += dt;

    waveTick++;
    if (waveTick % 2 === 0) {
      waveData.push({ t: simTime, disp: p ? pend.theta : springS.x, vel: p ? pend.omega : springS.v });
      if (waveData.length > CONFIG.WAVE_MAX) waveData.shift();
    }

    phaseTick++;
    if (phaseTick % 2 === 0) {
      phaseData.push({ x: p ? pend.theta : springS.x, y: p ? pend.omega : springS.v });
      if (phaseData.length > CONFIG.PHASE_MAX) phaseData.shift();
    }
  } else {
    p ? renderPendulum() : renderSpring();
  }

  renderWaveform();
  renderPhaseSpace();
  updateUI();
  requestAnimationFrame(tick);
}

function readSliders() {
  L = parseFloat(lenSl.value); g = parseFloat(gravSl.value); mass = parseFloat(massSl.value);
  initAngle = parseFloat(angleSl.value) * Math.PI / 180; k = parseFloat(kSl.value); initDisp = parseFloat(initDispSl.value); zeta = parseFloat(zetaSl.value);
  lenV.textContent = L.toFixed(2) + ' m'; gravV.textContent = g.toFixed(2) + ' m/s²';
  massV.textContent = mass.toFixed(2) + ' kg'; angleV.textContent = (initAngle * 180 / Math.PI).toFixed(0) + '°';
  kV.textContent = k.toFixed(1) + ' N/m'; initDispV.textContent = initDisp.toFixed(2) + ' m';
  zetaV.textContent = zeta === 0 ? T[lang].zetaNone : zeta.toFixed(2);
  updateWarnVisibility();
  updateGravityPresetUI();
}

function updateTimeScaleUI() {
  document.querySelectorAll('.ts-btn').forEach(function (b) {
    b.classList.toggle('active', parseFloat(b.dataset.ts) === timeScale);
  });
}

function updateGravityPresetUI() {
  document.querySelectorAll('.grav-preset').forEach(function (b) {
    b.classList.toggle('active', Math.abs(parseFloat(b.dataset.g) - g) < 0.005);
  });
}

function setForceState(on) {
  showForces = on;
  var fbEl = document.getElementById('forceBtn');
  fbEl.textContent = T[lang][on ? 'forceBtnOn' : 'forceBtn'];
  fbEl.classList.toggle('on', on);
}

// --- Init ---
applyTheme();
setupControls();
readSliders();
resetSim();
tick();
