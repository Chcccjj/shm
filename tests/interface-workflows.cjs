const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { launchChromium } = require('./helpers/browser.cjs');

(async () => {
  const browser = await launchChromium(chromium);
  try {
    const page = await browser.newPage({ viewport: { width: 1100, height: 850 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => { window.requestAnimationFrame = () => 1; });
    await page.goto(pathToFileURL(path.resolve(__dirname, '..', 'simple-harmonic-motion-laboratory.html')).href);

    await page.click('#tabSpring');
    assert.equal(await page.evaluate(() => mode), 'spring');
    await page.click('#verifyBtn');
    await page.click('#runVerifyBtn');
    assert.ok(await page.locator('#verifyOut tr').count() >= 3);

    await page.click('#expBtn');
    await page.selectOption('#expKind', 'energy');
    await page.click('#expRunBtn');
    assert.equal(await page.evaluate(() => expResult && expResult.kind), 'energy');

    await page.selectOption('#expKind', 'fft_val');
    await page.fill('#expFd', '5');
    await page.click('#expRunBtn');
    await page.waitForFunction(() => expResult && expResult.kind === 'fft_val', null, { polling: 50 });
    assert.ok(await page.locator('#expOut table').count() === 1);

    await page.locator('#zetaSlider').evaluate(el => {
      el.value = '0.1';
      el.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.selectOption('#expKind', 'forced');
    await page.fill('#expDiscard', '2');
    await page.selectOption('#expPeriods', '4');
    await page.click('#expRunBtn');
    await page.waitForFunction(() => expResult && expResult.kind === 'forced', null, { polling: 50 });
    assert.equal(await page.evaluate(() => expResult.meta.noSteady), false);

    await page.selectOption('#expKind', 'resonance');
    await page.fill('#expFrom', '0.2');
    await page.fill('#expTo', '1.0');
    await page.fill('#expPts', '8');
    await page.fill('#expDiscard', '2');
    await page.click('#expRunBtn');
    await page.waitForFunction(() => expResult && expResult.kind === 'resonance' && !expBusy, null, { timeout: 10000, polling: 50 });
    assert.equal(await page.evaluate(() => expResult.rows.length), 8);

    await page.click('#tabCoupled');
    await page.click('#injOut');
    assert.deepEqual(await page.evaluate(() => [coup.x1, coup.x2]), [0.15, -0.15]);
    await page.click('#langEn');
    assert.equal(await page.locator('#tabCoupled').textContent(), 'Coupled Pair');
    await page.click('#themeToggle');
    assert.equal(await page.locator('body').evaluate(el => el.classList.contains('dark')), true);

    assert.deepEqual(errors, []);
    console.log('interface workflows: modes, verification, experiments, i18n, theme passed');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
