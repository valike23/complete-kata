import { Category } from "../../../Controllers/category";
import { Competition, Icompetition } from "../../../Controllers/competition";


export async function post(req, res) {
   try {
    const category = JSON.parse(req.fields.body);
    console.log('category', category);
    const resp = await Category.create(category);
    res.json(resp);
   } catch (error) {
    console.log(error);
    res.status(503).json(error);
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

export async function del(req, res) {
    try {
     const resp = await Category.destroy({where:{id: req.query.id}});
     res.json(resp);
    } catch (error) {
       res.status(503).json(error);
    }
}

