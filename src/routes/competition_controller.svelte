<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        console.log(page);
        //load active pool if there is no active pool then controller should not open
        const res = await this.fetch(`api/pools/details?id=${page.query.id}`);
      
        return { pool, id, katas };
    }
</script>
<script>
    import TopBar from "../components/TopBar.svelte";

</script>
<svelte:head>
    <title>Competition Controller</title>
</svelte:head>

<div class="h-100 container-fluid">
<TopBar/>

</div>