

export interface ImodelResp {
  status: string;
  body: any
}
export function processEntriesArray(pools: any[], name, round, entires) {
  const finalArray = JSON.parse(JSON.stringify(pools));
  finalArray.forEach((pool, i) => {
    if(pool.round == round){
      console.log('entry no', i ,' :', entires[i])
      const resp = sortEntriesByTotal(entires[i]);
      finalArray[i].entries = resp;
    }
    
  })
  finalArray.forEach((pool, i) => {
    console.log('the pool thing', pool);
    const resp = reduceEntries(pool.entries);
    finalArray[i].entries = resp;
  })

  console.log('reduced array', finalArray);

  return generateNewPools(finalArray, round, name);
}

//sort base on total scores
function sortEntriesByTotal(entries) {
  entries.sort((a, b) => b.pool_entries.total - a.pool_entries.total);
  return entries;
}


//function to reduce the entries in a pool
function reduceEntries(entries: any[]) {
  if (entries.length > 4) return entries.splice(3);

  if (entries.length == 4) return entries.splice(2);

  return entries;
}
//generate new pools 

function generateNewPools(pools: any[], round, name) {
  try {
    if (pools.length <= 2) {
      if (pools[0].entries.length < 4 && pools[1].entries.length < 4) return finalBout(pools, name, round);
      // handle 2 pools but4 entries
      if(pools[0].entries.length == 4 ) return combine2x4x(pools, name, round);
      

    }
    else {
      // 4 pools
      if(pools.length == 4) return combine4x8x(pools, name, round);
      // 8 pools 8 entires  

      //16 pools 8 entries

    
    }
  } catch (error) {

  }
}


function finalBout(pools: any[], name, round) {
  const finPools = [];
  const goldMedalBout = {
    poolName: name + ' ' + 'Gold Medal',
    round: Number(round) + 1,
    entries: []
  };
  const firstBronzeMedalBout = {
    poolName: name + ' ' + 'First Bronze Medal',
    round: Number(round) + 1,
    entries: []
  };
  const secondBronzeMedalBout = {
    poolName: name + ' ' + 'Second Bronze Medal',
    round: Number(round) + 1,
    entries: []
  };
  goldMedalBout.entries.push(pools[0].entries[0]);
  goldMedalBout.entries.push(pools[1].entries[0]);
  if (pools[0].entries.length > 1) firstBronzeMedalBout.entries.push(pools[0].entries[1]);
  if (pools[1].entries.length > 1) firstBronzeMedalBout.entries.push(pools[1].entries[2]);
  if (pools[0].entries.length > 2) secondBronzeMedalBout.entries.push(pools[0].entries[2]);
  if (pools[1].entries.length > 2) secondBronzeMedalBout.entries.push(pools[1].entries[1]);
  // add the new pools to the final pools array
  finPools.push(goldMedalBout);
  finPools.push(firstBronzeMedalBout);
  finPools.push(secondBronzeMedalBout);
  return finPools;
}

function combine4x8x(pools: any[], name, round){
  let newPools: any[] = [];
  let pool1 = {poolName: name + 'R' + Number(round) + 1 + '-G1' ,
  round: Number(round) + 1,
  entries: []};
  let pool2 = {poolName: name +  'R' + Number(round) + 1 +'-G2' ,
  round: Number(round) + 1,
  entries: []};
  pools[0].entries((entry)=>{
    pool1.entries.push(entry);
  });
  pools[1].entries((entry)=>{
    pool1.entries.push(entry);
  });
  pools[2].entries((entry)=>{
    pool2.entries.push(entry);
  });
  pools[3].entries((entry)=>{
    pool2.entries.push(entry);
  });
  newPools.push(pool1);
  newPools.push(pool2);
  return newPools;
}

function combine2x4x(pools: any[], name, round){
  console.log('entered here2', pools);
  let newPools: any[] = [];
  let pool1 = {poolName: name + ' -R' + (Number(round) + 1) + '-G1' ,
  round: Number(round) + 1,
  entries: []};
  let pool2 = {poolName: name +  ' -R' + (Number(round) + 1 )+'-G2' ,
  round: Number(round) + 1,
  entries: []};
  console.log('pools test', pool1, pool2);
  console.log(pools[0].entries);
  pools[0].entries.forEach((entry)=>{
    console.log('entry here', entry);
    pool1.entries.push(entry);
  });
  pools[1].entries.forEach((entry)=>{
    pool2.entries.push(entry);
  });
  newPools.push(pool1);
  newPools.push(pool2);
  console.log('new pools', newPools);
  return newPools;
}
