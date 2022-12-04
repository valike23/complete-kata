interface IcompetitionEntry {
    name: string;
    id: number;
    categoryId: number;
    clubId: number;
    createdAt: Date | string;
    competitionId: number;
    updatedAt: Date | string;
    pool_entries: IpoolEntry
};

interface IpoolEntry {
    ATH?: number;
    TEC?: number;
    entryId?: number;
    kata?: string;
    poolId?: number;
    status?: number;
    total?: number;
    judgeResult?: IpoolJudgeResult[]
}
interface IpoolJudgeResult {
    ATH?: number;
    TEC?: number;
    judgeId?: number;
}

export class competitionController {
    entries: IcompetitionEntry[];
    currentAthlete: IcompetitionEntry;
    nextAthlete: IcompetitionEntry;

    constructor(entries: IcompetitionEntry[]) {
        this.entries = entries;
        let setFirst = false;
        for (let index = 0; index < entries.length; index++) {
            const element = entries[index];
            console.log('element',element);
            if(!setFirst){
                if(element.pool_entries.status == 0){
                    
                    this.currentAthlete = element;
                    setFirst = true;
                }
                
            }
            else{
               if(element.pool_entries.status == 0){
                this.nextAthlete = element;
                return;
               }
                
            }
            
          }


    }

    updateNextEntry(){
       try {
        let isSet = false;
        for (let index = 0; index < this.entries.length; index++) {
         const element = this.entries[index];
         if(element.id == this.currentAthlete.id) {
             console.log('update',this.entries[index])
             this.entries[index].pool_entries.status = 1;
             continue;
         }
         else if(element.id == this.nextAthlete.id){
             this.currentAthlete = this.nextAthlete;
             continue;
         }
         else if(element.pool_entries.status == 0 && !isSet) {
             this.nextAthlete = element;
             isSet = true;
         }
         
        }
       } catch (error) {
        console.error(error);
       }
    }

}