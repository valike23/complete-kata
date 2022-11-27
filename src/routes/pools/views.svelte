<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        console.log(page);
        const res = await this.fetch(`api/pools/details?id=${page.query.id}`);
        const poolist = await res.json();
        const id = page.query.id;
        const pool = poolist[0];
        return { pool, id };
    }
</script>
<script>
    import { onMount } from "svelte";

    import TopBar from "../../components/TopBar.svelte";
    export let pool;
    const generate =()=>{
        const data = pool.entries;
    const fileName = pool.poolName;
    const exportType = 'csv'

    window.exportFromJSON({ data, fileName, exportType })
    }
    console.log(pool);
    onMount(()=>{
       // console.log(window);
    })
</script>


<svelte:head>
    <title>View Pool</title>
</svelte:head>


<div class="h-100 container-fluid">
<TopBar/>

<h2>Pool Name: {pool.poolName}</h2>
<div class="row">
    <div class="cell-12">
   
      <button on:click={generate}  class="button primary float-right">Generate record</button>
    
    </div>
</div>

<h3>pool entries</h3>
<table class="table  cell-hover" >
    <thead>
        <tr style="color: white">
            <th style="color:white">#</th>
            <th style="color:white">Athlete Name</th>
            <th class="" style="color:white">created Date</th>
        
            <th style="color:white">Active</th>
            <th style="color:white">Actions</th>
        </tr>
    </thead>
    <tbody>
        {#each pool.entries as entry, i}
            <tr>
                <td>{i + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.createdAt}</td>
               
                <td>{#if entry.pool_entries.status}
                    <span class="mif-done mif-2x fg-green"></span>
                {:else}
                <span class="mif-cross-light mif-2x fg-red "></span>
                {/if}</td>
                <td
                    ><button  class="button primary square " title="make this competition active">
                        <span class="mif-checkmark" />
                    </button>
                    <button  class="button alert square ">
                        <span class="mif-bin" />
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
</div>