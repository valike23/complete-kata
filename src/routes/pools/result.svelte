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
    return { pool, clubsResp };
  }
</script>

<script>
  import TopBar from "../../components/TopBar.svelte";

  export let pool, clubsResp;
  console.log(' the pools here,',pool);
  let entries = [];
  let clubs = clubsResp.body;
  console.log(clubs);
  const setup = function (judges) {
    let resu = 1;
    let totalAth = 1;
    let totalTech = 1;
    let tempJudges = JSON.parse(JSON.stringify(judges));
    let tempJudges2 = JSON.parse(JSON.stringify(judges));
    let AAP = 0;
    let TAP = 0;
    let isComplete = false;
    for (let index = 0; index < judges.length; index++) {
      const element = judges[index];
      if (element.athletic_performance == undefined) {
        isComplete = false;
        break;
      } else {
        isComplete = true;
      }
    }
    judges.forEach((j) => {
      console.log(j.technical_performance, j.athletic_performance);
      TAP += j.technical_performance;
      AAP += j.athletic_performance;
    });

    console.log(AAP, TAP);
    if (isComplete) {
      submit = true;
      tempJudges.sort((a, b) => {
        return a.technical_performance - b.technical_performance;
      });
      let lowestTP = tempJudges[0];
      let highestTP = tempJudges[4];
      console.log("lowest TP", lowestTP);
      console.log("highest TP", highestTP);
      tempJudges2.sort((a, b) => {
        return a.athletic_performance - b.athletic_performance;
      });
      let lowestAP = tempJudges2[0];
      let highestAP = tempJudges2[4];
      console.log("lowest AP", lowestAP);
      console.log("highest AP", highestAP);
      const tpl = "tp" + lowestTP.id;
      const tph = "tp" + highestTP.id;
      const apl = "ap" + lowestAP.id;
      const aph = "ap" + highestAP.id;
      console.log(tpl, tph, apl, aph);
      try {
        document.getElementById(tpl).style.color = "red";
        document.getElementById(tph).style.color = "red";
        document.getElementById(apl).style.color = "red";
        document.getElementById(aph).style.color = "red";
      } catch (error) {}

      AAP =
        AAP - highestAP.athletic_performance - lowestAP.athletic_performance;
      TAP =
        TAP - highestTP.technical_performance - lowestTP.technical_performance;
      totalAth = AAP;
      totalTech = TAP;
      resu = totalAth * 0.3 + totalTech * 0.7;
    } else {
      totalTech = AAP / judges.length;
      totalAth = TAP / judges.length;
    }
    return { totalAth, totalTech, resu };
  };
  const transform = () => {
    let result = [];
    pool.entries.forEach((element, i) => {
      const { totalAth, totalTech, resu } = setup(
        element.pool_entries.judges
      );
      let entry = {
        name: element.name,
        kata: element.pool_entries.kata,
        club: clubs.find((club) => {
          return club.id == element.clubId;
        }),
        judges: element.pool_entries.judges,
        TEC: element.pool_entries.TEC || totalTech,
        ATH: element.pool_entries.ATH || totalAth,
        total: element.pool_entries.total || resu,
      };
      result.push(entry);
    });
    console.log("sure", result);
    result.sort((a, b) => {
      return b.total - a.total;
    });
    console.log("sure", result);
    entries = result;
  };

  transform();
  const download = () => {
    console.log(window);
    exportToExcel("table");
  };
</script>

<svelte:head>
  <title>Result Pool</title>
  <script src="js/xlsx.js"></script>
</svelte:head>

<div class="h-100 container-fluid">
  <TopBar active="pools"/>
  <div class="row mb-3">
    <div class="cell">
      <button on:click={download} class="button primary">
        download as csv
      </button>
    </div>
  </div>

  <table id="table" class="table  cell-hover">
    <thead>
      <tr style="color: white">
        <th style="color:white">#</th>
        <th style="color:white">Competitor</th>
        <th style="color:white">Club</th>
        <th style="color:white">Kata</th>
        {#each entries[0].judges as judge, i}
          <th style="color:white">Judge {i + 1}</th>
        {/each}
       
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
            <td>{judge.RESULT}</td>
          
          {/each}
          <td>{(entry.total || 0).toFixed(2)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
