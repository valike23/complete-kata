<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const res2 = await this.fetch(`api/kata`);
   
    const katas = await res2.json();

    return { katas };
  }
</script>

<script>
  import TopBar from "../../components/TopBar.svelte";
  import axios from "axios";
  import { goto } from "@sapper/app";
  import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";
  export let  katas;
  console.log(katas);
  let loading = false;
 
  let files;
  let kata = "";
  let isBulk = false;


  const submit = async () => {
    try {
        loading = true;
        const form = new FormData();
        form.append('kata', kata);
        const resp = await (await axios.post('api/kata', form)).data;
        if(resp){
            loading = false;
            handleNotification(window, 'kata added successfully', EnotificationType.SUCCESS,()=>{goto('/kata')}, goto);
        }
        

    } catch (error) {
        loading = false;
        console.log(error);
        handleNotification(window, 'oops!!! something went wrong', EnotificationType.ERROR);
    }
  };
  const bulkSubmit = async () => {
    try {
      const form = new FormData();
      if (files) form.append("excel", files[0]);
    
      const axiosResp = await axios.put("api/kata", form);
      if (axiosResp.data) {
        handleNotification(
          window,
          "katas list was created successfully",
          EnotificationType.SUCCESS,
          () => {
            goto("/kata");
          },
        
        );
      } else {
        handleNotification(
          window,
          "oops!!! katas list was not created successfully",
          EnotificationType.ERROR
        );
      }
    } catch (error) {
      console.log(error.toJSON());

      handleNotification(
        window,
        "oops!!! kata was not created successfully",
        EnotificationType.ERROR
      );
    }
  };
  const triggerUpload = () => {
    const file = document.getElementById("file");
    file.click();
  };


  const switchTo = (text) => {
    if (text == "single") isBulk = false;
    if (text == "bulk") isBulk = true;
  };
</script>

<svelte:head>
  <title>Add kata</title>
</svelte:head>
<div class="container-fluid h-100">
  <!-- svelte-ignore missing-declaration -->
  <TopBar />
  <h1>Add kata</h1>
  <div class="container">
    <div class="row">
      <div class="cell-6">
        <button
          on:click={() => {
            switchTo("single");
          }}
          class="button primary float-right">single</button
        >
      </div>
      <div class="cell-6">
        <button
          on:click={() => {
            switchTo("bulk");
          }}
          class="button primary float-left">Bulk</button
        >
      </div>
    </div>

    <h3>
      {#if isBulk}
        Bulk Upload
      {:else}
        Single Upload
      {/if}
    </h3>
    {#if isBulk}
      <form class="mt-3" on:submit|preventDefault={bulkSubmit}>
        <div class="row">
         
          <div class="cell-12">
            <div class="form-group">
              <label for="name">Upload Excel</label>
              <input
                required
                type="file"
                bind:files
                class="metro-input"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </div>
          </div>
        </div>

        <div class="mt-5">
          <button type="submit" class="button float-right  success"
            >submit</button
          >
        </div>
      </form>
    {:else}
      <form class="mt-3" on:submit|preventDefault={submit}>
        <div class="row">
          <div class="cell-12">
            <div class="form-group">
              <label for="name">Kata Name</label>
              <input
                bind:value={kata}
                required
                class="metro-input mt-2"
                id="name"
                type="text"
                placeholder="Enter kata name"
              />
            </div>
          </div>
       
        </div>

        <div class="mt-5">
          {#if loading}
          <button disabled type="submit" class="button float-right  success"
          >submiting...</button
        >
          {:else}
          <button type="submit" class="button float-right  success"
          >submit</button
        >
          {/if}
        </div>
      </form>
    {/if}
  </div>
</div>

