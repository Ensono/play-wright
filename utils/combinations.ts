require('dotenv').config();

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