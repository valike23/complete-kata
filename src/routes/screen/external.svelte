<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Timer from "../../components/Timer.svelte";
  import FinalShow from "../../components/screens/FinalShow.svelte";
  import PoolResult from "../../components/screens/PoolResult.svelte";
  let socket, win;
  let pool = {};
  let club = {};
  let judges = [];
  let finalPool = {};
  let finalScreen = {};
  let finalResult = {};
  let result = {};
  let groupPool ={};
  let athletes = [];
  let isStop = false;
  let athlete = {};
  athlete.result = 0;
  athlete.club = {};
  let kata = "";
  let endClock = false;
  let timer = false;
  athlete.category = {};
  let show = "";
  let minutes = 0;
  let seconds = 0;
  const handleTimerStart = () => {
    console.log("start kata");
  };
  const handleTimerEnd = () => {
    console.log("end kata");
  };
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
      //submit = true;
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
      try {
        document.getElementById(tpl).style.color = "red";
        document.getElementById(tph).style.color = "red";
        document.getElementById(apl).style.color = "red";
        document.getElementById(aph).style.color = "red";
      } catch (error) {
        console.log(error);
      }
    } else {
      totalTech = AAP / judges.length;
      totalAth = TAP / judges.length;
    }
  };
  onMount(() => {
    win = window;
    console.log(window);
    socket = win.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("show-final",(data)=>{
      finalScreen = data.pool;
      show = 'show-final';
    })
    socket.on("end-timer", (data) => {
      endClock = true;
      isStop = true;
      //timer = false;
      console.log(data, "end clock variable ", endClock);
    });
    socket.on("timer-start", (data) => {
      minutes = data.minutes;
      isStop = false;
      console.log("minute", minutes);
      timer = true;
    });
    socket.on("final-result", async (data) => {
     
      console.log(data);
      finalPool = data;
      try {
        const resp = await axios.get("api/pools/scores?id=" + data.pool.id);
        finalResult = resp.data;
        console.log('final result', finalResult);
        let promises = [];
       
        finalResult.entries.forEach((entry, i)=>{
          finalResult.entries[0].pool_entries.total
          finalResult.entries[i].club = {};
          
          promises.push(axios.get("api/club?id=" + entry.clubId)) ;
        });
        let clubResp = await Promise.all(promises);
        show = "final";
        console.log('club response :',clubResp);
        if(clubResp){
          clubResp.forEach((resp, i)=>{
            finalResult.entries[i].club = resp.data;

          })
        }
         // Sort finalResult.entries based on pool_entries.total in descending order
      finalResult.entries.sort((a, b) => b.pool_entries.total - a.pool_entries.total);
  
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("reset-timer",async (data)=>{
      location.reload();
    });
    socket.on("show-round-tv",async (data)=>{
     console.log('final round', data);
     groupPool = data;
     show = 'group-result';
    });
    socket.on("update", (data) => {});
    socket.on("start judge", async (data) => {
      show = "kata";
      console.log(data);
      pool = data.pool;
      athlete = data.athlete;
      try {
        let data = await axios.get("api/club?id=" + athlete.clubId);
        if (data) {
          club = data.data;
          console.log("club", club);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("display athlete", async (data) => {
      console.log("display");
      show = "athlete";
      console.log(data);
      kata = data.kata;
      athlete = data.activeAthlete;
      athlete.result = 0;
      athlete.club = {};
      athlete.category = {};
      try {
        let response = await axios.get(
          `api/athlete?id=${data.activeAthlete.id}&status=single`
        );
        console.log(response.data);
        athlete = response.data;
        athlete = athlete;
        athlete.result = 0;
      } catch (error) {}
    });
    socket.on("active pool", async (mypool) => {
      show = "pool";
      pool = mypool;
      try {
        athletes = (
          await (
            await axios.get(`api/pool_athlete?id=${mypool.id}`)
          ).data
        ).athletes;
        console.log(athletes);
        athletes = athletes;
      } catch (error) {}
    });
    socket.on("result", async (data) => {
      show = "result";
      console.log(data);
      pool = data.pool;
      isStop = true;
      minutes = 5;
      seconds = 0;

      athlete = data.athlete;
      judges = data.judges;
      result = data.score;
      setup();
      try {
        let data = await axios.get("api/club?id=" + athlete.clubId);
        if (data) {
          club = data.data;
          console.log("club", club);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("end of pool", async (data) => {
      //load all results from this pool
      // follow the rule 2 entries switch show = "final";
      console.log("data", data);
    });
  });
</script>

{#if show == "pool"}
  <div>
    <h3>Current Pool {pool.pool_name}</h3>
  </div>
  <div class="row p-4">
    <div class="col-12">
      <div class="card">
        <div class="table-responsive">
          <table class="table align-items-center mb-0">
            <thead>
              <tr>
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >id</th
                >
                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >name</th
                >

                <th
                  class="text-center text-uppercase text-secondary text-xxs font-weight-bolder"
                  >result</th
                >
              </tr>
            </thead>
            <tbody>
              {#each athletes as a, i}
                <tr>
                  <td class="align-middle text-center text-black text-sm">
                    <p>{i + 1}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <p>{a.first_name + " " + a.last_name}</p>
                  </td>
                  <td class="align-middle text-center text-sm">
                    <p>{Number(a.result).toFixed(2) || 0}</p>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
{:else if show == "athlete"}
  <div
    class="container-fluid text-center justify-content-center row"
    style="background-color: black;"
  >
    <div class="text-center justify-content-center row">
      <div class="col-12">
        <br />
        <h1 class="text-uppercase" style="color: red; font-weight: 800;">
          {athlete.result.toFixed(2) || 0.0}
        </h1>
        <p
          class="float-right text-center align-self-end h2 font-weight-bolder p-4 mr-0"
          style="background-color: transparent; color: yellow; font-size: 50px;"
        >
          1
        </p>
      </div>
    </div>
    <div class="p-3 row">
      <div class="col-5">
        <div
          class="justify-content-center text-center p-4 font-weight-bolder"
          style="background-color: yellow; color: red; height: 230px;"
        >
          <h1 style="font-size: 130px; font-weight: 800;">
            {athlete.result.toFixed(2) || 0.0}
          </h1>
        </div>
      </div>
      <div
        class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
      >
        <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
          class="font-size-18">0.3 ATHLETIC</span
        >
      </div>
      <div class="col-2" />
    </div>
    <br />
    <div class="text-center justify-content-center row">
      <div class="text-center col-12">
        <h1 class="text-uppercase" style="color: red; font-size: 40px;">
          {athlete.category.category_name}
        </h1>
      </div>
    </div>
    <br />
    <div class="p-4 row">
      <div class="col-4">
        <div class="pl-4" style="border-left: 1px solid red;">
          <h1 style="color: white; font-size:x-large">
            {athlete.first_name + " " + athlete.last_name}
          </h1>
        </div>
      </div>
      <div class="col-4">
        <div class="text-center">
          <img
            class="img-fluid"
            src={athlete.club.flag}
            alt="state-flag"
            width="300"
          />
        </div>
      </div>
      <div class="col-4">
        <div class="pr-4 text-right" style="border-right: 1px solid red;">
          <h1 style="color: white;">{kata}</h1>
        </div>
      </div>
    </div>
    <br />
  </div>
  {:else if show = "group-result"}
  <PoolResult groupPool></PoolResult>
{:else if show == "kata"}
  <div class="container mb-4 pb-4">
    <div
      class="row mt-5 text-center justify-content-center row"
      style="background-color: gray;"
    >
      <div class="cell-12">
        <h1>{pool.poolName}</h1>
      </div>
    </div>

    <div class="row">
      <div class="cell-2 red" />
      <div class="cell-7">
        <h1>{athlete.name}</h1>
        <h1>
          <img
            src={club.flag || "images/HAWKtm.png"}
            class="flag mr-3"
            alt="flag"
          />
          {club.clubName || ""}
        </h1>
      </div>
      <div class="cell-3">
        <img class="float-right qrcode" src="images/qr.jpeg" alt="" />
      </div>
    </div>
    <div class="row">
      <div class="cell-12">
        <h1 class="text-right" style="color:whitesmoke">
          {athlete.pool_entries.kata}
        </h1>
      </div>
    </div>
    <div class="row">
      <div class="cell">
        {#if timer}
          <div class="row">
            <div class="cell">
              <Timer
                {minutes}
                {seconds}
                {isStop}
                makeBold={false}
                on:timerend={handleTimerEnd}
                on:timerstart{handleTimerStart}
                auto={true}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else if show == "result"}
  <div class="container pt-5">
    <div class="row mt-5 text-center justify-content-center">
      <div class="col-12" style="background-color: gray;">
        <h1>{pool.poolName}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-2 red text-center">
        <h1>{Number(result.total).toFixed(2)}</h1>
      </div>
      <div class="col-7">
        <h1>{athlete.name || "test athlete name"}</h1>
        <h1>
          <img
            src={club.flag || "images/HAWKtm.png"}
            class="flag mr-3"
            alt="flag"
          />
          {club.clubName || "test club name"}
        </h1>
      </div>
      <div class="col-3">
        <img class="float-right qrcode" src="images/qr.jpeg" alt="" />
      </div>
    </div>

    <div class="mt-2">
      <span class="s-h3 soft-border">Scores</span>
      {#each judges as judge}
        <span id={"ap" + judge.id} class="s-h3 soft-border s-border"
          >{judge.RESULT || ""}</span
        >
      {/each}
      <span class="s-h3 soft-border">
        {Number(result.total).toFixed(2)}
      </span>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="text-right" style="color: whitesmoke;">
          {athlete.pool_entries.kata}
        </h1>
      </div>
    </div>
  </div>
{:else if show == "final"}
  <div class="container mb-4 pb-4">
    <div style="background-color: gray;" class="row mt-5">
      <div class="cell-12">
        <h1>{finalResult.poolName}</h1>
      </div>
    </div>
    <div class="row border mt-2">
      <div class="cell-9" />
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>TOTAL</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="cell-7 text-center">
        <h1>{finalResult.entries[0].name}</h1>
      </div>
      <div class="cell-5" />
    </div>
    <div class="row">
      <div class="cell-9 bg-red fg-white text-center">
        <h1>{finalResult.entries[0].club.clubName}</h1>
      </div>
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>{ Number(finalResult.entries[0].pool_entries.total ).toFixed(2)  }</h1>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="cell-7 text-center">
        <h1>{finalResult.entries[1].name}</h1>
      </div>
      <div class="cell-5" />
    </div>
    <div class="row">
      <div class="cell-9 bg-blue fg-white text-center">
        <h1>{finalResult.entries[1].club.clubName}</h1>
      </div>
      <div class="cell-3 text-center">
        <div class="row">
          <div class="cell-12 border">
            <h1>{ Number(finalResult.entries[1].pool_entries.total ).toFixed(2)  }</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
  {:else if show == "show-final"}
  <FinalShow pool={finalScreen}></FinalShow>
{:else}
  <div class="container" style="background-color: black;">
    <div class="text-center justify-content-center row">
      <div class="col-8">
        <br />
        <!-- svelte-ignore a11y-missing-content -->
        <h1 class="text-uppercase" style="color: red; font-weight: 800;" />
      </div>
    </div>
    <div class="p-3 row">
      <div class="col-5">
        <div
          class="justify-content-center text-center p-4 font-weight-bolder"
          style="background-color: yellow; color: red; height: 230px;"
        >
          <h1 style="font-size: 130px; font-weight: 800;">0.00</h1>
          <p
            class="float-right text-center align-self-end h1 font-weight-bolder p-4 mr-0"
            style="background-color: red; color: yellow; font-size: 50px;"
          >
            1
          </p>
        </div>
      </div>
      <div
        class="justify-content-end text-center pt-4 text-white font-weight-bolder col-5"
      >
        <span class="font-size-18">0.7 TECHNICAL</span>&nbsp;&nbsp;<span
          class="font-size-18">0.3 ATHLETIC</span
        >
      </div>
      <div class="col-2" />
    </div>
    <br />
    <div class="text-center justify-content-center row">
      <div class="text-center col-8">
        <!-- svelte-ignore a11y-missing-content -->
        <h1 class="text-uppercase" style="color: red; font-size: 40px;" />
      </div>
    </div>
    <br />
    <div class="p-4 row">
      <div class="col-4">
        <div class="pl-4" style="border-left: 1px solid red;">
          <!-- svelte-ignore a11y-missing-content -->
          <h1 style="color: white;" />
        </div>
      </div>
      <div class="col-4">
        <img
          class="img-fluid"
          src="images/HAWKtm.png"
          alt="state-flag"
          width="500"
        />
      </div>
      <div class="col-4">
        <div class="pr-4 text-right" style="border-right: 1px solid red;">
          <!-- svelte-ignore a11y-missing-content -->
          <h1 style="color: white;" />
        </div>
      </div>
    </div>
    <br />
  </div>
{/if}

<style>
  .flag {
    width: 90px;
  }
  .box {
    margin-top: 10%;
  }
  .category {
    font-size: 2 rem;
    color: white;
    font-weight: 600;
  }
  .red {
    background-color: red;
  }
  .qrcode {
    width: 100px;
  }
  .s-border {
    border-left: 2px solid white;
    border-right: 2px solid white;
  }
  .soft-border {
    padding-left: 12px;
    padding-right: 12px;
  }
  .s-h3 {
    font-size: 25px;
    font-weight: 500;
  }
</style>
