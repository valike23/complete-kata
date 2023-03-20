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
  import axios from "axios";

  import TopBar from "../../components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "../../functions/browserFunctions";
  export let entries;
    console.log(entries);

 const switchName =(entry, i)=>{
    entries[i].edit = true;
 }
 const updateEntry =async (entry, i)=>{
    entries[i].edit = false;
    console.log(entries[i]);

    try {
        let form = new FormData();
        form.append('body',JSON.stringify({name:entries[i].name}));
        const resp = await axios.patch('api/entries?id=' + entries[i].id, form);
        if(resp){
            handleNotification(window,'update successful', EnotificationType.SUCCESS);
        }
    } catch (error) {
        
        handleNotification(window,'update failed', EnotificationType.ERROR);
    }
 }

 const deleteEntry = async (entry) => {
    try {
      if (!confirm(`you are about to delete entry ${entry.name}`)) return;
      const resp = await axios.delete("api/entries?id=" + entry.id);
      if (resp) {
        console.log(resp);
        handleNotification(
          window,
          "entry deleted successfully",
          EnotificationType.SUCCESS
        );
        entries.forEach((element, i) => {
          if (element.id == entry.id) entries.splice(i, 1);
        });
        entries = entries;
      }
    } catch (error) {
        console.log(error);
      handleNotification(
        window,
        "oops!!! something went wrong",
        EnotificationType.ERROR
      );
    }
  };
    
</script>
<svelte:head>
    <title>Manage Entries</title>
</svelte:head>

<div class="h-100 container-fluid">
 <!-- svelte-ignore missing-declaration -->
 <TopBar active="entries"/>
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
                               {#if !entry.edit}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td  on:click={()=>{switchName(entry,i)}}>{entry.name}</td>
                               {:else}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td><input on:blur={()=>{updateEntry(entry,i)}} bind:value={entries[i].name}/></td>
                               {/if}
                              
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
                                    <button title="delete entry" on:click={()=>{deleteEntry(entry)}} class="button alert square ">
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
