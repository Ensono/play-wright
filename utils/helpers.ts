export async function grabAllDomainCombos (obj: any){
   let queue = [obj]
   let values = []
   while (queue.length > 0){
     let current = queue.shift();
     for (let val of Object.values(current)){
       if(typeof val === "object") queue.push(val);
       else values.push(val);
     }
   }
   return values;
}

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
  capabilities['browserstack.username'] = process.env.BROWSERSTACK_USERNAME || 'tinagohil4';
  capabilities['browserstack.accessKey'] = process.env.BROWSERSTACK_ACCESS_KEY || 'BvTgTV4BLzGvsCfkAL6T';
  
  console.log("Starting test -->", capabilities[testName]);
  vBrowser = await chromium.connect({
      wsEndpoint: `wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(capabilities))}`,
  });
  return vBrowser;
}