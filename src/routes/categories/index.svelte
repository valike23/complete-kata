<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const res = await this.fetch(`api/category`);
    const resp = await res.json();

    return { resp };
  }
</script>

<script >
  import axios from "axios";
  import TopBar from "../../components/TopBar.svelte";
  import { goto } from "@sapper/app";
  import {
    EnotificationType,
    handleNotification,
  } from "../../functions/browserFunctions";
  import { mergeArrays } from "../../functions/severShared";
  export let resp;
  let categories = resp.categories;
  let loading = false;
  let category = {};
  let activeCompetition = resp.activeComp;
  console.log(categories);

  const progress = async (category)=>{
    handleNotification(window, 'resolving category', EnotificationType.INFO);
    let pools = [];
    pools = await (await (await axios.get('api/category/details?id=' + category.id)).data).pools;
    console.log('pools are here for test',pools);
    // filter the pools to only show the ones with the same round as the category
    const workPools = [];
    pools.forEach((pool)=>{
      console.log('entered place 1');
      if(pool.round == category.round) workPools.push(pool);

    });

    // loop through pools and check if there is any incomplete pool if any bounce back
    workPools.forEach((pool2)=>{
      console.log('entered place 2');
      if(pool2.status !== 2) return handleNotification(window, 'some pools have not been completed', EnotificationType.ERROR);

      goto('categories/progress?id=' +  category.id + '&round=' + category.round + '&name='+  category.categoryName) ;
    });
    
    console.log(mergeArrays(workPools));
  }

  const draftPools = async (category) => {
    if(category.isDrafted) return handleNotification(window,
    'this category has already being drafted', EnotificationType.ERROR);
   const swal = await Swal.fire({
      title: "<strong>seeding</strong>",
      icon: "info",
      html:`<p>Do you want to apply seeding to this draft?</p>`,
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'apply seeding',
      cancelButtonText: 'no seeding',
    });

    console.log(swal);
    if(swal.isConfirmed){
        goto(`categories/draft?seeding=1&id=${category.id}&name=${category.categoryName}`);
    }
    else if(swal.dismiss == 'cancel'){

        goto(`categories/draft?seeding=0&id=${category.id}&name=${category.categoryName}`);
    }
  };
  const deleteCategory = async (category) => {
    try {
      let con = confirm('please note after deleting this category all record of it would be lost. Do you want to continue?');
      if(!con) return;
      const resp = await axios.delete("api/category?id=" + category.id);
      if (resp) {
        handleNotification(
          window,
          "competition deleted successfully",
          EnotificationType.SUCCESS
        );

        categories.forEach((comp, i) => {
          if (comp.id == category.id) {
            categories.splice(i, 1);
          }
        });
        categories = categories;
      }
    } catch (error) {
      handleNotification(
        window,
        "competition failed to create",
        EnotificationType.error
      );
      console.log(error);
    }
  };
  const submit = async () => {
    try {
      loading = true;
      category.competitionId = activeCompetition.id;
      handleNotification(window, "uploading category", EnotificationType.INFO);
      const form = new FormData();
      form.append("body", JSON.stringify(category));
      const respData = await (await axios.post(`api/category`, form)).data;
      console.log(respData);
      if (respData) {
        loading = false;
        category = {};
        handleNotification(
          window,
          "upload is successful",
          EnotificationType.SUCCESS
        );
        console.log(respData);
        categories.push(respData);
        categories = categories;
      }
    } catch (error) {
      loading = false;
      handleNotification(
        window,
        "something went wrong",
        EnotificationType.ERROR
      );
    }
  };
  const updateCategoryName =async (category, i)=>{
    categories[i].edit = false;
    console.log(categories[i]);

    try {
        let form = new FormData();
        form.append('body',JSON.stringify({categoryName:categories[i].categoryName}));
        const resp = await axios.put('api/category?id=' + categories[i].id, form);
        if(resp){
            handleNotification(window,'update successful', EnotificationType.SUCCESS);
        }
    } catch (error) {
        
        handleNotification(window,'update failed', EnotificationType.ERROR);
    }
 }
 const switchName =(category, i)=>{
    categories[i].edit = true;
 }
</script>

<svelte:head>
  <title>Manage Categories</title>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="categories"/>
  <h1>Categories</h1>
  <div class="container">
    <div class="row cell-12 mb-5">
      <h4>Add Category</h4>
      <p><small>fill the below form to add a category</small></p>
      <form on:submit|preventDefault={submit} class="row">
        <div class="cell-6">
          <div class="form-group">
            <label for="category">Category Name</label>
            <input
              bind:value={category.categoryName}
              required
              type="text"
              placeholder="category name"
              class="metro-input"
            />
          </div>
        </div>
        <div class="cell-6">
          <div class="form-group">
            <label for="category">Category Gender</label>
            <select
              bind:value={category.gender}
              required
              name=""
              class="metro-input"
            >
              <option selected disabled>Pick a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="none">None</option>
            </select>
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
              <th style="color:white">category Name</th>
              <th class="" style="color:white">created Date</th>
              <th style="color:white">gender</th>
              <th style="color:white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each categories as category, i}
              <tr>
                <td>{i + 1}</td>
                {#if !category.edit}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td  on:click={()=>{switchName(category,i)}}>{category.categoryName}</td>
                {:else}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <td><input on:blur={()=>{updateCategoryName(category,i)}} bind:value={categories[i].categoryName}/></td>
                {/if}
                <td>{category.createdAt}</td>
                <td>{category.gender}</td>

                <td>
                  <button class="button primary square " title="edit category">
                    <span class="mif-pencil" />
                  </button>
                  <button
                    on:click={() => {
                      draftPools(category);
                    }}
                    class="button success square "
                    title="draft category pools"
                  >
                    <span class="mif-table" />
                  </button>
                 {#if category.isDrafted}
                 <button
                 on:click={() => {
                   progress(category);
                 }}
                 class="button secondary square "
                 title="Progress Category"
               >
                 <span class="mif-forward" />
               </button>
                 {/if}
                  <button
                    class="button alert square "
                    title="destroy this category"
                  >
                    <span on:keypress={()=>{deleteCategory(category)}} on:click={()=>{deleteCategory(category)}} class="mif-bin" />
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
