<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        console.log(page);
        //load active pool if there is no active pool then controller should not open
        const res = await this.fetch("api/pools",{method: "PATCH"});
      const pool = await res.json();
        return { pool };
    }
</script>
<script>
    import TopBar from "../components/TopBar.svelte";
    export let pool;

</script>
<svelte:head>
    <title>Competition Controller</title>
</svelte:head>

<div class="h-100 container-fluid">
<TopBar/>

<h2>Competition Controller</h2>
<h3>Pool Name: {pool.poolName}</h3>
<div class="row">
<div class="cell">
    <label for="">Next Athlete</label>
    <p>Tobi Smith</p>
</div>
<div class="cell float-right">
    <label for="">Current Athlete</label>
    <p>Tobi Smith</p>
</div>
</div>


</div>