<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const res = await this.fetch(`api/club`);
    const resp = await res.json();

    return { resp };
  }
</script>

<script>
  import { goto } from "@sapper/app";
  import axios from "axios";
  import TopBar from "../../components/TopBar.svelte";
  import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";
  export let resp;
  let clubs = resp.body;
  clubs = clubs;
  console.log(clubs);
  const openAddclub = () => {
    goto("clubs/add");
  };
  const deleteClub = async (club) => {
    try {
      if (!confirm(`you are about to delete club ${club.clubName}`)) return;
      const resp = await axios.delete("api/club?id=" + club.id);
      if (resp) {
        console.log(resp);
        handleNotification(
          window,
          "club deleted successfully",
          EnotificationType.SUCCESS
        );
        clubs.forEach((element, i) => {
          if (element.id == club.id) clubs.splice(i, 1);
        });
        clubs = clubs;
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
  const activateclub = async (club, i) => {
    try {
      const axiosResp = await (await axios.put("api/club?id=" + club.id)).data;
      if (axiosResp) {
        handleNotification(
          window,
          `${club.clubName} has been made active`,
          EnotificationType.SUCCESS
        );
        clubs.forEach((club, i) => {
          clubs[i].active = false;
        });
        clubs[i].active = true;
        clubs = clubs;
      }
    } catch (error) {}
  };

  const switchName =(club, i)=>{
    clubs[i].edit = true;
 }
 const updateClubName =async (club, i)=>{
    clubs[i].edit = false;
    console.log(clubs[i]);

    try {
        let form = new FormData();
        form.append('body',JSON.stringify({clubName:clubs[i].clubName}));
        const resp = await axios.patch('api/club?id=' + clubs[i].id, form);
        if(resp){
            handleNotification(window,'update successful', EnotificationType.SUCCESS);
        }
    } catch (error) {
        
        handleNotification(window,'update failed', EnotificationType.ERROR);
    }
 }
</script>

<svelte:head>
  <title>Manage club</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="clubs"/>
  <h1>Manage club</h1>
  <div class="container">
    <div class="row cell-12 mb-5 pr-5">
      <button on:click={openAddclub} class="button primary float-right"
        >Add club</button
      >
    </div>
    <div class="row">
      <div class="cell-12">
        <table class="table  cell-hover">
          <thead>
            <tr style="color: white">
              <th style="color:white">#</th>
              <th style="color:white">club Name</th>
              <th class="" style="color:white">created Date</th>
              <th style="color:white">Image</th>
              <th style="color:white">Actions</th>
            </tr>
          </thead>

          <tbody>
            {#each clubs as club, i}
              <tr>
                <td>{i + 1}</td>
                 {#if !club.edit}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td  on:click={()=>{switchName(club,i)}}>{club.clubName}</td>
                               {:else}
                               <!-- svelte-ignore a11y-click-events-have-key-events -->
                               <td><input on:blur={()=>{updateClubName(club,i)}} bind:value={clubs[i].clubName}/></td>
                               {/if}
                <td>{club.createdAt}</td>
                <td
                  ><img
                    class="img"
                    src={club.flag || "images/kata.jpg"}
                    alt=""
                  /></td
                >

                <td>
                  <button title="delete club" on:click={()=>{deleteClub(club)}} class="button alert square ">
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
