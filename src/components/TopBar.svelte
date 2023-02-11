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
    <ul class="t-menu open bar bg-black fg-white horizontal">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <li><a on:click={goback} href="#"><span class="mif-arrow-left icon"></span></a></li>
        <li><a href="/competition"><span class="mif-trophy icon"></span></a></li>
        <li><a href="/category"><span class="mif-stack icon"></span></a></li>
        <li><a title="entries" href="/entries"><span class="mif-user icon"></span></a></li>
        <li><a title="kata" href="/kata"><span class="mif-directions-bike icon"></span></a></li>
        <li><a title="pools" href="/pools"><span class="mif-apps icon"></span></a></li>
        <li><a target="_blank" title=" external screens" href="/screen/external"><span class="mif-laptop icon"></span></a></li>
        <li><a title="pools" href="/competition_controller"><span class="mif-tree icon"></span></a></li>
        <li><a target="_blank" title="judges screens" href="/screen/judgescreen"><span class="mif-tablet icon"></span></a></li>
        <li><a  title="go to home screen" href="/"><span class="mif-home icon"></span></a></li>
    </ul>
  </div>
</div>
<style>
    .bar{
        width: 100vw
    }
</style>