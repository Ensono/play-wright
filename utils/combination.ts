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

export async function markTestStatus( status, pge ){
  if (status = true) {
    pge.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'passed',reason: 'Test Passed'}})}`);
  }
  else if (status = null || false) {
    pge.evaluate(_ => {}, `browserstack_executor: ${JSON.stringify({action: 'setSessionStatus',arguments: {status: 'failed',reason: 'Test Failed'}})}`);

  }
}