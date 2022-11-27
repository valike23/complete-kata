
import { readFile, utils } from "xlsx";
import { Category, Icategory } from "../../../Controllers/category";
import { Club } from "../../../Controllers/club";
import { Competition } from "../../../Controllers/competition";
import { addEntry, Entry, Ientry } from "../../../Controllers/entries";



export  async function post (req, res) {
    try {
        const body = JSON.parse(req.fields.body);
        const activeCompetition = await  Competition.findOne({where:{active: true}});
        if(activeCompetition.id){
            console.log('active here:', activeCompetition);
            body.competitionId = activeCompetition.id;
            const data = await addEntry(body);
            console.log(data, body);
            res.json(data);
        }
       

        
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}
export async function put(req, res){
    try {
        const categoryId = Number(req.query.id);
        const workbook = readFile(req.files.excel.path);
        const activeCompetition = await  Competition.findOne({where:{active: true}});
        const clubs = await Club.findAll();
       if(activeCompetition){
        if(clubs){
            let sheet:any[] = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            sheet.forEach((athlete,i)=>{
              athlete.categoryId = categoryId;
              athlete.competitionId = activeCompetition.id;
              athlete.club = athlete.club.toLowerCase();
              clubs.forEach((club)=>{
                if(club.clubName.toLowerCase() == athlete.club){
                    athlete.clubId = club.id;
                    delete(sheet[i].club);
                }
              });
              
            });

       try {
        console.log('the final sheet', sheet);
        const resp = await  Entry.bulkCreate(sheet);
    
        res.json(resp);
       } catch (error) {
        console.log(error);
        res.status(503).json(error);
       }
        }
       }


     
    } catch (error) {
        console.log(error);
        res.status(503).json(error);
    }
}


export async function get(req, res){
    try {
        const clubs = await Club.findAll();
        if(clubs){
            const activeCompetition = await  Competition.findOne({where:{active: true}});
            if(activeCompetition){
                
               const categories = await Category.findAll({where:{competitionId: activeCompetition.id},
                 include:[{model: Entry}]});
                const entries = [];
                categories.forEach((category: Icategory, i)=>{
                    
                    category.entries.forEach((entry)=>{
                        let myEntry: Ientry = {};
                        myEntry.id = entry.id;
                        clubs.forEach((club)=>{
                            if(club.id == entry.clubId){
                                myEntry.clubName = club.clubName;
                                myEntry.flag = club.flag;
                            }
                        })
                        myEntry.categoryId = entry.categoryId;
                        myEntry.categoryName = category.categoryName;
                        myEntry.clubId = entry.clubId;
                        myEntry.competitionId = entry.competitionId;
                        myEntry.createdAt = entry.createdAt;
                        myEntry.name = entry.name;
                        myEntry.updatedAt = entry.updatedAt;
                        
                        entries.push(myEntry);
                       
                    })
                });
                console.log('entries', entries);
                res.json(entries);
            }

        }
       
      
    } catch (error) {
        console.log(error);
        res.json({});
    }
}