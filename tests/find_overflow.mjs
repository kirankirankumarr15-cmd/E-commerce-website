import { chromium } from 'playwright-core';

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('https://e-commerce-website-three-orpin.vercel.app', { waitUntil: 'networkidle' });

  const overflowingElements = await page.evaluate(() => {
    const docWidth = document.documentElement.clientWidth;
    const overflowing = [];
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.right > docWidth + 1) {
        overflowing.push({
          tagName: el.tagName,
          className: el.className,
          id: el.id,
          right: Math.round(rect.right),
          width: Math.round(rect.width),
          docWidth,
        });
      }
    });
    return overflowing.slice(0, 10);
  });

  console.log('OVERFLOWING ELEMENTS ON MOBILE (390px):', overflowingElements);
  await browser.close();
})();
