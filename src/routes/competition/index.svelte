<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        const res = await this.fetch(`api/competition`);
        const competitions = await res.json();

        return { competitions };
    }
</script>

<script>
    import {goto} from "@sapper/app";
  import axios from "axios";
  import TopBar from "../../components/TopBar.svelte";
  import { EnotificationType, handleNotification } from "../../functions/browserFunctions";
    export let competitions = [];
    competitions = competitions;
    console.log(competitions);
    const openAddCompetition = () => {
       goto('competition/add');
    };
const deleteCompetition =async (competition)=>{
try {
   const resp = await axios.delete('api/competition?id=' + competition.id);
   if(resp){
    handleNotification(window,
    'competition deleted successfully',
     EnotificationType.SUCCESS);

     competitions.forEach((comp, i)=>{
        if(comp.id == competition.id){
            competitions.splice(i,1);
        }
     });
     competitions = competitions;
   };
   
} catch (error) {
    handleNotification(window, 'competition failed to create',
    EnotificationType.error);
    console.log(error);
}
}
    const activateCompetition =async (competition, i)=>{
        try {
          const axiosResp = await  (await axios.put('api/competition?id='+ competition.id)).data;
          if(axiosResp){
            handleNotification(window, `${competition.competitionName} has been made active`,
             EnotificationType.SUCCESS);
             competitions.forEach((competition, i)=>{
                competitions[i].active = false;
             });
             competitions[i].active = true;
             competitions = competitions;

          }
        } catch (error) {
            
        }
    }
 
    
</script>
<svelte:head>
    <title>Manage Competition</title>
</svelte:head>

<div class="h-100 container-fluid">
 <TopBar/>
    <h1>Manage Competition</h1>
    <div class="container">
        <div class="row cell-12 mb-5 pr-5">
            <button
                on:click={openAddCompetition}
                class="button primary float-right">Add Competition</button
            >
        </div>
        <div class="row">
            <div class="cell-12">
                <table class="table  cell-hover">
                    <thead>
                        <tr style="color: white">
                            <th style="color:white">#</th>
                            <th style="color:white">competition Name</th>
                            <th class="" style="color:white">created Date</th>
                            <th style="color:white">Image</th>
                            <th style="color:white">Active</th>
                            <th style="color:white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {#each competitions as competition, i}
                            <tr>
                                <td>{i + 1}</td>
                                <td>{competition.competitionName}</td>
                                <td>{competition.createdAt}</td>
                                <td
                                    ><img
                                        class="img"
                                        src={competition.image ||
                                            "images/kata.jpg"}
                                        alt=""
                                    /></td
                                >
                                <td>{#if competition.active}
                                    <span class="mif-done mif-2x fg-green"></span>
                                {:else}
                                <span class="mif-cross-light mif-2x fg-red "></span>
                                {/if}</td>
                                <td
                                    ><button on:click={()=>{activateCompetition(competition, i)}} class="button primary square " title="make this competition active">
                                        <span class="mif-checkmark" />
                                    </button>
                                    <button on:click={()=>{deleteCompetition(competition)}} class="button alert square ">
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
