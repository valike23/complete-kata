import { Entry } from "../../../Controllers/entries";
import { Pool } from "../../../Controllers/pools";

export async function get(req, res) {
  try {
    const {categoryId, round}  = req.query;
    let resp = await  Pool.findAll({
          where: {
              categoryId,
              round
          }, include: [Entry]
      });
      res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }
}