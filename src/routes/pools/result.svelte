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
  let clubs = clubsResp.body || [];
  console.log(clubs);
  const toScoreNumber = (value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue : 0;
  };
  const formatScore = (value) => toScoreNumber(value).toFixed(2);
  const roundScore = (value) => Number(toScoreNumber(value).toFixed(2));
  const getJudgeKey = (judge) => {
    if (!judge) return undefined;
    if (judge.judgeId !== undefined && judge.judgeId !== null) {
      return judge.judgeId;
    }
    return judge.id;
  };
  const setup = function (judges, savedTotal) {
    const normalizedJudges = Array.isArray(judges) ? judges : [];
    if (!normalizedJudges.length) {
      return {
        baseResult: 0,
        finalTotal: 0,
        extraPoint: 0,
        droppedJudgeIds: [],
      };
    }

    let summedScores = 0;
    let isComplete = true;
    let isDisqualified = false;

    normalizedJudges.forEach((judge) => {
      if (judge.RESULT == undefined) {
        isComplete = false;
      }
      const judgeScore = toScoreNumber(judge.RESULT);
      if (judgeScore === 0) isDisqualified = true;
      summedScores += judgeScore;
    });

    let droppedJudgeIds = [];
    let baseResult = summedScores;

    if (isComplete) {
      const sortedJudges = JSON.parse(JSON.stringify(normalizedJudges)).sort(
        (a, b) => toScoreNumber(a.RESULT) - toScoreNumber(b.RESULT)
      );
      const lowestJudge = sortedJudges[0];
      const highestJudge = sortedJudges[sortedJudges.length - 1];
      droppedJudgeIds = [getJudgeKey(lowestJudge), getJudgeKey(highestJudge)].filter(
        (value) => value !== undefined && value !== null
      );
      baseResult =
        summedScores -
        toScoreNumber(lowestJudge.RESULT) -
        toScoreNumber(highestJudge.RESULT);
    }

    if (isDisqualified) {
      summedScores = 0;
      baseResult = 0;
    }

    const hasSavedTotal =
      savedTotal !== undefined && savedTotal !== null && savedTotal !== "";
    const storedTotal = hasSavedTotal ? roundScore(savedTotal) : roundScore(baseResult);
    const extraPoint = hasSavedTotal
      ? roundScore(Math.max(0, storedTotal - roundScore(baseResult)))
      : 0;

    return {
      baseResult: roundScore(baseResult),
      finalTotal: storedTotal,
      extraPoint,
      droppedJudgeIds,
    };
  };
  const transform = () => {
    let result = [];
    (pool.entries || []).forEach((element) => {
      const scoreBreakdown = setup(
        element.pool_entries.judges,
        element.pool_entries.total
      );
      let entry = {
        name: element.name,
        kata: element.pool_entries.kata,
        club: clubs.find((club) => {
          return club.id == element.clubId;
        }),
        judges: element.pool_entries.judges,
        extraPoint: scoreBreakdown.extraPoint,
        baseResult: scoreBreakdown.baseResult,
        total: scoreBreakdown.finalTotal,
        droppedJudgeIds: scoreBreakdown.droppedJudgeIds,
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
        {#if entries.length}
          {#each entries[0].judges as judge, i}
            <th style="color:white">Judge {i + 1}</th>
          {/each}
        {/if}
        <th style="color:white">Extra P.</th>
        <th style="color:white">Total</th>
      </tr>
    </thead>
    <tbody>
      {#each entries as entry, i}
        <tr>
          <td>{i + 1}</td>
          <td>{entry.name}</td>
          <td>{entry.club ? entry.club.clubName : ""}</td>
          <td>{entry.kata}</td>
          {#each entry.judges as judge}
            <td class:dropped-score={entry.droppedJudgeIds.includes(getJudgeKey(judge))}
              >{formatScore(judge.RESULT)}</td
            >
          {/each}
          <td>{formatScore(entry.extraPoint)}</td>
          <td>{formatScore(entry.total)}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .dropped-score {
    color: red;
    font-weight: 700;
  }
</style>
