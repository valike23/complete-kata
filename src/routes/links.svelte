

<script context="module">
    export async function preload(page) {
      const res2 = await this.fetch(`api/links`);
      let ips = await res2.json();
      ips = ips[Object.keys(ips)[0]];
      console.log(ips);
      return { ips };
    }
  </script>

<script>
import TopBar from "../components/TopBar.svelte";
export let ips;
    console.log(ips);
</script>




<svelte:head>
  <title>External Links</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="links"/>
  <h1>Manage Links</h1>

  <div class="row">
    <div class="cell">
        <div class="card">
            <div class="card-body">
                <p>judges screen</p>
                <p><a target=”_blank” href="{'http://' +ips[0] + ':3000' + '/screen/judgescreen'}">{ips[0] + '/screen/judgescreen'}</a></p>
            </div>
        </div>
    </div>
    <div class="cell">
        <div class="card">
            <div class="card-body">
                <p>Public Display screen</p>
                <p><a target=”_blank” href="{'http://' +ips[0] + ':3000'+ '/screen/external'}">{ips[0] + '/screen/external'}</a></p>
            </div>
        </div>
    </div>
  </div>
</div>

<style>
    .card {
        color: black;
    }
</style>
