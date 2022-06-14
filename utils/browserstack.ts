import { chromium} from 'playwright';


export async function markTestStatus( status, vPage ){
  if (status = true) {
    await vPage.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Test Passed'}})}`);
  }
  else if (status = null || false) {
   await  vPage.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Test Failed'}})}`);

  }
}

export async function instantiateBrowserstack( capabilities, vBrowser, testName ){
  capabilities['client.playwrightVersion'] = '1.22.2';  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
  console.log(process.env.BROWSERSTACK_USERNAME, process.env.BROWSERSTACK_ACCESS_KEY)
  capabilities['browserstack.username'] = process.env.BROWSERSTACK_USERNAME;
  capabilities['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY;
  capabilities['name'] = testName;
  
  console.log("Starting test -->", capabilities['name']);
  console.log(`wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(capabilities))}`)
  
  vBrowser =  await chromium.connect({
    wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${(encodeURIComponent(JSON.stringify(capabilities)))}`
});
  return vBrowser;
};