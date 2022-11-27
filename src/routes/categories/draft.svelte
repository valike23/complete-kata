<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const { seeding, id, name } = page.query;
    const res = await this.fetch(`api/entries/category?id=${id}`);
    const entries = await res.json();

    return { entries, seeding, id, name };
  }
</script>

<script>
    import axios from "axios";

  import { onMount } from "svelte";
import {goto} from "@sapper/app";
  import TopBar from "../../components/TopBar.svelte";
  import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";

  export let entries = [],
    seeding,
    id,
    name;
  let eightSeeds = [];
  let fourSeeds = [];
  let actualSeed = [];
  let activeSeed = 4;
  let disabled = true;
  let seed;
  let pools = [];
  let totalPools = 0;
  if (entries.length >= 1 && entries.length <= 4) totalPools = 1;
  if (entries.length >= 5 && entries.length <= 24) totalPools = 2;
  if (entries.length >= 25 && entries.length <= 48) totalPools = 4;
  if (entries.length >= 49 && entries.length <= 96) totalPools = 8;
  if (entries.length >= 97 && entries.length <= 192) totalPools = 16;
  if (entries.length >= 193) totalPools = 32;

  const fixSeed = () => {
    console.log(seed);
    const entry = entries[seed];
    if (activeSeed == 4) {
      if (fourSeeds.length < 4) {
        if (fourSeeds.includes(entry)) {
          handleNotification(
            window,
            "entry already in seed",
            EnotificationType.ERROR
          );
          return;
        }
        fourSeeds.push(entry);

        actualSeed = fourSeeds;
        actualSeed = actualSeed;
      } else {
        handleNotification(
          window,
          "you can add any more seed",
          EnotificationType.ERROR
        );
      }
    } else {
      if (eightSeeds.length < 8) {
        if (eightSeeds.includes(entry)) {
          handleNotification(
            window,
            "entry already in seed",
            EnotificationType.ERROR
          );
          return;
        }
        eightSeeds.push(entry);
        actualSeed = eightSeeds;
        actualSeed = actualSeed;
      } else {
        handleNotification(
          window,
          "you can add any more seed",
          EnotificationType.ERROR
        );
      }
    }
  };
  const generatePool = () => {
    for (let index = 0; index < totalPools; index++) {
      pools.push({ poolName: name + " " + "pool" + (index + 1), entries: [] });
    }
  };
  const switchseed = (seedNumber) => {
    if (seedNumber == 4) {
      activeSeed = 4;
      actualSeed = fourSeeds;
      actualSeed = actualSeed;
    } else {
      activeSeed = 8;
      actualSeed = eightSeeds;
      actualSeed = actualSeed;
    }
  };

  const addSeed = () => {};
  const resolveSeeding = () => {
    let firstIndex = 0;
    let lastIndex = pools.length - 1;
    actualSeed.forEach((entry, i) => {
      if (i == 0 || i % 2 == 0) {
        pools[firstIndex].entries.push(entry);
        firstIndex = firstIndex + 1;
      } else {
        pools[lastIndex].entries.push(entry);
        lastIndex = lastIndex - 1;
      }

      let index = 0;
      entries.forEach(function (e, i) {
        if (e.id == entry.id) {
          entries.splice(i, 1);
        }
      });
      if (lastIndex == firstIndex) {
        firstIndex = 0;
        lastIndex = pools.length - 1;
      }
    });
  };
  const addSeedContent = () => {
    let firstIndex = 0;
    let lastIndex = pools.length - 1;
    if (seeding == 1) {
      resolveSeeding();
      let isOdd = actualSeed.length % 2;
      console.log("isodd", isOdd);
      entries.forEach((entry, i) => {
        if (i == 0 || i % 2 == 0) {
          if (isOdd) {
            pools[lastIndex].entries.push(entry);
            lastIndex = lastIndex - 1;
          } else {
            pools[firstIndex].entries.push(entry);
            firstIndex = firstIndex + 1;
          }
        } else {
         if(isOdd){
          pools[firstIndex].entries.push(entry);
            firstIndex = firstIndex + 1;
         }
         else{
          pools[lastIndex].entries.push(entry);
          lastIndex = lastIndex - 1;
         }
        }

        if (lastIndex == firstIndex) {
          firstIndex = 0;
          lastIndex = pools.length - 1;
        }
      });
      pools = pools;
      disabled = false;
    } else {
      entries.forEach((entry, i) => {
        if (i == 0 || i % 2 == 0) {
          pools[firstIndex].entries.push(entry);
          firstIndex = firstIndex + 1;
        } else {
          pools[lastIndex].entries.push(entry);
          lastIndex = lastIndex - 1;
        }
        if (lastIndex == firstIndex) {
          firstIndex = 0;
          lastIndex = pools.length - 1;
        }
      });
      pools = pools;
      disabled = false;
    }
  };
  generatePool();
  const submitDraft =async ()=>{
    console.log(pools);
    let promises =[];
    pools.forEach((pool)=>{
      pool.categoryId = id;
      let form = new FormData();
      form.append('body',JSON.stringify(pool));
      promises.push(axios.post('api/pools', form)); 
    });
  const resp = await Promise.all(promises);
  if(resp){
    if(resp[0].data.status == 'success'){
      handleNotification(window, 'upload successful', 
      EnotificationType.SUCCESS,
      ()=>{goto('/pools')}, goto);
    }
    console.log(resp);
  }
  }
  onMount(() => {});
</script>

<svelte:head>
  <title>Draft Pools</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar />
  <h2>Pool Draft</h2>
  <p>category: {name}</p>

  <div class="row">
    <div class="cell-3">
      <div class="text-center">
        <button
          on:click={() => {
            switchseed(4);
          }}
          class="button primary">4</button
        >

        <button
          on:click={() => {
            switchseed(8);
          }}
          class="button primary">8</button
        >
      </div>
      <div class="row">
        <div class="cell-9">
          <select bind:value={seed} data-role="select">
            <option
              disabled
              selected
              data-template="<span class='mif-amazon icon'></span> $1"
              >Pick Seeds</option
            >
            {#each entries as entry, i}
              <option
                value={i}
                data-template="<img style='width:20px; margin-right:5px' src='{entry.flag}'/> $1"
              >
                {"  " + entry.name}</option
              >
            {/each}
          </select>
        </div>
        <div class="cell-2">
          <button on:click={fixSeed} class="button primary">Add Seed</button>
        </div>
      </div>

      <!-- show the list of seeds here -->
      <div>
        {#each actualSeed as seed}
          <div class="row">
            <div class="cell-2" />
            <div class="cell-8">{seed.name}</div>
          </div>
        {/each}
      </div>
    </div>
    <div class="cell-9 pl-5">
      <div class="row mb-5">
        {#each pools as pool}
          <div class="cell-4">
            <div class="card">
              <div class="card-header">
                <p><strong>{pool.poolName}</strong></p>
              </div>
              <div class="card-body">
                {#each pool.entries as entry}
                  <p>{entry.name}</p>
                {/each}
              </div>
            </div>
          </div>
        {/each}
      </div>
      <div class="row">
        <div class="cell-6">
          <button
            disabled={!disabled}
            on:click={addSeedContent}
            class="button large primary">Generate Draft</button
          >
        </div>
        <div class="cell-6">
          <button {disabled}
          on:click={submitDraft}
           class="button large primary">Upload Draft</button>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    color: black;
  }
  .large {
    width: 100%;
  }
</style>
