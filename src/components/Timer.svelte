<!-- Timer.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let minutes = 0;
  export let makeBold = false;
  export let seconds = 0;
  export let controls = false;
  export let auto = false;
  export let onTimerEnd;
  let timeRemaining = 0;
let start = true;
  let interval;

  function startTimer() {
    start = false;
    dispatch("timerstart");
    interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          if (onTimerEnd) {
            onTimerEnd();
          } else {
            dispatch("timerend");
          }
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }

      timeRemaining = minutes * 60 + seconds;
    }, 1000);
  }

  function stopTimer() {
    start = true;
    console.log("stop timer");
    dispatch("timerend");
    clearInterval(interval);
  }

  function resetTimer() {
    clearInterval(interval);
    seconds = 0;
    minutes = 0;
    timeRemaining = 0;
  }

  onMount(() => {
    if (auto) startTimer();
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<div class="container">
  <div class="row">
    <div class="col" style="text-align: center">
      <h1 class:bold-text={makeBold == true} class="timer-red">
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10
          ? `0${seconds}`
          : seconds}
      </h1>
    </div>
  </div>
  {#if controls}
    <div class="row">
      <div class="col">
        {#if start}
        <button style="width:100%" class="button primary mr-2 btn-block" on:click={startTimer}>Start Timer</button>
        {:else}
        <button style="width:100%" class="button alert mr-2" on:click={stopTimer}>Stop Timer</button
          >
        {/if}
       
      
      </div>
    </div>
  {/if}
</div>

<style>
  .timer-red {
    color: red;
  }
  .bold-text {
    font-weight: 900;
    font-size: 180px;
  }
</style>
