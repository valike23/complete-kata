<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    console.log(page);
    //load active pool if there is no active pool then controller should not open
    const res = await this.fetch("api/pools", { method: "PATCH" });
    const res2 = await this.fetch("api/judges");
    const res3 = await this.fetch("/api/judges/pool");

    const judgesResp = await res3.json();
    const pool = await res.json();
    const judges = await res2.json();
    return { pool, judges, judgesResp };
  }
</script>

<script>
  import { competitionController } from "../functions/controller";
  import TopBar from "../components/TopBar.svelte";
  import { onMount } from "svelte";
  import axios from "axios";
  export let pool,
    judges = [],
    judgesResp = [];
  let submit = false;
  let setFirst = false;
  let socket = {};
  let fakePool = JSON.parse(JSON.stringify(pool));
  delete fakePool.entries;
  console.log(pool);
  let totalAth = 0;
  let totalTech = 0;

  let controller = new competitionController(pool.entries);
  const resetVariables = async () => {
    try {
      let resp = await axios.put(
        `api/judges/pool?poolId=${fakePool.id}&entryId=${controller.currentAthlete.id}`
      );
      if (resp) {
        let judgesResult = resp.data;
        for (let index = 0; index < judges.length; index++) {
          const judge = judges[index];
          for (let j = 0; j < judgesResult.judges.length; j++) {
            const judgeResp = judgesResp[j];
            if (judgeResp.judgeId == judge.id) {
              judges[index].athletic_performance = judgeResp.ATH;
              judges[index].technical_performance = judgeResp.TEC;
              break;
            }
            judges[index].athletic_performance = 0;
            judges[index].technical_performance = 0;
          }
          setup();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const startKata = () => {
    socket.emit("start judge", {
      athlete: controller.currentAthlete,
      pool: fakePool,
    });
  };
  let result = 0;

  const setup = function () {
    let tempJudges = JSON.parse(JSON.stringify(judges));
    let tempJudges2 = JSON.parse(JSON.stringify(judges));
    let AAP = 0;
    let TAP = 0;
    let isComplete = false;
    for (let index = 0; index < judges.length; index++) {
      const element = judges[index];
      if (element.athletic_performance == undefined) {
        isComplete = false;
        break;
      } else {
        isComplete = true;
      }
    }
    judges.forEach((j) => {
      console.log(j.technical_performance, j.athletic_performance);
      TAP += j.technical_performance;
      AAP += j.athletic_performance;
    });

    console.log(AAP, TAP);
    if (isComplete) {
      submit = true;
      tempJudges.sort((a, b) => {
        return a.technical_performance - b.technical_performance;
      });
      let lowestTP = tempJudges[0];
      let highestTP = tempJudges[4];
      console.log("lowest TP", lowestTP);
      console.log("highest TP", highestTP);
      tempJudges2.sort((a, b) => {
        return a.athletic_performance - b.athletic_performance;
      });
      let lowestAP = tempJudges2[0];
      let highestAP = tempJudges2[4];
      console.log("lowest AP", lowestAP);
      console.log("highest AP", highestAP);
      const tpl = "tp" + lowestTP.id;
      const tph = "tp" + highestTP.id;
      const apl = "ap" + lowestAP.id;
      const aph = "ap" + highestAP.id;
      console.log(tpl, tph, apl, aph);
      document.getElementById(tpl).style.color = "red";
      document.getElementById(tph).style.color = "red";
      document.getElementById(apl).style.color = "red";
      document.getElementById(aph).style.color = "red";
      AAP =
        AAP - highestAP.athletic_performance - lowestAP.athletic_performance;
      TAP =
        TAP - highestTP.technical_performance - lowestTP.technical_performance;
      totalAth = AAP;
      totalTech = TAP;
      result = totalAth * 0.3 + totalTech * 0.7;
    } else {
      totalTech = AAP / judges.length;
      totalAth = TAP / judges.length;
    }
  };
  const upload =()=>{
    
  }
  //console.log(pool.entries);

  onMount(() => {
    resetVariables();

    socket = window.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("judge scores", (data) => {
      console.log(data);
      judges.forEach((judge, i) => {
        if (judge.id == data.judgeId) {
          judges[i].technical_performance = data.TEC;
          judges[i].athletic_performance = data.ATH;
        }
      });
      setup();
    });
  });
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
          <p><small> Current Athlete</small></p>
          <p><strong>{controller.currentAthlete.name}</strong></p>
        </div>
      </div>
    </div>
  </div>

  <div class="m-0 row">
    <div class="w-100 col-12">
      <div class="text-center">
        <button on:click={startKata} class="button primary ">start kata</button>
      </div>
      <br />
      <table
        class="table table-bordered table-responsive font-size-17 mt-5"
        width="100%"
      >
        <thead
          ><tr
            ><th />{#each judges as judge, i}
              <th style="color: white">{"judge" + (i + 1)}</th>
            {/each}<th style="color: white">TOTAL</th>
            <th style="color: white">FACTOR</th>
            <th style="color: white">RESULT</th></tr
          ></thead
        ><tbody
          ><tr
            ><td class="font-weight-bolder">TECH</td>{#each judges as judge}
              <td id={"tp" + judge.id}>{judge.technical_performance || ""}</td>
            {/each}<td>{totalTech.toFixed(2)}</td><td>0.7</td><td
              >{(totalTech * 0.7).toFixed(2)}</td
            ></tr
          ><tr
            ><td class="font-weight-bolder">ATH</td>
            {#each judges as judge}
              <td id={"ap" + judge.id}>{judge.athletic_performance || ""}</td>
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

      <div class="row mt-4">
        <div class="cell-3" />
        <div class="cell-9 text-center">
          <button class="button success" on:click={upload}
            >upload to screen</button
          >
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .small {
    padding: 8px;
    width: 300px;
    color: black;
  }
</style>
