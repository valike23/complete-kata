<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const {  id, name , round} = page.query;
    const res = await this.fetch(`api/entries/category?id=${id}`);
    const res2 = await this.fetch(`api/category/details?id=${id}`);
    const res3 = await this.fetch(`api/pools/special?categoryId=${id}&round=${round}`)
    const entries = await res.json();
    const pools = await res2.json();
    const poolsDetail = await res3.json();

    return { entries, id, name , pools,round, poolsDetail};
  }
</script>

<script >

import TopBar from "../../components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "../../functions/browserFunctions";
  import { processEntriesArray } from "../../functions/severShared";
  import axios from 'axios';

  
  export let entries, pools, poolsDetail, name, round, id;

  console.log('entries', entries, 'and  pools', pools);
  console.log(poolsDetail);
  let myPools = [];
  const uploadPools = async () =>{
    if(!confirm('do you want to create the below pools?')) return;
    let promises = [];
    myPools.forEach((pool)=>{
      pool.categoryId = id;
      let form = new FormData();
      form.append('body',JSON.stringify(pool));
      promises.push(axios.post('api/pools', form));
    })
    try {
      const resp = await Promise.all(promises);
      if(resp){
        handleNotification(window, 'pools created successfully', EnotificationType.SUCCESS);
        goto("pools");
      }
    } catch (error) {
      console.log(error);
      handleNotification(window, 'something went wrong', EnotificationType.ERROR);
    }
  
   
  }

   myPools = processEntriesArray(poolsDetail,name, round );
  console.log('final app2: ',processEntriesArray(poolsDetail,name, round ));
</script>
<div class="h-100 container-fluid">
  <TopBar active="pools"/>

  <div class="row mb-3 mt-5">
    <div class="cell">
      <button on:click={uploadPools} class="button primary">
       upload pool
      </button>
    </div>
  </div>

  <div class="row mb-3">
   {#each myPools as item}
    <div class="col mr-2">
      <h3>pool name: {item.poolName}  <span>round: {'round' + round}</span></h3>
      <table class="table">
        <thead style="color: white">
        <tr>
            <th>#</th>
            <th> Name</th>
        </tr>
        </thead>
        <tbody>
       {#each item.entries as entry, i}
       <tr>
        <td>{i + 1}</td>
        <td>{entry.name}</td>
    </tr>
       {/each}
        </tbody>
    </table>
    </div>
   {/each}
  </div>


</div>
