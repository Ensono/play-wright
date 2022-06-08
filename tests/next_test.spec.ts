import { test, expect } from '@playwright/test';
import { HEADER } from '../pom/header'
import { grabAllDomainCombos } from '../utils/combination'
import { markTestStatus } from '../utils/combination'
import {domains}  from '../fixtures/combos';
// const expect = require('chai').expect
import { capabilities }  from '../fixtures/browserstack_capabilities';
const { chromium } = require('playwright');
let pge;
let bwsr;
let testStatus;
// import {test} from '../fixtures/fixture';

const cp = require('child_process');
const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

/* //  The following code loops through the capabilities array defined above and runs your code against each environment that you have specified
capabilities.forEach(async (cap) => {
  await 
}); */

test.beforeEach(async () => {
  capabilities['client.playwrightVersion'] = '1.22.2';  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
  capabilities['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'tinagohil4';
  capabilities['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'BvTgTV4BLzGvsCfkAL6T';
  
  console.log("Starting test -->", capabilities['name']);
  bwsr = await chromium.connect({
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(capabilities))}`,
  });
  pge = await bwsr.newPage();
  // await page.goto('https://www.next.co.uk/');
});


test.describe('Testing search bar', () => {

    test('direct to multiple sites', async () => {
        const domainList = await grabAllDomainCombos(domains);
        // Create 1st todo.
       for (let i = 0; i < domainList.length;){
           console.log(domainList[i]);
           let url = `https://www.${domainList[i]}`
        await pge.goto(url);
        testStatus = await expect(pge).toHaveURL(url);     
        i++;
       }
      })

      test('search for t-shirt', async ({  }) => {
        await pge.goto('https://www.next.co.uk/');
        await pge.locator('[class="onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button ot-close-icon"]').click();
        await pge.locator('[data-testid="header-search-bar-text-input"]').fill('t-shirt');
        await pge.locator('[data-testid="header-search-bar-text-input"]').press('Enter');
        testStatus = await expect(pge.locator(HEADER.RESULT_HEADER)).toContainText('t-shirt');
        // await expect(page).toHaveScreenshot();       
       })
      }); 
      
test.afterEach(async () => {
  markTestStatus(testStatus, pge);
  await pge.close();
  await bwsr.close();
});  