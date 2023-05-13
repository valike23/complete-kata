<script>
  export let pool;
  let club = {};
  console.log("final pool", pool);
</script>

<div class="container pt-5">
  <div class="row mt-5 text-center justify-content-center">
    <div class="col-12" style="background-color: gray;">
      <h1>{pool.poolName}</h1>
    </div>
  </div>
 {#each pool.entries as entry, i}
 <div class="row" style="border-bottom:2px solid white; border-right: 2px solid white">
    <div class="col-12" class:red={i == 0} class:blue={i == 1}>
      <h1 class="pl-3">
         <span style="font-weight:800">{entry.name || "test athlete name"}</span> 
         <small style="color: white">(Lagos)</small> </h1>
    
    </div>
   
  </div>
 {/each}


</div>

<style>
    .red {
        border-left: 5px solid red;
    }
    .blue {
        border-left: 5px solid blue;
    }
</style>
