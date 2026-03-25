<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
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
  import { goto } from "@sapper/app";
  import { onMount } from "svelte";
  import axios from "axios";
  import Timer from "../components/Timer.svelte";
  import {
    EnotificationType,
    handleNotification,
  } from "../functions/browserFunctions";
  export let pool,
    judges = [],
    win = {},
    judgesResp = [];
  judges = Array.isArray(judges) ? judges : [];
  judgesResp = Array.isArray(judgesResp) ? judgesResp : [];
  let poolEntryId = 0;
  let showScoresOnTV = false;
  let submit = false;
  let endofPool = false;
  const hasActivePool = !!pool;
  const hasSavedPoolResult = (entry) => {
    return (
      entry &&
      entry.pool_entries &&
      ((entry.pool_entries.total !== undefined &&
        entry.pool_entries.total !== null &&
        entry.pool_entries.total !== "") ||
        Number(entry.pool_entries.status) === 2)
    );
  };
  let handleTimerEnd = () => {
    console.log("timer end");
    socket.emit("end-timer", {});
  };
  let isFinal = false;
  let isTeamFinal = false;

  let socket = {};
  let result = 0;
  let total = 0;
  let baseResult = 0;
  let extraPoint = 0;
  let canViewResults =
    hasActivePool &&
    Array.isArray(pool.entries) &&
    pool.entries.some((entry) => hasSavedPoolResult(entry));
  let minutes = 5;
  const toScoreNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  const formatScore = (value) => toScoreNumber(value).toFixed(2);
  const updateDisplayedResult = (value) => {
    baseResult = toScoreNumber(value);
    result = baseResult + extraPoint;
  };
  const goToResult = () => {
    if (!hasActivePool) return;
    goto("pools/result?id=" + pool.id);
  };
  let fakePool = hasActivePool ? JSON.parse(JSON.stringify(pool)) : {};
  if (hasActivePool) {
    delete fakePool.entries;
  }
  let controller = new competitionController(
    hasActivePool && Array.isArray(pool.entries) ? pool.entries : []
  );
  if (!controller.nextAthlete) {
    controller.nextAthlete = { name: "empty" };
  }
  if (!controller.currentAthlete) {
    controller.currentAthlete = { name: "empty" };
    endofPool = true;
  }
  const resetVariables = async () => {
    if (!hasActivePool || !controller.currentAthlete.id) return;
    try {
      let resp = await axios.put(
        `api/judges/pool?poolId=${fakePool.id}&entryId=${controller.currentAthlete.id}`
      );
      console.log("the response", resp.data);
      console.log("the judges: ", judges);
      if (resp.data) {
        poolEntryId = resp.data.id;
        const judgesResult = resp.data;
        for (let index = 0; index < judges.length; index++) {
          const judge = judges[index];
          for (let j = 0; j < judgesResult.judges.length; j++) {
            const judgeResp = judgesResult.judges[j];
            if (judgeResp.judgeId == judge.id) {
              judges[index].RESULT = judgeResp.RESULT;
              if (judges[index].RESULT == 0) judges[index].RESULT = "0";
              break;
            }
            judges[index].RESULT = 0;
          }
        }
        console.log("reset judges: ", judges);
        setup();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const showFinalResult = () => {};
  const showRoundResultOnTV = () => {
    if (!hasActivePool) return;
    socket.emit("show-round-tv", { pool });
  };
  const startKata = () => {
    if (!hasActivePool) return;
    socket.emit("start judge", {
      athlete: controller.currentAthlete,
      pool: fakePool,
    });
  };

  const setup = function () {
    if (!judges.length) {
      submit = false;
      total = 0;
      updateDisplayedResult(0);
      return;
    }
    let tempJudges = JSON.parse(JSON.stringify(judges));
    let RESULT = 0;
    let isDisqualifed = false;
    let isComplete = false;
    //confirm if the athlete is complete
    for (let index = 0; index < judges.length; index++) {
      const element = judges[index];
      if (element.RESULT == undefined) {
        isComplete = false;
        break;
      } else {
        isComplete = true;
      }
    }
    judges.forEach((j) => {
      const judgeScore = toScoreNumber(j.RESULT);
      if (judgeScore === 0) isDisqualifed = true;
      RESULT += judgeScore;
    });

    if(isDisqualifed) RESULT = 0;
    total = RESULT;
    
    if (isComplete) {
      submit = true;
      tempJudges.sort((a, b) => {
        return Number(a.RESULT) - Number(b.RESULT);
      });
      console.log("tempjudges", tempJudges);
      let lowstResult = tempJudges[0];
      let highestResult = tempJudges[judges.length - 1];
      // wait here
      const tpl = "tp" + lowstResult.id;
      const tph = "tp" + highestResult.id;
      const lowestNode = document.getElementById(tpl);
      const highestNode = document.getElementById(tph);
      if (lowestNode) lowestNode.style.color = "red";
      if (highestNode) highestNode.style.color = "red";
      RESULT =
        RESULT - toScoreNumber(highestResult.RESULT) - toScoreNumber(lowstResult.RESULT);
      if(isDisqualifed) RESULT = 0;
      updateDisplayedResult(RESULT);
    } else {
      if(isDisqualifed) RESULT = 0;
      updateDisplayedResult(RESULT);
    }
  };
  const showFinalsScore = () => {
    console.log("this is the final result release");
    if (!hasActivePool) return;
    socket.emit("final-result", {
      pool: fakePool,
    });
  };
  const upload = async () => {
    let resp = confirm("do you want to upload the result?");
    if (!resp) return;
    let body = {
      total: result,
    };
    showScoresOnTV = true;
    if (!isFinal) {
      socket.emit("result", {
        athlete: controller.currentAthlete,
        judges: judges,
        score: body,
        pool: fakePool,
      });
    } else {
      socket.emit("reset-timer", {});
    }
    const form = new FormData();
    form.append("body", JSON.stringify(body));
    try {
      let res = await axios.put("api/pools/scores?id=" + poolEntryId, form);
      if (res) {
        if (Array.isArray(pool.entries)) {
          pool.entries.forEach((entry) => {
            if (
              entry.id == controller.currentAthlete.id &&
              entry.pool_entries
            ) {
              entry.pool_entries.total = result;
              entry.pool_entries.status = 2;
            }
          });
          canViewResults = pool.entries.some((entry) => hasSavedPoolResult(entry));
        }
        handleNotification(
          window,
          "scores uploaded successfully",
          EnotificationType.SUCCESS,
          () => {
            location.reload();
          }
        );
        controller.updateNextEntry();
      }
    } catch (error) {
      console.error(error);
      handleNotification(
        window,
        "something went wrong",
        EnotificationType.ERROR
      );
    }
  };
  const openJudgeScore = () => {
    if (!hasActivePool) return;
    let judgeList = ``;
    judges.forEach((element) => {
      let text = `<option value="${element.id}"> ${element.judgeName}</option>`;
      judgeList += text;
    });
    win.Metro.dialog.create({
      title: "Add Judges Result",
      content: `<div class="container">
              <div class="row">
                <div class="col-12">
                  <label>Judge</label>
                  <select id="judgeselect" data-role="select">
                <optgroup label="Judges">
       
                ${judgeList}
                </optgroup>
 
              </select>
              </div>
             
              <div class="col-12">
                  <label>Scores</label>
                  <input type="number" id="tec" data-role="input" value="5.0" min="0.0" max="10.0" step="0.1">
              </div>
                </div>
              </div>`,
      actions: [
        {
          caption: "Agree",
          cls: "js-dialog-close alert",
          onclick: async function () {
            const id = document.getElementById("test");
            const tec = document.getElementById("tec");
            const judge = document.getElementById("judgeselect");
            let activeJudge = {};
            judges.forEach((judge2, i) => {
              if (judge2.id == judge.value) {
                judges[i].RESULT = Number(tec.value);
                activeJudge = judges[i];
                judges = judges;
              }
              setup();
            
              
            });
            let judgeResult = {
          entryId: controller.currentAthlete.id,
          RESULT: activeJudge.RESULT,
          judgeId: activeJudge.id,
          poolId: pool.id,
        };
        console.log(judgeResult);
        let form = new FormData();
        form.append("judge", JSON.stringify(judgeResult));
        let data = await (await axios.post(`api/judges/pool`, form)).data;
        if (data) {
          await win.Swal.fire({
            icon: "success",
            title: "Success",
            text: "scores uploaded successfully",
          });
          
        }
          },
        },
        {
          caption: "Disagree",
          cls: "js-dialog-close",
          onclick: function () {
            console.log("do nothing joor");
          },
        },
      ],
    });
  };
  const openExtraScoreModal = async () => {
    if (!hasActivePool) return;
    const modalResult = await win.Swal.fire({
      title: "Add Extra Score",
      input: "number",
      inputLabel: "Enter an extra score between 0.1 and 3.0",
      inputValue: extraPoint ? extraPoint.toFixed(1) : "",
      inputAttributes: {
        min: "0.1",
        max: "3.0",
        step: "0.1",
      },
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: "Apply",
      denyButtonText: "Clear",
      inputValidator: (value) => {
        if (value === "" || value === null) {
          return "Enter a value between 0.1 and 3.0";
        }
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
          return "Enter a valid number";
        }
        if (numericValue < 0.1 || numericValue > 3.0) {
          return "Extra score must be between 0.1 and 3.0";
        }
        return null;
      },
    });
    if (modalResult.isDenied) {
      extraPoint = 0;
      updateDisplayedResult(baseResult);
      return;
    }
    if (!modalResult.isConfirmed) return;
    extraPoint = toScoreNumber(modalResult.value);
    updateDisplayedResult(baseResult);
  };

  const handleTimerStart = () => {
    if (!hasActivePool) return;
    socket.emit("timer-start", { minutes });
  };
  onMount(async () => {
    win = window;
    if (!hasActivePool) {
      handleNotification(
        window,
        "No active pool found",
        EnotificationType.INFO
      );
      return;
    }
    socket = window.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    console.log("pool", pool);
    const resp = pool.poolName.split(" ");
    //automatically set the app to final if it is a final app
    if (resp[resp.length - 1] == "Medal") {
      isFinal = true;
      socket.emit("show-final", { pool });
      resp.forEach((text) => {
        if ((text == "team" || text == "Team", text == "TEAM"))
          isTeamFinal = true;
      });
    }
    if (endofPool) {
      handleNotification(
        window,
        "closing this pool...",
        EnotificationType.INFO
      );
      try {
        const resp = await axios.patch("api/pools/scores?id=" + fakePool.id);
        if (resp) {
          handleNotification(
            window,
            "pool completed successfully",
            EnotificationType.SUCCESS,
            () => {
              location("/pools");
            }
          );
        }
      } catch (error) {
        console.log(error);
        handleNotification(window, "an error occured", EnotificationType.ERROR);
      }
    }
    resetVariables();

    socket.on("judge scores", (data) => {
      console.log(data);
      if (!data.RESULT) {
        alert('A judge just disqualified an athlete that a look at the board to verify');
        judges.forEach((judge, i) => {
          if (judge.id == data.judgeId) {
            judges[i].RESULT = Number(data.RESULT).toString();
          }
        });
      } else {
        judges.forEach((judge, i) => {
          if (judge.id == data.judgeId) {
            judges[i].RESULT = data.RESULT;
          }
        });
      }
      setup();
    });
  });
</script>

<svelte:head>
  <title>Competition Controller</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar />

  {#if hasActivePool}
    <h2>
      Competition Controller {#if isFinal}
        <button
          on:click={showFinalsScore}
          title="use this button to show finals result on TV screen"
          class="float-right button primary mr-2">Show Final Result</button
        >
        <button
          on:click={showRoundResultOnTV}
          class=" button primary mr-2"
          title="show group standing on TV display">show Group Standing</button
        >
      {/if}
      <button
        on:click={openJudgeScore}
        title="use this button to upload scores only when judges screen has an issue"
        class="float-right button primary">Input Scores</button
      >
      <button
        on:click={openExtraScoreModal}
        title="add an extra score to the current athlete result"
        class="float-right button warning mr-2">Extra Score</button
      >
      {#if canViewResults}
        <button
          on:click={goToResult}
          title="view the current pool result"
          class="float-right button success mr-2">Go To Result</button
        >
      {/if}
    </h2>
    <h3>{pool.poolName}</h3>

    <div class="row">
      <div class="cell">
        <div class="card small">
          <div class="card-body">
            <p><small>Next Athlete</small></p>
            <p><strong>{controller.nextAthlete.name}</strong></p>
          </div>
        </div>
      </div>
      {#if isTeamFinal}
        <div class="cell mb-4">
          <Timer
            size="bigger"
            {minutes}
            seconds={0}
            on:timerend={handleTimerEnd}
            on:timerstart={handleTimerStart}
            controls={true}
          />
        </div>
      {/if}
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
          <button on:click={startKata} class="button primary">start kata</button>
        </div>
        <br />
        <table
          class="table table-bordered table-responsive font-size-17 mt-5"
          width="100%"
        >
          <thead
            ><tr
              ><th />{#each judges as judge, i}
                <th style="color: white">{judge.judgeName}</th>
              {/each}<th style="color: white">TOTAL</th><th style="color: white"
                  >EXTRA P.</th
                >

              <th style="color: white">RESULT</th></tr
            ></thead
          ><tbody
            ><tr
              ><td class="font-weight-bolder">SCORES</td>{#each judges as judge}
                <td id={"tp" + judge.id}>{formatScore(judge.RESULT)}</td>
              {/each}
              <td>{formatScore(total)}</td>
              <td>{formatScore(extraPoint)}</td>
              <td>{formatScore(result)}</td
              ></tr
            >
            <tr style="height: 75px;">
              {#each judges as judge}
                <td> &nbsp;</td>
              {/each}
              <td> &nbsp;</td>
              <td> &nbsp;</td>
              <td style="background-color: red; color: white;"
                >{formatScore(result)}</td
              ></tr
            ></tbody
          >
        </table>

        <div class="row mt-4">
          <div class="cell-3">
            <input
              type="checkbox"
              data-style="2"
              id="final"
              bind:checked={isFinal}
              data-caption="is Final Bouth"
            /><label for="final">is Team Final Bouth</label>
          </div>
          <div class="cell-9 text-center">
            <button disabled={!submit} class="button success" on:click={upload}
              >upload to Database</button
            >
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="card mt-4">
      <div class="card-body">
        <h3>No active pool</h3>
        <p>Activate a pool from the pools page before opening the competition controller.</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .small {
    padding: 8px;
    width: 300px;
    color: black;
  }
</style>
