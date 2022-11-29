<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    console.log(page);
    //load active pool if there is no active pool then controller should not open
    const res = await this.fetch("api/pools", { method: "PATCH" });
    const pool = await res.json();
    return { pool };
  }
</script>

<script>
    import {competitionController} from "../functions/controller";
  import TopBar from "../components/TopBar.svelte";
  export let pool;
  let setFirst = false;
  let currentAthlete = {};
  let nextAthlete = {};
  //console.log(pool.entries);
 let controller = new competitionController(pool.entries);
 
</script>

<svelte:head>
  <title>Competition Controller</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar />

  <h2>Competition Controller</h2>
  <h3>Pool Name: {pool.poolName}</h3>
  <div class="row">
    <div class="cell">
        <div class="card small">
            <div class="card-body">
                <p><small>Next Athlete</small></p>
                <p><strong>{controller.nextAthlete.name}</strong></p>
            </div>
        </div>
     
      
    </div>
    <div class="cell float-right">
        <div class="card small bg-green">
            <div class="card-body">
                <p><small>
                    Current Athlete</small></p>
                <p><strong>{controller.currentAthlete.name}</strong></p>
            </div>
        </div>
    </div>
  </div>
</div>


<style>
    .small{
        padding: 8px;
        width: 300px;
        color: black;
    }
</style>