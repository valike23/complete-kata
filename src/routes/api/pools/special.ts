import { Entry } from "../../../Controllers/entries";
import { Pool, poolEntries } from "../../../Controllers/pools";

export async function get(req, res) {
  try {
    const {id}  = req.query;
    
    const resp = await Pool.findOne({
      
      where: {
        
        id
      }
    });
  
  res.json(resp);
    
      
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
}