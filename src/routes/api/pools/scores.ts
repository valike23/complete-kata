import { EpoolStatus, IpoolEntries, Pool, poolEntries } from "../../../Controllers/pools";

//uploading an athlete final result
export async function put(req, res){
 try {
    let body: IpoolEntries = JSON.parse(req.fields.body);
    body.status = 1;
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