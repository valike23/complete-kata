
import { readFile, utils } from "xlsx";
import { Kata } from "../../Controllers/kata";



export  async function post (req, res) {
    try {
        const kata = req.fields.kata;
        console.log("my kata here", kata);
          const resp = await Kata.create({name: kata});
          console.log(resp);
            res.json(resp);
        
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function put(req, res){
    try {
        const workbook = readFile(req.files.excel.path);
      
            let sheet:any[] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
           
        console.log('the final sheet', sheet);
        const resp = await  Kata.bulkCreate(sheet);
    
        res.json(resp);
   
     
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}


export async function get(req, res){
    try {
             const katas = await Kata.findAll();
                console.log('katas', katas);
                res.json(katas);
      
    } catch (error) {
        console.log(error);
        res.json({});
    }
}

export async function del(req, res){
    try {
      let resp = await  Kata.destroy({where:{id: req.query.id}});
      res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}