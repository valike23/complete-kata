import { Category } from "../../../Controllers/category";
import { Competition, Icompetition } from "../../../Controllers/competition";
import { Entry } from "../../../Controllers/entries";
import { Pool } from "../../../Controllers/pools";

export async function get(req, res){
    try {
        let {id} = req.query;
    const activeComp: Icompetition = await Competition.findOne({where: {active: true}});
    if(activeComp){
        console.log('active', activeComp);
      const category = await  Category.findOne({where:{id},  include: [
        {
          model: Pool,
          include: [Entry],
        },
      ],});
      res.json(category)
    }
    else{
        res.json([])
    }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}