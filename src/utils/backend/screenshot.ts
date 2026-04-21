import puppeteer, { type Browser } from 'puppeteer-core';

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

async function getBrowser(): Promise<Browser> {
  // Local development: use the installed system Chrome/Chromium
  if (process.env.NODE_ENV === 'development') {
    // Fallback candidates for local Windows/Mac/Linux
    const localExecutables = [
      // Windows
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      // Mac
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      // Linux
      '/usr/bin/google-chrome',
      '/usr/bin/chromium-browser',
    ];

    // Allow override via env var (most reliable for local dev)
    const executablePath =
      process.env.CHROME_EXECUTABLE_PATH ?? localExecutables[0];

    return puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  // Production (Vercel): use @sparticuz/chromium
  const chromium = await import('@sparticuz/chromium').then((m) => m.default);
  return puppeteer.launch({
    args: chromium.args,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
}

export async function generateScreenshot(url: string): Promise<Buffer> {
  if (!isValidUrl(url)) {
    throw new Error(`Invalid or disallowed URL: ${url}`);
  }

  const browser = await getBrowser();

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });

    // Block heavy resources to speed up load & reduce timeouts
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['font', 'media', 'websocket'].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    // `networkidle2` (2 connections or fewer) is more reliable than `networkidle0`
    // on SPAs. Fall back to `domcontentloaded` on timeout.
    await page
      .goto(url, { waitUntil: 'networkidle2', timeout: 15000 })
      .catch(() =>
        page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }),
      );

    // Hide cookie banners and overlays
    await page.evaluate(() => {
      const selectors = [
        '[id*="cookie"]',
        '[class*="cookie"]',
        '[id*="consent"]',
        '[class*="consent"]',
        '#onetrust-consent-sdk',
        '[class*="modal"]',
        '[class*="overlay"]',
        '[class*="banner"]',
      ];
      selectors.forEach((s) => {
        document.querySelectorAll(s).forEach((el) => {
          (el as HTMLElement).style.display = 'none';
        });
      });
    });

    // Short wait for any layout shifts/animations to settle
    await new Promise((r) => setTimeout(r, 500));

    const buffer = await page.screenshot({ type: 'jpeg', quality: 85 });
    return buffer as Buffer;
  } finally {
    await browser.close();
  }
}
