<script>
  import {goto} from "@sapper/app";


    const gohome = ()=>{
        goto('/');
    }
    const goback =()=>{
        history.back();
    }
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="row mt-2" >
  <div class="cell-12">
    <ul class="t-menu open bar horizontal">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <li><a on:click={goback} href="#"><span class="mif-arrow-left icon"></span></a></li>
        <li><a href="/competition"><span class="mif-laptop icon"></span></a></li>
        <li><a href="/category"><span class="mif-bubbles icon"></span></a></li>
        <li><a href="/competition"><span class="mif-bubble icon"></span></a></li>
        <li><a href="/"><span class="mif-user icon"></span></a></li>
    </ul>
  </div>
</div>
<style>
    .bar{
        width: 100vw
    }
</style>