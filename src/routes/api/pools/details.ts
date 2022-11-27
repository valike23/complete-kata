import { Entry } from "../../../Controllers/entries";
import { Pool, poolEntries } from "../../../Controllers/pools";


export async function get(req, res) {
    try {
     const resp = await  Pool.findAll({where:{id: req.query.id}, include: Entry}) ;
     res.json(resp);
    } catch (error) {
        
    }
}
 

//api to generate csv file of pool entries
export async function put(req, res){
    try {
        const resp = await  Pool.findAll({where:{id: req.query.id}, include: Entry}) ;
        let entries = resp[0]["entries"];
        console.log(entries);
        res.json(entries);
    } catch (error) {
        
    }
}

//api to update kata for an athlete in a pool

export async function patch(req, res){
    try {
        const {poolId, entryId, kata} = req.query;
       const resp = await poolEntries.update({kata}, {where: {poolId, entryId }});
       res.json(resp);
    } catch (error) {
        
    }
}