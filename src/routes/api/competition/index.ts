import { Competition, createCompetition, Icompetition, retrieveAllCompetition } from "../../../Controllers/competition";
import { generate } from "short-uuid";
import { rename } from "fs";

export async function post(req, res) {
    try {
        const body: Icompetition = JSON.parse(req.fields.body);
        console.log(body);
        if(req.files){
            let oldPath = req.files.files.path;
            let extension = req.files.files.name;
            let extAry = extension.split('.');
            extension = extAry.pop();

    const newPath = 'static/app/competition/' + generate() + '.' + extension;
    rename(oldPath, newPath, async function (err) {
        if (err) throw err;
        console.log(oldPath);
        let categoryAry = newPath.split('/');
        categoryAry.shift();
        body.image = categoryAry.join('/');
        const resp = await createCompetition(body);
            if(resp.status == 'success'){
             res.json(resp);
            }
            else{
             console.log(resp);
             res.status(503).json(resp)
            }
      });
          
        }
        else {
            const resp = await createCompetition(body);
            if(resp.status == 'success'){
             res.json(resp);
            }
            else{
             console.log(resp);
             res.status(503).json(resp)
            }
        }
     
    } catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
}

export async function get(req, res){
    try {
        const resp = await retrieveAllCompetition();
        res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

export async function put(req, res){
    if(!req.query.id) {
        res.status(400).json({msg: "insert an ID"});
        return;
    }
    try {
      const falsifyAll = await Competition.update({active: false},{where:{active: true}});
      if(falsifyAll){
       const resp = await Competition.update({active: true}, {where: {id: req.query.id}});
       res.json(resp);
      }
    } catch (error) {
        
    }
}

export async function del(req, res) {
    try {
     const resp = await Competition.destroy({where:{id: req.query.id}});
     res.json(resp);
    } catch (error) {
       res.status(503).json(error);
    }
}