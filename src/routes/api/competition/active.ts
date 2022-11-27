import { Competition } from "../../../Controllers/competition";

export async function get(req, res){
    try {
      const activeCompetition = await  Competition.findOne({where:{active: true}});
      res.json(activeCompetition);
    } catch (error) {
        
    }
}