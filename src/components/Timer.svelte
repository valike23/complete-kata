<!-- Timer.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let minutes = 0;
  export let seconds = 0;
  export let controls = false;
  export let auto = false;
  export let onTimerEnd;
  let timeRemaining = 0;

  let interval;

  function startTimer() {
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
    <div class="col">
      <h1 class:timer-red={timeRemaining <= 60}>
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10
          ? `0${seconds}`
          : seconds}
      </h1>
    </div>
  </div>
  {#if controls}
    <div class="row">
      <div class="col">
        <button class="button primary mr-2" on:click={startTimer}>Start</button>
        <button class="button btn-danger mr-2" on:click={stopTimer}>Stop</button
        >
      </div>
    </div>
  {/if}
</div>

<style>
  .timer-red {
    color: red;
  }
</style>
