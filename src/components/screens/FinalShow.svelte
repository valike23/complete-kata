<script>
import axios from "axios";
import { onMount } from "svelte";

export let pool;
let club1 = {};
let club2 = {};
console.log("final pool", pool);
onMount(async () => {
    club1 = (await axios.get("api/club?id=" + pool.entries[0].clubId)).data;
    club2 = (await axios.get("api/club?id=" + pool.entries[1].clubId)).data;
    console.log("the club is", club1, club2);
});
</script>

<div class="container-fluid">
  <div class="container pt-5" style="background-color: black;">
    <div class="row mt-5 text-center justify-content-center">
      <div class="col-12" style="background-color: gray;">
        <h1 class="display-1">{pool.poolName}</h1>
      </div>
    </div>
    {#each pool.entries as entry, i}
    <div class="row large" style="border-bottom:2px solid white; border-right: 2px solid white">
      <div class="col-12" class:red={i == 0} class:blue={i == 1}>
        <h1 class="pl-3 font-weight-bold">
          <span style="font-weight:800">{entry.name || "test athlete name"}</span>
          <small style="color: white">
            {#if i == 0}
            ({club1.clubName})
            {:else}
            ({club2.clubName})
            {/if}
          </small>
        </h1>
      </div>
    </div>
    {/each}
  </div>
</div>

<style>
  .red {
    border-left: 45px solid red;
  }

  .blue {
    border-left: 45px solid blue;
  }

.large {
  min-height:20vh;
}

  .container-fluid {
    min-height: 100%;
  }
</style>
