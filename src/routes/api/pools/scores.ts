
import { EpoolStatus, IpoolEntries, Pool, poolEntries, poolEntriesJudge } from "../../../Controllers/pools";

//uploading an athlete final result
export async function put(req, res){
 try {
    let body: IpoolEntries = JSON.parse(req.fields.body);
    body.status = 2;
    const resp = await poolEntries.update(body,{where:{id: req.query.id}});
    res.json(resp);
 } catch (error) {
       console.log(error);
    res.status(500).json(error);
 }
}

//endpoint to close pool

export async function patch(req, res){
    try {
       const resp = await Pool.update({status: EpoolStatus.COMPLETED},{where: {id: req.query.id}});
       res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export async function get(req: any, res){
   try{
      const pool: any = await Pool.findOne({where:{id: req.query.id}, include:['entries']});
      let tempPool = JSON.parse(JSON.stringify(pool));
      let promiseAry = [];
      tempPool.entries.forEach((element , i)=> {
         tempPool.entries
         promiseAry.push(poolEntriesJudge.findAll({where:{poolEntryId: element.pool_entries.id}}))
      });
      const resp = await Promise.all(promiseAry);
      if(resp){
         resp.forEach((e, i)=>{
            let myEle =JSON.parse(JSON.stringify(e));
            
            tempPool.entries[i].pool_entries.judges = myEle;
         })
         res.json(tempPool)
      }
     
   }
  catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
}