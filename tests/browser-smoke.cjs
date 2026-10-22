const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const { chromium } = require('playwright');
const { launchChromium } = require('./helpers/browser.cjs');

const appUrl = pathToFileURL(path.resolve(__dirname, '..', 'simple-harmonic-motion-laboratory.html')).href;

async function openApp(browser, options = {}) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  if (options.manualAnimationFrame) {
    await page.addInitScript(() => {
      window.__rafQueue = [];
      window.requestAnimationFrame = callback => {
        window.__rafQueue.push(callback);
        return window.__rafQueue.length;
      };
    });
  }
  if (options.storageThrows) {
    await page.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('storage denied'); };
      Storage.prototype.setItem = () => { throw new Error('storage denied'); };
    });
  }
  await page.goto(appUrl, { waitUntil: 'load' });
  return { page, errors };
}

(async () => {
  const browser = await launchChromium(chromium);
  try {
    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true });
      const elapsed = await page.evaluate(() => {
        for (let i = 0; i <= 120; i++) {
          const callback = window.__rafQueue.shift();
          if (!callback) throw new Error('animation callback missing');
          callback(i * 1000 / 120);
        }
        return simTime;
      });
      assert.ok(Math.abs(elapsed - 1) < 0.04, `120 Hz advanced simulation by ${elapsed.toFixed(4)} s instead of 1 s`);
      assert.deepEqual(errors, []);
      await page.close();
    }

    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true });
      const result = await page.evaluate(() => {
        switchMode(MODE.SPRING);
        zetaSl.value = '0.10';
        readSliders();
        document.getElementById('expFd').value = '0.80';
        const run = runForcedExp();
        expResult = run;
        renderExpResult();
        const row = Array.from(document.querySelectorAll('#expOut tr')).find(tr =>
          tr.cells[0] && tr.cells[0].textContent === T[lang].expFreqErr
        );
        return {
          displayed: parseFloat(row.cells[1].textContent),
          expected: freqErrPct(run.meta.fp, run.meta.fd)
        };
      });
      assert.ok(Math.abs(result.displayed - result.expected) < 0.002,
        `forced-spectrum error used the wrong reference: displayed ${result.displayed}, expected ${result.expected}`);
      assert.deepEqual(errors, []);
      await page.close();
    }

    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true });
      const undamped = await page.evaluate(() => {
        switchMode(MODE.SPRING);
        zetaSl.value = '0';
        readSliders();
        document.getElementById('expFd').value = String(springOmega0() / (2 * Math.PI));
        const run = runForcedExp();
        return { noSteady: run.meta.noSteady, amp: run.meta.amp };
      });
      assert.equal(undamped.noSteady, true);
      assert.equal(undamped.amp, null, 'undamped forced motion must not be reported as a steady-state amplitude');

      const popupSafe = await page.evaluate(() => {
        window.open = () => null;
        try { generateReport(); return true; } catch (error) { return error.message; }
      });
      assert.equal(popupSafe, true, `blocked report popup crashed: ${popupSafe}`);
      const springReport = await page.evaluate(() => {
        const chunks = [];
        window.open = () => ({ document: { write: text => chunks.push(text), close: () => {} } });
        generateReport();
        return { html: chunks.join(''), lengthLabel: T[lang].ctrlLen, springLabel: T[lang].ctrlK };
      });
      assert.ok(springReport.html.includes(springReport.springLabel));
      assert.ok(!springReport.html.includes('<td>' + springReport.lengthLabel + '</td>'),
        'spring report included the pendulum-only length parameter');
      assert.deepEqual(errors, []);
      await page.close();
    }

    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true });
      const behavior = await page.evaluate(() => {
        document.getElementById('pauseBtn').click();
        const pausedBeforeSwitch = paused;
        document.getElementById('tabSpring').click();
        const pausedAfterSwitch = paused;
        switchMode(MODE.PENDULUM);
        angleSl.value = '45';
        readSliders();
        return {
          pausedBeforeSwitch,
          pausedAfterSwitch,
          largeAngleAnalyticValid: runVerification().anaValid
        };
      });
      assert.equal(behavior.pausedBeforeSwitch, true);
      assert.equal(behavior.pausedAfterSwitch, true, 'switching model must preserve an explicit pause');
      assert.equal(behavior.largeAngleAnalyticValid, false, 'linear pendulum verification must reject a large-angle setup');
      assert.deepEqual(errors, []);
      await page.close();
    }

    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true });
      const accessibility = await page.evaluate(() => ({
        unlabeledControls: Array.from(document.querySelectorAll('input, select')).filter(control =>
          !control.labels?.length && !control.getAttribute('aria-label') && !control.getAttribute('aria-labelledby')
        ).map(control => control.id),
        languageTags: [document.getElementById('langZh').tagName, document.getElementById('langEn').tagName],
        htmlLang: document.documentElement.lang,
        defaultMethod: method
      }));
      assert.deepEqual(accessibility.unlabeledControls, [], `unlabeled controls: ${accessibility.unlabeledControls.join(', ')}`);
      assert.deepEqual(accessibility.languageTags, ['BUTTON', 'BUTTON']);
      assert.equal(accessibility.defaultMethod, 'rk4');
      await page.evaluate(() => document.getElementById('langEn').click());
      assert.equal(await page.evaluate(() => document.documentElement.lang), 'en');
      assert.deepEqual(errors, []);
      await page.close();
    }

    {
      const { page, errors } = await openApp(browser, { manualAnimationFrame: true, storageThrows: true });
      assert.equal(await page.evaluate(() => typeof simTime), 'number', 'storage denial prevented app initialization');
      await page.evaluate(() => document.getElementById('themeToggle').click());
      assert.deepEqual(errors, []);
      await page.close();
    }

    console.log('browser smoke: 6 scenarios passed');
  } finally {
    await browser.close();
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
