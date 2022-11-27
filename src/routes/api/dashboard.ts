import { Competition } from "../../Controllers/competition";

export async function get(req, res){
    //dashboard summary here
    try {
        const promises = [];
        promises.push(Competition.count());
        const promiseRes = await Promise.all(promises);
        res.json({
            competitions: promiseRes[0]
        })
    } catch (error) {
        
    }
}