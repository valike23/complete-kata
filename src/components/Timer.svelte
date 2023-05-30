<!-- Timer.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  export let size = "small";
  export let minutes = 0;
  export let makeBold = false;
  export let seconds = 0;
  export let milliseconds = 0; // New variable for milliseconds
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
      if (milliseconds === 0) { // Check if milliseconds is zero
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
        milliseconds = 99; // Reset milliseconds to 99
      } else {
        milliseconds--; // Decrease milliseconds by 1
      }

      timeRemaining = minutes * 60 + seconds;
    }, 10); // Decreased interval to 10 milliseconds for smoother animation
  }

  function stopTimer() {
    start = true;
    console.log("stop timer");
    dispatch("timerend");
    clearInterval(interval);
  }

  function resetTimer() {
    clearInterval(interval);
    milliseconds = 0;
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
      <h1
        class:bigger={size == "bigger"}
        class:bold-text={makeBold == true}
        class="timer-red"
      >
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10
          ? `0${seconds}`
          : seconds}.{milliseconds < 10 ? `0${milliseconds}` : milliseconds}
      </h1>
    </div>
  </div>
  {#if controls}
    <div class="row">
      <div class="col">
        {#if start}
          <button
            style="width:100%"
            class="button primary mr-2 btn-block"
            on:click={startTimer}>Start Timer</button
          >
        {:else}
          <button
            style="width:100%"
            class="button alert mr-2"
            on:click={stopTimer}>Stop Timer</button
          >
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .bigger {
    font-size: 3rem;
  }
  .timer-red {
    color: red;
  }
  .bold-text {
    font-weight: 900;
    font-size: 180px;
  }
</style>
