<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        const res = await this.fetch(`api/entries`);
        const entries = await res.json();
console.log('new activation', entries);
        return { entries };
    }
</script>

<script >
  import TopBar from "../../components/TopBar.svelte";
  export let entries;
    console.log(entries);

 
    
</script>
<svelte:head>
    <title>Manage Entries</title>
</svelte:head>

<div class="h-100 container-fluid">
 <!-- svelte-ignore missing-declaration -->
 <TopBar/>
    <h1>Manage Entries</h1>
    <div class="container">
      <div class="row">
        <div class="cell-12">
            <a class="button primary float-right" href="/entries/add">Add Competitor</a>
        </div>
      </div>
        <div class="row">
            <div class="cell-12">
                <table class="table  cell-hover">
                    <thead>
                        <tr style="color: white">
                            <th style="color:white">#</th>
                            <th style="color:white">Athlete Name</th>
                            <th class="" style="color:white">Category</th>

                            <th class="" style="color:white">Club Name</th>
                            <th style="color:white">Flag</th>

                            <th class="" style="color:white">created Date</th>
                            <th style="color:white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each entries as entry, i}
                            <tr>
                                <td>{i + 1}</td>
                                <td>{entry.name}</td>
                              
                             <td>{entry.categoryName}</td>
                             <td>{entry.clubName}</td>
                             <td
                             ><img
                                 class="img"
                                 src={entry.flag ||
                                     "images/kata2.jpeg"}
                                 alt=""
                             /></td
                         >

                         <td>{entry.createdAt}</td>
                                <td
                                    >
                                    <button class="button alert square ">
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
</div>
<style>
    .img {
        height: 40px;
        width: 40px;
    }

</style>
