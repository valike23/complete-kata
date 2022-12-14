import { Competition } from "../../../Controllers/competition";
import { generate } from "short-uuid";
import { rename } from "fs";
import { addClub, Club, getAllClub, Iclub } from "../../../Controllers/club";

export async function post(req, res) {
    try {
        const body: Iclub = JSON.parse(req.fields.body);
        console.log(body);
        if(req.files){
            let oldPath = req.files.files.path;
            let extension = req.files.files.name;
            let extAry = extension.split('.');
            extension = extAry.pop();

    const newPath = 'static/app/club/' + generate() + '.' + extension;
    rename(oldPath, newPath, async function (err) {
        if (err) throw err;
        console.log(oldPath);
        let categoryAry = newPath.split('/');
        categoryAry.shift();
        body.flag = categoryAry.join('/');
        const resp = await addClub(body);
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
            const resp = await addClub(body);
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
        if(req.query.id){
            const resp = await Club.findOne({where:{id: req.query.id}});
            res.json(resp);
        }
        else{
            const resp = await getAllClub();
        res.json(resp);
        }
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
     const resp = await Club.destroy({where:{id: req.query.id}});
     res.json(resp);
    } catch (error) {
       res.status(503).json(error);
    }
}

export async function patch(req, res){
    try {
        const body = JSON.parse(req.fields.body);
        const resp = await Club.update(body, {where:{id: req.query.id}});
        console.log(resp);
        res.json(resp);
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}