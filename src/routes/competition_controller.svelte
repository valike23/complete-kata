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
  let poolEntryId = 0;
  let submit = false;
  let endofPool = false;
  let handleTimerEnd = () => {
    console.log("timer end");
    socket.emit("end-timer",{});
  };
  let isFinal = false;
  let socket = {};
  let result = 0;
  let total = 0;
  let minutes = 5;
  let fakePool = JSON.parse(JSON.stringify(pool));
  delete fakePool.entries;
  let controller = new competitionController(pool.entries);
  if (!controller.nextAthlete) {
    controller.nextAthlete = { name: "empty" };
  }
  if (!controller.currentAthlete) {
    controller.currentAthlete = { name: "empty" };
    endofPool = true;
  }
  const resetVariables = async () => {
    try {
      let resp = await axios.put(
        `api/judges/pool?poolId=${fakePool.id}&entryId=${controller.currentAthlete.id}`
      );
      if (resp) {
        poolEntryId = resp.data.id;
        let judgesResult = resp.data;
        for (let index = 0; index < judges.length; index++) {
          const judge = judges[index];
          for (let j = 0; j < judgesResult.judges.length; j++) {
            const judgeResp = judgesResp[j];
            if (judgeResp.judgeId == judge.id) {
              judges[index].RESULT = judgeResp.RESULT;
              break;
            }
            judges[index].RESULT = 0;
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

  const setup = function () {
    let tempJudges = JSON.parse(JSON.stringify(judges));
    let RESULT = 0;
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
      RESULT += j.RESULT;
    });
    total = RESULT;
    if (isComplete) {
      submit = true;
      tempJudges.sort((a, b) => {
        return a.RESULT - b.RESULT;
      });
      console.log("tempjudges", tempJudges);
      let lowstResult = tempJudges[0];
      let highestResult = tempJudges[judges.length - 1];
      // wait here
      const tpl = "tp" + lowstResult.id;
      const tph = "tp" + highestResult.id;
      document.getElementById(tpl).style.color = "red";
      document.getElementById(tph).style.color = "red";
      console.log("highest score", highestResult);
      RESULT = RESULT - highestResult.RESULT - lowstResult.RESULT;
      result = RESULT;
    } else {
      result = RESULT;
    }
  };
  const upload = async () => {
    let resp = confirm("do you want to upload the result?");
    if (!resp) return;
    let body = {
      total: result,
    };
    socket.emit("result", {
      athlete: controller.currentAthlete,
      judges: judges,
      score: body,
      pool: fakePool,
    });
    const form = new FormData();
    form.append("body", JSON.stringify(body));
    try {
      let res = await axios.put("api/pools/scores?id=" + poolEntryId, form);
      if (res) {
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
          onclick: function () {
            const id = document.getElementById("test");
            const tec = document.getElementById("tec");
            const judge = document.getElementById("judgeselect");
            judges.forEach((judge2, i) => {
              if (judge2.id == judge.value) {
                judges[i].technical_performance = Number(tec.value);
                judges[i].athletic_performance = Number(id.value);
                judges = judges;
                return;
              }
            });
            alert("You clicked Agree action");
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

  const handleTimerStart =()=>{
    socket.emit("timer-start",{minutes});
  }
  onMount(async () => {
    win = window;
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

    socket = window.io("/display");
    socket.on("connect", () => {
      console.log(socket.id);
    });
    socket.on("judge scores", (data) => {
      console.log(data);
      judges.forEach((judge, i) => {
        if (judge.id == data.judgeId) {
          judges[i].RESULT = data.RESULT;
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

  <h2>
    Competition Controller <button
      on:click={openJudgeScore}
      title="use this button to upload scores only when judges screen has an issue"
      class="float-right button primary">Input Scores</button
    >
  </h2>
  <h3>Pool Name: {pool.poolName}</h3>
  <div class="row">
    <div class="cell">
      {#if isFinal}
      <Timer minutes={minutes} seconds={0} on:timerend={handleTimerEnd} on:timerstart={handleTimerStart} controls={true} />
   
      {/if}
      </div>
  </div>
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
              <th style="color: white">{"judge" + (i + 1)}</th>
            {/each}<th style="color: white">TOTAL</th>

            <th style="color: white">RESULT</th></tr
          ></thead
        ><tbody
          ><tr
            ><td class="font-weight-bolder">SCORES</td>{#each judges as judge}
              <td id={"tp" + judge.id}>{judge.RESULT || ""}</td>
            {/each} <td>{total.toFixed(2)}</td> <td>{result.toFixed(2)}</td></tr
          >
          <tr style="height: 75px;">
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
