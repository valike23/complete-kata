
<script context="module">
    // the (optional) preload function takes a
    // `{ path, params, query }` object and turns it into
    // the data we need to render the page
    export async function preload(page, session) {
        console.log(page);
        const res2 = await this.fetch(`api/club`);

        const res = await this.fetch(`api/pools/scores?id=${page.query.id}`);
       const pool = await res.json();
       const clubsResp = await res2.json();
        return { pool , clubsResp};
    }
</script>
<script>
    import TopBar from "../../components/TopBar.svelte";
  
    export let pool, clubsResp ;
      console.log(pool);
      let entries = [];
      let clubs = clubsResp.body;
      console.log(clubs);

      const transform =()=>{
       
        let result =[];
        pool.entries.forEach((element , i)=> {
            let entry = {name: element.name, kata: element.pool_entries.kata,
                 club: clubs.find((club)=>{
                    return club.id == element.clubId
                 }),
                judges: element.pool_entries.judges, TEC: element.pool_entries.TEC, ATH: element.pool_entries.ATH
            , total: element.pool_entries.total};
            result.push(entry);
        });;
        console.log('sure', result);
        result.sort((a,b)=>{
            return b.total - a.total;
        })
        console.log('sure', result);
        entries = result;

      }

      transform();
      const download =()=>{
        console.log(window);
        exportToExcel("table");
      }
  </script>

<svelte:head>
    <title>Result Pool</title>
    <script src="js/xlsx.js"></script>
</svelte:head>


<div class="h-100 container-fluid">
<TopBar/>
<div class="row mb-3">
    <div class="cell">
        <button on:click={download} class="button primary">
            download as csv
        </button>
    </div>
</div>

<table id="table" class="table  cell-hover" >
    <thead>
        <tr style="color: white">
            <th style="color:white">#</th>
            <th style="color:white">Competitor</th>
            <th style="color:white">Club</th>
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
                <td>{entry.club.clubName}</td>
                <td>{entry.kata}</td>
             {#each entry.judges as judge}
             <td>{judge.TEC}</td>
             <td>{judge.ATH}</td>
             {/each}
             <td>{(entry.TEC || 0).toFixed(2)}</td>
             <td>{(entry.ATH || 0).toFixed(2)}</td>
             <td>{(entry.total || 0).toFixed(2)}</td>
               
              
            </tr>
        {/each}
    </tbody>
</table>

</div>

