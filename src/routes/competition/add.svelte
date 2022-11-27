<script  >
  import TopBar from "../../components/TopBar.svelte";
  import axios from "axios";
  import {goto} from "@sapper/app";
  import { EnotificationType, handleNotification } from "../../functions/browserFunctions";
  let files;
  let fileName = "";
  let url ='';
  let win;
  let name = "";

const readFile =(files)=>{
    console.log(files);
    if(files){
        if(url){
            //to stop memory leaks
            URL.revokeObjectURL(url);
        }
        console.log(files[0]);
        fileName = files[0].name;
       url = URL.createObjectURL(files[0]);
        const upload = document.getElementById("small");
        console.log(url);
        upload.src = url;

    }
}
const submit =async ()=>{
    try {
        const form = new  FormData();
        if(files) form.append('files', files[0]);
        form.append('body', JSON.stringify({
            competitionName : name
        }));
       const axiosResp = await axios.post('api/competition', form);
       if(axiosResp.data.status == 'success'){

        handleNotification(window, 'competition was created successfully', EnotificationType.SUCCESS,()=>{goto('/competition')}, goto);
       }
       else{
        handleNotification(window, 'oops!!! competition was not created successfully', EnotificationType.ERROR);
       }
        
    } catch (error) {
        console.log(error.toJSON());
        
        handleNotification(window, 'oops!!! competition was not created successfully', EnotificationType.ERROR);
    }
}
  const triggerUpload  =()=>{
    const file = document.getElementById('file');
    file.click();
  }
  $: {
    readFile(files)
  }

  

</script>
<svelte:head>
    <title>Add Competition</title>
</svelte:head>
<div class="container-fluid h-100">
    <!-- svelte-ignore missing-declaration -->
    <TopBar/>
    <h1>Add Competition</h1>
    <div class="container">
        <div>
            
        </div>
        <form class="mt-3" on:submit|preventDefault={submit}>
            <div class="form-group">
                <label for="name">Competition Name</label>
                <input bind:value={name} required class="metro-input mt-2" id="name" type="text" placeholder="Enter competition name"/>
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div on:click={triggerUpload} id="upload" class="upload mt-4 text-center ">
                <img id="small" src="" alt="">
                <input  bind:files type="file" accept="image/*" name="fileupload" id="file">
                <p class="mb-3">{fileName || 'click here to upload image'}</p>
            </div>
           <div class="mt-5">
            <button type="reset" class="button float-left primary mr-3">Clear Form</button>
            <button type="submit" class="button float-right  success">submit</button>
           </div>
        </form>
    </div>
</div>

<style>
    .upload{
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