
<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        console.log(page);
        const res = await this.fetch(`api/pools/scores?id=${page.query.id}`);
       const pool = await res.json();
        return { pool };
    }
</script>
<script>
    import TopBar from "../../components/TopBar.svelte";
  
    export let pool;
      console.log(pool);
      let entries = [];

      const transform =()=>{
       
        let result =[];
        pool.entries.forEach((element , i)=> {
            let entry = {name: element.name, kata: element.pool_entries.kata,
                judges: element.pool_entries.judges, TEC: element.pool_entries.TEC, ATH: element.pool_entries.ATH
            , total: element.pool_entries.total};
            result.push(entry);
        });;
        entries = result;

      }

      transform();
  </script>

<svelte:head>
    <title>Result Pool</title>
</svelte:head>


<div class="h-100 container-fluid">
<TopBar/>

<table class="table  cell-hover" >
    <thead>
        <tr style="color: white">
            <th style="color:white">#</th>
            <th style="color:white">Competitor</th>
            <th style="color:white">Kata</th>
            {#each entries[0].judges as judge,i}
            <th style="color:white">{i + 1}T</th>
            <th style="color:white">{i + 1}A</th>
            {/each}
            <th style="color:white">TEC</th>
            <th style="color:white">ATH</th>
            <th style="color:white">Total</th>
        </tr>
    </thead>
    <tbody>
        {#each entries as entry, i}
            <tr>
                <td>{i + 1}</td>
                <td>{entry.name}</td>
                <td>{entry.kata}</td>
             {#each entry.judges as judge}
             <td>{judge.TEC}</td>
             <td>{judge.ATH}</td>
             {/each}
             <td>{entry.TEC}</td>
             <td>{entry.ATH}</td>
             <td>{entry.total}</td>
               
              
            </tr>
        {/each}
    </tbody>
</table>

</div>

