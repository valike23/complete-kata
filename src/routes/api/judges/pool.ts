
import { poolEntries, poolEntriesJudge } from "../../../Controllers/pools";

// export async function post(req, res) {
//     try {
//         let body = JSON.parse(req.fields.judge);
//         body.status = 1;
//         let poolEntry = await poolEntries.findOne({ where: { poolId: body.poolId, entryId: body.entryId } });
//         let updatePoolEntry = await poolEntries.update({ status: 1 }, { where: { id: poolEntry["id"] } });
//         body.poolEntryId = poolEntry["id"];
//         console.log(body);
//         const data: any = await poolEntriesJudge.findOne({ where: { poolEntryId: body.poolEntryId, judgeId: body.judgeId } });
//         if (data.poolEntryId) {
//             let poolEntryJudge = await poolEntriesJudge.update(body, { where: { poolEntryId: body.poolEntryId, judgeId: body.judgeId } });
//             res.json(poolEntryJudge);
//         }
//         else {
//             let poolEntryJudge = await poolEntriesJudge.create(body);
//             res.json(poolEntryJudge);
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(503).json(error);
//     }
// }

export async function post(req, res) {
    try {
        let body = JSON.parse(req.fields.judge);
        body.status = 1;
        let poolEntry = await poolEntries.findOne({ where: { poolId: body.poolId, entryId: body.entryId } });
        let updatePoolEntry = await poolEntries.update({ status: 1 }, { where: { id: poolEntry["id"] } });
        body.poolEntryId = poolEntry["id"];
        console.log(body);
        
        // Use `findOrCreate` instead of `findOne` to handle the case when no data is found.
        const [data, created] = await poolEntriesJudge.findOrCreate({ 
            where: { poolEntryId: body.poolEntryId, judgeId: body.judgeId },
            defaults: body // Use `defaults` to create a new entry with the provided data if it doesn't exist.
        });
        
        if (!created) {
            // If the entry already exists, update it with the new data.
            await poolEntriesJudge.update(body, { where: { poolEntryId: body.poolEntryId, judgeId: body.judgeId } });
        }

        res.json(data);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}


export async function patch(req, res) {
    try {
        let body = JSON.parse(req.fields.judge);

        let poolEntry = await poolEntries.findOne({ where: { poolId: body.poolId, entryId: body.entryId } });
        if (poolEntry) {
            console.log('a polymer test: ', poolEntry);
            body.poolEntryId = poolEntry["id"];
            console.log(body);
            let poolEntryJudge = await poolEntriesJudge.update({ ATH: body.ATH, TEC: body.TEC },
                { where: { poolEntryId: body.poolEntryId, judgeId: body.judgeId } });
            res.json(poolEntryJudge);
        }

    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}





export async function get(req, res) {
    try {
        let resp = await poolEntriesJudge.findAll();
        res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}

export async function put(req, res) {
    try {
        const { poolId, entryId } = req.query;
        let resp: any = {};
        const poolEntry: any = await poolEntries.findOne({ where: { poolId, entryId } });
        console.log(poolEntry.dataValues.id);
        const poolJudgeResult = await poolEntriesJudge.findAll({ where: { poolEntryId: poolEntry.dataValues.id } });

        resp = poolEntry.dataValues;
        resp.judges = poolJudgeResult;
        res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}