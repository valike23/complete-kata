<script>
  import { goto } from "@sapper/app";

  export let active ='home';

  const nav = (screen) => {
    goto(screen);
  };
  const gohome = () => {
    goto("/");
  };
  const goback = () => {
    console.log('go back');
    history.back();
  };
  const ExternalWindow =(screen)=>{
    window.open("http://localhost:3000" + screen, "_blank");
  }
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="row mt-2">
  <div class="cell-12">
    <button on:click={goback}  class="shortcut bg-red fg-white">
      <span class="caption">Go Back</span>
      <span class="mif-arrow-left icon" />
    </button>
    <button
    class:active={active == 'competition'}
      on:click={() => {
        nav("/competition");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Competition</span>
      <span class="mif-trophy icon" />
    </button>
    <button
    class:active={active == 'categories'}
      on:click={() => {
        nav("/categories");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption tight"><small>Category
        <br>
         draft pools</small></span>
      <span class="mif-stack  icon" />
    </button>
    <button
    class:active={active == 'clubs'}
      on:click={() => {
        nav("/clubs");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption tight"> Clubs</span>
      <span class="mif-flag  icon" />
    </button>
    <button
    class:active={active == 'entries'}
      on:click={() => {
        nav("/entries");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Entries</span>
      <span class="mif-users  icon" />
    </button>
    <button  class:active={active == 'kata'}
      on:click={() => {
        nav("/kata");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Kata</span>
      <span class="mif-directions-bike  icon" />
    </button>
    <button class:active={active == 'pools'}
      on:click={() => {
        nav("/pools");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Show Pools</span>
      <span class="mif-apps  icon" />
    </button>
    <button class:active={active == 'judges'}
    on:click={() => {
      nav("/judges");
    }}
    class="shortcut bg-teal fg-white"
  >
    <span class="caption"> <small>Manage <br> Judges</small></span>
    <span class="mif-hammer  icon" />
  </button>
    <button
      on:click={() => {
        ExternalWindow("/screen/external");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption"> MAT TV </span>
      <span class="mif-laptop  icon" />
    </button>
    <button
      on:click={() => {
        ExternalWindow("/competition_controller");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Controller</span>
      <span class="mif-tree  icon" />
    </button>
    <button
      on:click={() => {
        ExternalWindow("/screen/judgescreen");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Judges</span>
      <span class="mif-tablet  icon" />
    </button>
    <button
    class:active={active == 'links'}
      on:click={() => {
        nav("/links");
      }}
      class="shortcut bg-teal fg-white"
    >
      <span class="caption">Links</span>
      <span class="mif-link  icon" />
    </button>
    <button 
      on:click={() => {
        nav("/");
      }}
      class="shortcut fg-white bg-blue"
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
  .active{
    border-bottom: 5px solid orange;
  }
</style>
