<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const res = await this.fetch(`api/category`);
    const res2 = await this.fetch(`api/club`);
    const resp = await res.json();
    const resp2 = await res2.json();

    return { resp, resp2 };
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
  export let resp, resp2;
  const categories = resp.categories;
  let myCategory;
  console.log(categories);
  let loading = false;
  let competitor = {
    name: "",
    clubId: 0,
    categoryId: 0,
  };
  const clubs = resp2.body;
  console.log(clubs);
  let files;
  let fileName = "";
  let url = "";
  let name = "";
  let isBulk = false;


  const submit = async () => {
    try {
        loading = true;
        const form = new FormData();
        form.append('body', JSON.stringify(competitor));
        const resp = await (await axios.post('api/entries', form)).data;
        if(resp.status == 'success'){
            loading = false;
            handleNotification(window, 'competitor added successfully', EnotificationType.SUCCESS,()=>{goto('/entries')}, goto);
        }
        else {
            loading = false;
            console.log(resp.body);
          handleNotification(window, 'oops!!! failed to add competitor', EnotificationType.ERROR);
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
      form.append(
        "body",
        JSON.stringify({
          competitionName: name,
        })
      );
      const axiosResp = await axios.put("api/entries?id=" + myCategory, form);
      if (axiosResp.data) {
        handleNotification(
          window,
          "competitiors list was created successfully",
          EnotificationType.SUCCESS,
          () => {
            goto("/entries");
          },
        
        );
      } else {
        handleNotification(
          window,
          "oops!!! competitiors list was not created successfully",
          EnotificationType.ERROR
        );
      }
    } catch (error) {
      console.log(error.toJSON());

      handleNotification(
        window,
        "oops!!! competition was not created successfully",
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
  <title>Add Competitors</title>
</svelte:head>
<div class="container-fluid h-100">
  <!-- svelte-ignore missing-declaration -->
  <TopBar />
  <h1>Add Competitor</h1>
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
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Pick Category</label>
              <select bind:value={myCategory} required class="metro-input" id="category">
                <option disabled selected>Pick a category</option>
                {#each categories as category}
                  <option value={category.id}>{category.categoryName}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="cell-6">
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
              <label for="name">Competitor Name</label>
              <input
                bind:value={competitor.name}
                required
                class="metro-input mt-2"
                id="name"
                type="text"
                placeholder="Enter competitor full name"
              />
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Category</label>
              <select
                bind:value={competitor.categoryId}
                class="metro-input"
                required
                name=""
                id=""
              >
                <option disabled selected>Pick a Category</option>
                {#each categories as category}
                  <option value={category.id}>{category.categoryName}</option>
                {/each}
              </select>
            </div>
          </div>
          <div class="cell-6">
            <div class="form-group">
              <label for="name">Club</label>
              <select
                bind:value={competitor.clubId}
                class="metro-input"
                required
                name=""
                id=""
              >
                <option disabled selected>Pick a Club</option>
                {#each clubs as club}
                  <option value={club.id}>{club.clubName}</option>
                {/each}
              </select>
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

<style>
  .upload {
    border: 2px dashed white;
    min-height: 50px;
  }
  #file {
    height: 0px;
    width: 0px;
  }
  #small {
    max-height: 60px;
  }
</style>
