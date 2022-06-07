const expect = require('chai').expect
const capabilities = require();
const { chromium } = require('playwright');

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

const main = async (cap) => {
    cap['client.playwrightVersion'] = clientPlaywrightVersion;  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
    cap['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'tinagohil4';
    cap['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'BvTgTV4BLzGvsCfkAL6T';
    
    console.log("Starting test -->", cap['name']);
    const browser = await chromium.connect({
        wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(cap))}`,
    });
    const page = await browser.newPage();
    await page.goto('https://www.google.com/ncr');
    const element = await page.$('[aria-label="Search"]');
    await element.click();
    await element.type('BrowserStack');
    await element.press('Enter');
    const title = await page.title('');
    console.log(title);
    try {
        expect(title).to.equal("BrowserStack - Google Search", 'Expected page title is incorrect!');
        // following line of code is responsible for marking the status of the test on BrowserStack as 'passed'. You can use this code in your after hook after each test
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Title matched'}})}`);
      } catch {
        await page.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Title did not match'}})}`);
      }
    await browser.close();
};


//  The following code loops through the capabilities array defined above and runs your code against each environment that you have specified
capabilities.forEach(async (cap) => {
  await main(cap);
});