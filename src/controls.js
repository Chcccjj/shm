// ============================================================
//  controls.js — Event handlers for all UI controls
// ============================================================
function setupControls() {
  document.getElementById('langZh').addEventListener('click', function () { applyLang('zh'); });
  document.getElementById('langEn').addEventListener('click', function () { applyLang('en'); });
  document.getElementById('tabPend').addEventListener('click', function () { switchMode(MODE.PENDULUM); });
  document.getElementById('tabSpring').addEventListener('click', function () { switchMode(MODE.SPRING); });

  lenSl.addEventListener('input', function () { readSliders(); resetSim(); });
  gravSl.addEventListener('input', function () { readSliders(); resetSim(); });
  kSl.addEventListener('input', function () { readSliders(); resetSim(); });
  initDispSl.addEventListener('input', function () { readSliders(); resetSim(); });
  angleSl.addEventListener('input', function () { readSliders(); updateWarnVisibility(); resetSim(); });

  massSl.addEventListener('input', function () {
    readSliders();
    if (mode === MODE.PENDULUM) {
      massNote.style.display = 'block';
      clearTimeout(massNote._hide);
      massNote._hide = setTimeout(function () { massNote.style.display = 'none'; }, 2500);
    } else {
      resetSim();
    }
  });
  zetaSl.addEventListener('input', function () { readSliders(); });

  document.querySelectorAll('.grav-preset').forEach(function (b) {
    b.addEventListener('click', function () {
      gravSl.value = b.dataset.g;
      readSliders();
      resetSim();
    });
  });

  dualChk.addEventListener('change', function () {
    dualMode = dualChk.checked;
    if (dualMode) { pend2.theta = pend.theta; pend2.omega = pend.omega; }
  });

  document.getElementById('forceBtn').addEventListener('click', function () { setForceState(!showForces); });

  pauseBtn.addEventListener('click', function () {
    paused = !paused;
    pauseBtn.textContent = T[lang][paused ? 'pauseBtnOn' : 'pauseBtn'];
    pauseBtn.classList.toggle('paused', paused);
  });

  resetBtn.addEventListener('click', resetSim);

  document.getElementById('reportBtn').addEventListener('click', generateReport);

  document.querySelectorAll('.ts-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      timeScale = parseFloat(b.dataset.ts);
      updateTimeScaleUI();
    });
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (!paused) { pausedByVisibility = true; paused = true; }
    } else {
      if (pausedByVisibility) { pausedByVisibility = false; paused = false; }
    }
  });

  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}
