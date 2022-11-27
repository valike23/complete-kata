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
    import { goto } from "@sapper/app";
    import axios from "axios";
    import {
        EnotificationType,
        handleNotification,
    } from "../../functions/browserFunctions";
    export let pools;

    const deletePool = (pool) => {};
    const viewPool = (pool) => {
        goto("pools/views?id=" + pool.id);
    };
    const activatePool = async (pool) => {
        try {
            if (
                !confirm(
                    `Do you want to activate pool ${pool.poolName} for the event?`
                )
            )
                return;
                console.log(pool.id);
            const resp = await axios.put("api/pools?id=" + pool.id);
            console.log('resp',resp);
            if (resp.data.status) {
                console.log(resp);
                handleNotification(
                    window,
                    resp.data.msg,
                    EnotificationType.SUCCESS
                );
                pools.forEach((element, i) => {
                    if (element.id == pool.id)
                        pool[i].status = 1;
                });
                pools = pools;
            } else {
                handleNotification(
                    window,
                    resp.data.msg,
                    EnotificationType.ERROR
                );
            }
        } catch (error) {
            console.log(error);
            handleNotification(
                window,
                "something went wrong",
                EnotificationType.ERROR
            );
        }
    };
</script>

<svelte:head>
    <title>Manage Pools</title>
</svelte:head>

<div class="h-100 container-fluid">
    <TopBar />

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
                            <td
                                >{#if pool.status != 0}
                                    <span class="mif-done mif-2x fg-green" />
                                {:else}
                                    <span
                                        class="mif-cross-light mif-2x fg-red "
                                    />
                                {/if}</td
                            >
                            <td
                                ><button
                                    on:click={() => {
                                        viewPool(pool);
                                    }}
                                    class="button primary square "
                                    title="make this competition active"
                                >
                                    <span class="mif-eye" />
                                </button>
                                <button
                                    on:click={() => {
                                        activatePool(pool);
                                    }}
                                    class="button success square "
                                >
                                    <span class="mif-checkmark" />
                                </button>
                                <button
                                    on:click={() => {
                                        deletePool(pool);
                                    }}
                                    class="button alert square "
                                >
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
