import { Category } from "../../../Controllers/category";
import { Competition, Icompetition } from "../../../Controllers/competition";

export async function get(req, res){
    try {
        let {id} = req.query;
    const activeComp: Icompetition = await Competition.findOne({where: {active: true}});
    if(activeComp){
        console.log('active', activeComp);
      const categories = await  Category.findOne({where:{id}, include:['pools']});
      res.json(categories)
    }
    else{
        res.json([])
    }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}