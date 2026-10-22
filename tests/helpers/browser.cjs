const fs = require('node:fs');

function launchChromium(chromium) {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  const executablePath = candidates.find(candidate => fs.existsSync(candidate));
  return chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
}

module.exports = { launchChromium };
