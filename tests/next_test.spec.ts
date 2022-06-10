import { chromium, Browser, Page } from 'playwright';
import { test, expect } from '@playwright/test';
import { HEADER } from '../pom/header'
import { grabAllDomainCombos } from '../utils/combinations'
import { markTestStatus, instantiateBrowserstack } from '../utils/browserstack'
import { domains }  from '../fixtures/combos';
import { capabilities }  from '../fixtures/browserstack_capabilities';
import { injectAxe, checkA11y } from 'axe-playwright';
let vPage;
let vBrowser;
let testStatus;
const testing = true;

//const cp = require('child_process');
//const clientPlaywrightVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

test.describe('Testing search bar', () => {
  test.beforeEach(async ( {page} ) => {

    if(testing){
      vBrowser = await instantiateBrowserstack(capabilities, chromium, vBrowser, 'Testing Search Bar');
      vPage = await vBrowser.newPage();  
    }
    else {
      vPage = page;
      await vPage.goto('https://www.next.co.uk/');
    }
    
  });

  test('direct to multiple sites', async ({  }) => {
    const domainList = await grabAllDomainCombos(domains);
    // Create 1st todo.
   for (let i = 0; i < domainList.length;){
       console.log(domainList[i]);
       let url = `https://www.${domainList[i]}`
    await vPage.goto(url);
    testStatus = await expect(vPage).toHaveURL(url);     
    i++;
   }
  })

  test('search for t-shirt', async ({  }) => {
    await vPage.goto('https://www.next.co.uk/');
    await vPage.locator('[class="onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button ot-close-icon"]').click(); //change to find by text Accept all in ultily.
    await vPage.locator(HEADER.SEARCH_INPUT).fill('t-shirt');
    await vPage.locator(HEADER.SEARCH_INPUT).press('Enter');
    testStatus = await expect(vPage.locator(HEADER.RESULT_HEADER)).toContainText('t-shirt');
   }) 

   test.afterEach(async () => {
     if(testing){
      markTestStatus(testStatus, vPage);
      await vPage.close();
      await vBrowser.close();
     }
  }); 
      });  

test.describe('visual regression test', ()=> {
  let browser: Browser
  let page: Page
  test.beforeAll(async ()=>{
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('https://www.next.co.uk/');
  })

  test('check page', async ()=>{
    await page.goto('https://www.next.co.uk/');
    await page.locator('[class="onetrust-close-btn-handler onetrust-close-btn-ui banner-close-button ot-close-icon"]').click();
    await expect(page).toHaveScreenshot('Testing-search-bar-search-for-t-shirt-1-chromium-darwin.png', {threshold:0.2});
  })
  });

test.describe('accessibility test', ()=> {
  let browser: Browser
  let page: Page
  test.beforeAll(async ()=>{
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto('https://www.next.co.uk/');

    await injectAxe(page) // inject axe-core on page
  })

  test.skip('check page', async ()=>{
    await checkA11y(page); // execute axe at this point
  })
  });