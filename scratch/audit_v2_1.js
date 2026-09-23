const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  const viewports = [
    { name: 'desktop_1280', width: 1280, height: 800 },
    { name: 'desktop_1440', width: 1440, height: 900 },
    { name: 'mobile_375', width: 375, height: 812 },
    { name: 'mobile_390', width: 390, height: 844 },
  ];

  const routes = [
    { name: 'landing', url: 'http://localhost:3000/' },
    { name: 'create', url: 'http://localhost:3000/create' },
    { name: 'join', url: 'http://localhost:3000/join' },
  ];

  for (const vp of viewports) {
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const r of routes) {
      await page.goto(r.url, { waitUntil: 'networkidle' });
      await page.screenshot({ path: `C:/Users/divya/.gemini/antigravity-ide/brain/2e701611-29f0-44b2-9c3a-533fa74f7e22/scratch/v21_${r.name}_${vp.name}.png` });
    }

    // Set Session State for room entry test
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      sessionStorage.setItem('syncwatch_session', JSON.stringify({
        userId: 'usr_test_qa',
        reconnectToken: 'tok_test_qa',
        roomId: 'SYNC-TEST1',
        displayName: 'Auditor',
        role: 'host',
        joinedAt: Date.now(),
      }));
    });

    await page.goto('http://localhost:3000/room/SYNC-TEST1', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log(`Viewport ${vp.name} Room window.scrollY: ${scrollY}`);

    await page.screenshot({ path: `C:/Users/divya/.gemini/antigravity-ide/brain/2e701611-29f0-44b2-9c3a-533fa74f7e22/scratch/v21_room_${vp.name}.png` });
    await page.close();
  }

  await browser.close();
  console.log("Visual QA Audit Completed");
})();
