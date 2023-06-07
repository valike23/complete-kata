<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const { id, name, round } = page.query;
    const res = await this.fetch(`api/entries/category?id=${id}`);
    const res2 = await this.fetch(`api/category/details?id=${id}`);
    const entries = await res.json();
    const pools = await res2.json();
    

    return { entries, id, name, pools, round };
  }
</script>
<script>
  import { onMount } from "svelte";

  import TopBar from "../../components/TopBar.svelte";
  import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";
  import { processEntriesArray } from "../../functions/severShared";
  import axios from "axios";

  export let entries, pools, name, round, id;

  let myEntries = [];
  myEntries = pools.pools.map((p) => p.entries);
  let myPools = [];
  onMount(()=>{
    run();
  })

  const run = async () => {
    try {
      const response = await axios.get(`api/category/details?id=${id}`);
      const poolsDetail = response.data;
      console.log("poolsDetail:", pools);

   
      console.log("myEntries:", myEntries);

      myPools = processEntriesArray(poolsDetail.pools, name, round, myEntries);
      console.log("myPools:", myPools);
    } catch (error) {
      console.error(error);
      handleNotification(
        window,
        "Something went wrong",
        EnotificationType.ERROR
      );
    }
  };

  const uploadPools = async () => {
    if (!confirm("Do you want to create the below pools?")) return;
    let promises = [];
    myPools.forEach((pool) => {
      pool.categoryId = id;
      let form = new FormData();
      form.append("body", JSON.stringify(pool));
      promises.push(axios.post("api/pools", form));
    });
    try {
      const resp = await Promise.all(promises);
      if (resp) {
        handleNotification(
          window,
          "Pools created successfully",
          EnotificationType.SUCCESS
        );
        goto("pools");
      }
    } catch (error) {
      console.error(error);
      handleNotification(
        window,
        "Something went wrong",
        EnotificationType.ERROR
      );
    }
  };

 // run();
</script>


<div class="h-100 container-fluid">
  <TopBar active="pools" />

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
        <h3>
          pool name: {item.poolName} <span>round: {"round" + round}</span>
        </h3>
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
