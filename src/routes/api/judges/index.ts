import { Judge } from "../../../Controllers/judges";

export async function post(req, res) {
  try {
    const category = JSON.parse(req.fields.body);
    const resp = await Judge.create(category);
    res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(503).json(error);
  }

}

export async function get(req, res) {
  try {
    const judges = await Judge.findAll();
    res.json(judges)


  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function put(req, res) {
  try {
    const judge = JSON.parse(req.fields.body);
    let resp = await Judge.findOne({ where: { judgeName: judge.name, password: judge.password } });
    res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}

export async function patch(req, res) {
  try {
    
    const judge = req.fields.body;
    console.log("this judges", judge);
    let resp = await Judge.update({password: judge},{where:{id: req.query.id}});
    res.json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}