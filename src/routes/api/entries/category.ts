import { Club } from "../../../Controllers/club";
import { Entry } from "../../../Controllers/entries";


export async function get (req, res){
    try {
        const clubs = await Club.findAll();
        if(clubs){
            const entries = await Entry.findAll({where: {categoryId: req.query.id}});
            const myEntries: any[] = [];
            entries.forEach((entry,i)=>{
                let myEntry: any = {};
                    myEntry.id = entry.id;
                    myEntry.name = entry.name;
                    myEntry.categoryId = entry.categoryId;
                clubs.forEach((club)=>{
               
                   
                    if(club.id == entry.clubId){
                        myEntry.clubName = club.clubName;
                        myEntry.flag = club.flag;
                    }
                })
                myEntries.push(myEntry);
            })
            res.json(myEntries);
            
        }
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}