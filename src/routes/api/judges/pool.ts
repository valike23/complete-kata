
import {poolEntries, poolEntriesJudge} from "../../../Controllers/pools";

export async function post (req, res){
try {
    let body = JSON.parse(req.fields.judge);
    body.status = 1;
    let poolEntry = await poolEntries.findOne({where:{poolId: body.poolId, entryId: body.entryId}});
    let updatePoolEntry = await poolEntries.update({status: 1},{where:{id: poolEntry["id"]}});
    body.poolEntryId = poolEntry["id"];
    console.log(body);
    let poolEntryJudge = await poolEntriesJudge.create(body);
    res.json(poolEntryJudge);
} catch (error) {
    console.log(error);
    res.status(503).json(error);
}
}

export async function get(req, res){
    try {
      let resp = await  poolEntriesJudge.findAll();
      res.json(resp);
    } catch (error) {
        console.log(error);
    res.status(503).json(error);
    }
}

export async function put(req, res){
    try {
        const  {poolId, entryId} = req.query;
        let resp: any = {};
        const poolEntry: any = await poolEntries.findOne({where:{poolId, entryId}});
        console.log(poolEntry.dataValues.id);
        const poolJudgeResult = await poolEntriesJudge.findAll({where:{poolEntryId: poolEntry.dataValues.id}});
     
        resp = poolEntry.dataValues;
        resp.judges = poolJudgeResult;
        res.json(resp);
    } catch (error) {
        console.log(error);
    res.status(503).json(error);
    }
}