import { Entry, Ientry } from "../../../Controllers/entries";


// update an entry record the club and name 
export async function put(req, res){
try {
    const entry : Ientry= JSON.parse(req.fields.body);
    console.log(entry);
    const data = await Entry.update(entry,{where: {id: entry.id}});
    res.json(data);
} catch (error) {
    console.log(error);
    res.status(503).json(error);
}
}