export async function markTestStatus( status, vPage ){
    if (status = true) {
      vPage.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Test Passed'}})}`);
    }
    else if (status = null || false) {
      vPage.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Test Failed'}})}`);
  
    }
  }
  
  export async function instantiateBrowserstack( capabilities, chromium, vBrowser, testName ){
    capabilities['client.playwrightVersion'] = '1.22.2';  // Playwright version being used on your local project needs to be passed in this capability for BrowserStack to be able to map request and responses correctly
    capabilities['browserstack.username'] = process.env.BROWSERSTACK_USERNAME;
    capabilities['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY;
    capabilities['name'] = testName;
    
    console.log("Starting test -->", capabilities['name']);
    vBrowser = await chromium.connect(`wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(capabilities))}`);
    return vBrowser;
  }