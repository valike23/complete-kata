import { Judge } from "../../../Controllers/judges";

export async function post(req, res) {
    try {
     const category = JSON.parse(req.fields.body);
     console.log('category', category);
     const resp = await Judge.create(category);
     res.json(resp);
    } catch (error) {
     console.log(error);
     res.status(503).json(error);
    }
        
 }

 export async function get(req, res){
    try {
      const judges = await  Judge.findAll();
      res.json(judges)
    
   
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}