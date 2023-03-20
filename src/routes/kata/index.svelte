<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        const res = await this.fetch(`api/kata`);
        const katas = await res.json();
console.log('new activation', katas);
        return { katas };
    }
</script>

<script >
    import axios from "axios";
    import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";
  import TopBar from "../../components/TopBar.svelte";
  export let katas = [];
    console.log(katas);
const deleteKata =async (kata)=>{
    try {
      if(!confirm(`you are about to delete kata ${kata.name}`)) return ;
      const resp = await  axios.delete('api/kata?id=' + kata.id);
      if(resp){
        console.log(resp);
        handleNotification(window, 'kata deleted successfully', EnotificationType.SUCCESS);
        katas.forEach((element, i )=> {
            if(element.id == kata.id) katas.splice(i,1);
           
        });
        katas = katas;
      }
    } catch (error) {
        
        handleNotification(window, 'oops!!! something went wrong', EnotificationType.ERROR);
    }
}
 
    
</script>
<svelte:head>
    <title>Manage Katas</title>
</svelte:head>

<div class="h-100 container-fluid">
 <!-- svelte-ignore missing-declaration -->
 <TopBar active="kata"/>
    <h1>Manage Katas</h1>
    <div class="container">
      <div class="row">
        <div class="cell-12">
            <a class="button primary float-right" href="/kata/add">Add Kata</a>
        </div>
      </div>
        <div class="row">
            <div class="cell-12">
                <table class="table  cell-hover">
                    <thead>
                        <tr style="color: white">
                            <th style="color:white">#</th>
                            <th style="color:white">Kata Name</th>

                            <th class="" style="color:white">created Date</th>
                            <th style="color:white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each katas as kata, i}
                            <tr>
                                <td>{i + 1}</td>
                                <td>{kata.name}</td>
                            

                         <td>{kata.createdAt}</td>
                                <td
                                    >
                                    <button on:click={()=>{deleteKata(kata)}} class="button alert square ">
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
