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
  let baseResult = 0;
  let extraPoint = 0;
  let droppedJudgeIds = [];
  const toScoreNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  const formatScore = (value) => toScoreNumber(value).toFixed(2);
  const roundScore = (value) => Number(toScoreNumber(value).toFixed(2));
  const getJudgeKey = (judge) => {
    if (!judge) return undefined;
    if (judge.judgeId !== undefined && judge.judgeId !== null) {
      return judge.judgeId;
    }
    return judge.id;
  };
  const handleTimerStart = () => {
    console.log("start kata");
  };
  const handleTimerEnd = () => {
    console.log("end kata");
  };
  const setup = function () {
    const normalizedJudges = Array.isArray(judges) ? judges : [];
    baseResult = 0;
    extraPoint = 0;
    droppedJudgeIds = [];

    if (!normalizedJudges.length) return;

    let summedScores = 0;
    let isComplete = true;
    let isDisqualified = false;

    normalizedJudges.forEach((judge) => {
      if (judge.RESULT == undefined) {
        isComplete = false;
      }
      const judgeScore = toScoreNumber(judge.RESULT);
      if (judgeScore === 0) isDisqualified = true;
      summedScores += judgeScore;
    });

    baseResult = summedScores;

    if (isComplete) {
      const sortedJudges = JSON.parse(JSON.stringify(normalizedJudges)).sort(
        (a, b) => toScoreNumber(a.RESULT) - toScoreNumber(b.RESULT)
      );
      const lowestJudge = sortedJudges[0];
      const highestJudge = sortedJudges[sortedJudges.length - 1];
      droppedJudgeIds = [getJudgeKey(lowestJudge), getJudgeKey(highestJudge)].filter(
        (value) => value !== undefined && value !== null
      );
      baseResult =
        summedScores -
        toScoreNumber(lowestJudge.RESULT) -
        toScoreNumber(highestJudge.RESULT);
    }

    if (isDisqualified) {
      baseResult = 0;
    }

    extraPoint = roundScore(
      Math.max(0, toScoreNumber(result.total) - roundScore(baseResult))
    );
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
          finalResult.entries[0].pool_entries.total;
          
          finalResult.entries[i].club = {};
          
          promises.push(axios.get("api/club?id=" + entry.clubId)) ;
        });
        let clubResp = await Promise.all(promises);
        show = "final";
        console.log('club response :',clubResp);
        if(clubResp){
          clubResp.forEach((resp, i)=>{
            finalResult.entries[i].club = resp.data;
            finalResult.entries[0].belt = 'red';
            finalResult.entries[1].belt = 'blue';
            

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
            class="hero-flag"
            src={athlete.club.flag}
            alt="state-flag"
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
{:else if show == "kata"}
  <div class="container mb-4 mt-4 pb-4 kata">
    <div
      class="row mt-5 text-center justify-content-center row"
      style="background-color: gray; height:12vh"
    >
      <div class="cell-12">
        <h1>{pool.poolName}</h1>
      </div>
    </div>

    <div class="row" style="height: 50vh;">
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
              size="bigger"
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
        <h1 style="font-size: 40px;" class="pt-4 pb-4">{pool.poolName}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-3 red text-center">
        <h1 style="font-size: 90px;font-weight:700" class="pt-4 pb-4">{formatScore(result.total)}</h1>
        <p class="extra-points-text extra-points-panel pb-4">Extra P. +{formatScore(extraPoint)}</p>
      </div>
      
      <div class="col-6">
        <h1 style="font-size: 50px;" class="pt-4 pb-4">{athlete.name || "test athlete name"}</h1>
        <h1 style="font-size:60px" class="pl-3 pr-3 pt-3 pb-3">
          <img
            src={club.flag || "images/HAWKtm.png"}
            class="flag mr-3 pt-4 pb-4 pr-2 pl-2"
            alt="flag"
          />
          {club.clubName || "test club name"}
        </h1>
      </div>
      <div class="col-3">
        <img style="height:300px; width: 300px" class="float-right qrcode" src="images/qr.jpeg" alt="" />
      </div>
    </div>

    <div class="mt-2">
      <span class="s-h3 soft-border">Scores</span>
      {#each judges as judge}
        <span
          style="font-size: 60px;"
          class="s-h3 soft-border pt-3 pb-3 s-border"
          class:dropped-score={droppedJudgeIds.includes(getJudgeKey(judge))}
          >{formatScore(judge.RESULT)}</span
        >
      {/each}
      <span class="s-h3 soft-border pt-3 pb-3 extra-points-text extra-points-inline">
        Extra P. +{formatScore(extraPoint)}
      </span>
      <span style="font-size: 70px" class="s-h3 soft-border  pt-3 pb-3">
        {formatScore(result.total)}
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
      <div class:bg-red={finalResult.entries[0].belt =='red'} 
      class:bg-blue={finalResult.entries[0].belt =='blue'} class="cell-9 fg-white text-center">
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
      <div class:bg-red={finalResult.entries[1].belt =='red'}
       class:bg-blue={finalResult.entries[1].belt =='blue'} class="cell-9  fg-white text-center">
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
          class="hero-flag"
          src="images/HAWKtm.png"
          alt="state-flag"
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
 
.kata h1 {
  font-size: 3.45vw;
  font-weight: 600;
}
  .hero-flag {
    width: 260px;
    height: 160px;
    max-width: 100%;
    object-fit: contain;
    object-position: center;
    display: block;
    margin: 0 auto;
  }
  .flag {
    width: 220px;
    height: 150px;
    object-fit: contain;
    object-position: center;
    display: inline-block;
    vertical-align: middle;
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
  .dropped-score {
    color: red;
    font-weight: 700;
  }
  .extra-points-text {
    color: #ffd166;
    font-weight: 700;
  }
  .extra-points-panel {
    font-size: 32px;
  }
  .extra-points-inline {
    font-size: 60px;
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
