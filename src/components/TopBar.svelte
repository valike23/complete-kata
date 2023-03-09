<script>
  import { goto } from "@sapper/app";

  const nav = (screen) => {
    goto(screen);
  };
  const gohome = () => {
    goto("/");
  };
  const goback = () => {
    history.back();
  };
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="row mt-2">
  <div class="cell-12">
    <button class="shortcut">
      <span class="caption">Go Back</span>
      <span class="mif-arrow-left icon" />
    </button>
    <button
      on:click={() => {
        nav("/competition");
      }}
      class="shortcut"
    >
      <span class="caption">Competition</span>
      <span class="mif-trophy icon" />
    </button>
    <button
      on:click={() => {
        nav("/category");
      }}
      class="shortcut"
    >
      <span class="caption">Category</span>
      <span class="mif-stack  icon" />
    </button>
    <button
      on:click={() => {
        nav("/entries");
      }}
      class="shortcut"
    >
      <span class="caption">Entries</span>
      <span class="mif-users  icon" />
    </button>
    <button
      on:click={() => {
        nav("/kata");
      }}
      class="shortcut"
    >
      <span class="caption">Kata</span>
      <span class="mif-directions-bike  icon" />
    </button>
    <button
      on:click={() => {
        nav("/pools");
      }}
      class="shortcut"
    >
      <span class="caption">Pools</span>
      <span class="mif-apps  icon" />
    </button>
    <button
      on:click={() => {
        nav("/screen/external");
      }}
      class="shortcut"
    >
      <span class="caption">External</span>
      <span class="mif-laptop  icon" />
    </button>
    <button
      on:click={() => {
        nav("/competition_controller");
      }}
      class="shortcut"
    >
      <span class="caption">Controller</span>
      <span class="mif-tree  icon" />
    </button>
    <button
      on:click={() => {
        nav("/screen/judgescreen");
      }}
      class="shortcut"
    >
      <span class="caption">Judges</span>
      <span class="mif-tablet  icon" />
    </button>
    <button
      on:click={() => {
        nav("/");
      }}
      class="shortcut"
    >
      <span class="caption">Home</span>
      <span class="mif-home  icon" />
    </button>
  </div>
</div>

<style>
  .bar {
    width: 100vw;
  }
</style>
