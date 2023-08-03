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
    
    const {password, name} = req.fields;
    console.log("this judges", name);
    let resp: any = {};
    if(password) {resp = await Judge.update({password},{where:{id: req.query.id}});
    res.json(resp);
  }
    else if(name) {resp = await Judge.update({judgeName: name},{where:{id: req.query.id}});
    console.log("call namw", resp);
    res.json(resp);
  }
  else{
    res.status(400).json({msg:"bad request"})
  }
   
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}