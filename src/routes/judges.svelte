<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
      const res = await this.fetch(`api/judges`);
      const judges = await res.json();
  
      return { judges };
    }
  </script>

<script>
  import TopBar from "../components/TopBar.svelte";
  import axios from "axios";
  let judge ={
    judgeName: '',
    password:''
  };
  import {
    EnotificationType,
    handleNotification,
  } from "../functions/browserFunctions";
  export let judges = [];
  let loading = false;
  const submit = async () => {
    try {
      loading = true;
      handleNotification(window, "uploading judge", EnotificationType.INFO);
      const form = new FormData();
      form.append("body", JSON.stringify(judge));
      const respData = await (await axios.post(`api/judges`, form)).data;
      console.log(respData);
      if (respData) {
        loading = false;
    
        handleNotification(
          window,
          "upload is successful",
          EnotificationType.SUCCESS
        );
        console.log(respData);
        judges.push(respData);
        judges = judges;
      }
    } catch (error) {
      loading = false;
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
    <title>Manage  Judges</title>
  </svelte:head>
  
  <div class="h-100 container-fluid">
    <TopBar />
    <h1>Manage Judges</h1>
    <div class="container">
      <div class="row cell-12 mb-5">
        <h4>Add Judges</h4>
        <p><small>fill the below form to add a judge</small></p>
        <form on:submit|preventDefault={submit} class="row">
          <div class="cell-6">
            <div class="form-group">
              <label for="judge">Judge Name</label>
              <input
                bind:value={judge.judgeName}
                required
                type="text"
                placeholder="judge name"
                class="metro-input"
              />
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="category">judge  Password</label>
              <input
                bind:value={judge.password}
                required
                type="password"
                name=""
                class="metro-input"
              >
               
            </div>
          </div>
  
          <div class="cell-12 mt-3">
            {#if loading}
              <button disabled type="submit" class="button primary float-right"
                >submiting...</button
              >
            {:else}
              <button type="submit" class="button primary float-right"
                >submit</button
              >
            {/if}
          </div>
        </form>
      </div>
  
      <div class="row">
        <h4>Manage Categories</h4>
        <div class="cell-12">
          <table class="table  cell-hover">
            <thead>
              <tr style="color: white">
                <th style="color:white">#</th>
                <th style="color:white">Judge Name</th>
                <th class="" style="color:white">created Date</th>
                <th style="color:white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {#each judges as judge, i}
                <tr>
                  <td>{i + 1}</td>
                  <td>{judge.judgeName}</td>
                  <td>{judge.createdAt}</td>
  
                  <td>
                    <button class="button primary square " title="edit category">
                      <span class="mif-pencil" />
                    </button>
                  
                    <button
                      class="button alert square "
                      title="destroy this category"
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
  </div>