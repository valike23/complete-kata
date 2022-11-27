import { Category } from "../../../Controllers/category";
import { Competition, Icompetition } from "../../../Controllers/competition";


export async function post(req, res) {
   try {
    const category = JSON.parse(req.fields.body);
    const resp = await Category.create(category);
    res.json(resp);
   } catch (error) {
    
   }
       
}

export async function get(req, res){
    try {
    const activeComp: Icompetition = await Competition.findOne({where: {active: true}});
    if(activeComp){
        console.log('active', activeComp);
      const categories = await  Category.findAll({where:{competitionId: activeComp.id}});
      res.json({
        activeComp, categories
      })
    }
    else{
        res.json({
            activeComp: {},
            categories: []
        })
    }
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

