<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        const res = await this.fetch(`api/pools`);
        const pools = await res.json();

        return { pools };
    }
</script>

<script>
    import TopBar from "../../components/TopBar.svelte";
    import {goto} from "@sapper/app";
    export let pools;
    

    const deletePool =(pool)=>{

    }
    const viewPool =(pool)=>{
        goto('pools/views?id=' + pool.id);
    }
</script>


<svelte:head>
    <title>Manage Pools</title>
</svelte:head>

<div class="h-100 container-fluid">
    <TopBar/>
    
    <h1>Manage Pools</h1>

    <div class="row">
        <div class="cell-12">
            <table class="table  cell-hover">
                <thead>
                    <tr style="color: white">
                        <th style="color:white">#</th>
                        <th style="color:white">Pool Name</th>
                        <th style="color:white">created Date</th>
                        <th style="color:white">updated Date</th>
                        <th style="color:white">Status</th>
                        <th style="color:white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {#each pools as pool, i}
                        <tr>
                            <td>{i + 1}</td>
                            <td>{pool.poolName}</td>
                            <td>{pool.createdAt}</td>
                            <td>{pool.updatedAt}</td>
                            <td>{#if pool.status != 0}
                                <span class="mif-done mif-2x fg-green"></span>
                            {:else}
                            <span class="mif-cross-light mif-2x fg-red "></span>
                            {/if}</td>
                            <td
                                ><button on:click={()=>{viewPool(pool)}} class="button primary square " title="make this competition active">
                                    <span class="mif-eye" />
                                </button>
                                <button on:click={()=>{deletePool(pool)}} class="button alert square ">
                                    <span class="mif-bin" />
                                </button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>