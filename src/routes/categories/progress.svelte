<script context="module">
  // the (optional) preload function takes a
  // `{ path, params, query }` object and turns it into
  // the data we need to render the page
  export async function preload(page, session) {
    const {  id, name , round} = page.query;
    const res = await this.fetch(`api/entries/category?id=${id}`);
    const res2 = await this.fetch(`api/category/details?id=${id}`);
    const res3 = await this.fetch(`api/pools/special?categoryId=${id}&round=${round}`)
    const entries = await res.json();
    const pools = await res2.json();
    const poolsDetail = await res3.json();

    return { entries, id, name , pools,round, poolsDetail};
  }
</script>

<script >
  import { processEntriesArray } from "../../functions/severShared";

  
  export let entries, pools, poolsDetail, name, round;

  console.log('entries', entries, 'and  pools', pools);
  console.log(poolsDetail);
  let final = [];
  final.push(poolsDetail[0]);
  final.push(poolsDetail[1]);
  console.log('final app2: ',processEntriesArray(final,name, round ));
</script>