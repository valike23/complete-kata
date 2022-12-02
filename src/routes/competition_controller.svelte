<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    console.log(page);
    //load active pool if there is no active pool then controller should not open
    const res = await this.fetch("api/pools", { method: "PATCH" });
    const res2 = await this.fetch('api/judges');
    const pool = await res.json();
    const judges = await res2.json();
    return { pool, judges };
  }
</script>

<script>
    import {competitionController} from "../functions/controller";
  import TopBar from "../components/TopBar.svelte";
  export let pool, judges =[];
  let setFirst = false;
  let currentAthlete = {};
  let totalAth = 0;
  let totalTech = 0;
  let result = 0;
  let nextAthlete = {};
  const resetVariables =()=>{
    judges.forEach((judge, i)=>{
      judges[i].athletic_performance = 0;
      judges[i].technical_performance = 0;
    })
  }
  resetVariables();
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


  <div class="m-0 row">
    <div class="w-100 col-12">
      <table
        class="table table-bordered table-responsive font-size-17"
        width="100%"
      >
        <thead class="thead-dark"
          ><tr
            ><th />{#each judges as judge, i}
              <th>{"judge" + (i + 1)}</th>
            {/each}<th>TOTAL</th><th>FACTOR</th><th>RESULT</th></tr
          ></thead
        ><tbody
          ><tr
            ><td class="font-weight-bolder">TECH</td
            >{#each judges as judge}
              <td>{judge.technical_performance}</td>
            {/each}<td>{totalTech.toFixed(2)}</td><td>0.7</td><td
              >{(totalTech * 0.7).toFixed(2)}</td
            ></tr
          ><tr
            ><td class="font-weight-bolder">ATH</td>
            {#each judges as judge}
              <td>{judge.athletic_performance}</td>
            {/each}
            <td>{totalAth.toFixed(2)}</td><td>0.3</td><td
              >{(totalAth * 0.3).toFixed(2)}</td
            ></tr
          ><tr style="height: 75px;">
            {#each judges as judge}
              <td> &nbsp;</td>
            {/each}
            <td style="background-color: red; color: white;"
              >{result.toFixed(2)}</td
            ></tr
          ></tbody
        >
      </table>
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