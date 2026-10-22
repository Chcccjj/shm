const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { launchChromium } = require('./helpers/browser.cjs');

(async () => {
  const browser = await launchChromium(chromium);
  try {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    await page.addInitScript(() => { window.requestAnimationFrame = () => 1; });
    await page.goto(pathToFileURL(path.resolve(__dirname, '..', 'simple-harmonic-motion-laboratory.html')).href);

    const results = await page.evaluate(() => {
      document.getElementById('expFd').value = '5';
      const fft = runFFTVal().meta;

      const params = { m: 1, k: 10, kc: 3, z: 0 };
      const dt = 1 / 240;
      const periods = 20;
      const steps = Math.round(periods * 2 * Math.PI / wInCoupled(params.m, params.k) / dt);
      let state = [0.15, 0.15, 0, 0];
      const initial = coupledEnergy(...state, params.m, params.k, params.kc).total;
      let maxModeLeak = 0;
      let maxEnergyDrift = 0;
      for (let i = 0; i < steps; i++) {
        state = advanceStep(MODE.COUPLED, state, params, dt, 'rk4');
        maxModeLeak = Math.max(maxModeLeak, Math.abs(state[0] - state[1]));
        const energy = coupledEnergy(...state, params.m, params.k, params.kc).total;
        maxEnergyDrift = Math.max(maxEnergyDrift, Math.abs(energy - initial) / initial);
      }

      switchMode(MODE.SPRING);
      zetaSl.value = '0';
      readSliders();
      const verification = runVerification().rows.find(row => row.key === 'large');
      return {
        fftFreqErrorPct: freqErrPct(fft.fp, fft.setF),
        fftAmpErrorPct: Math.abs(fft.fpAmp - 1) * 100,
        maxModeLeak,
        maxEnergyDrift,
        eulerError: verification.euler.posErr.rel,
        rk4Error: verification.rk4.posErr.rel,
        undampedHasSteadyState: forcedSteadyStateExists(0),
        dampedHasSteadyState: forcedSteadyStateExists(0.1)
      };
    });

    assert.ok(results.fftFreqErrorPct < 0.1, `FFT frequency error ${results.fftFreqErrorPct}%`);
    assert.ok(results.fftAmpErrorPct < 0.1, `FFT amplitude error ${results.fftAmpErrorPct}%`);
    assert.ok(results.maxModeLeak < 1e-10, `in-phase mode leaked by ${results.maxModeLeak}`);
    assert.ok(results.maxEnergyDrift < 1e-8, `coupled RK4 energy drift ${results.maxEnergyDrift}`);
    assert.ok(results.rk4Error < results.eulerError / 1000,
      `RK4 improvement too small: Euler ${results.eulerError}, RK4 ${results.rk4Error}`);
    assert.equal(results.undampedHasSteadyState, false);
    assert.equal(results.dampedHasSteadyState, true);
    assert.deepEqual(pageErrors, []);
    console.log('physics regression: FFT, normal mode, energy, integrator checks passed');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
