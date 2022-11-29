interface IcompetitionEntry {
    name: string;
    id: number;
    categoryId: number;
    clubId: number;
    createdAt: Date | string;
    competitionId: number;
    updatedAt: Date | string;
    poolEntry: IpoolEntry
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
            console.log(element);
            if(!setFirst){
                this.currentAthlete = element;
                setFirst = true;
            }
            else{
                this.nextAthlete = element;
                return;
            }
            
          }

    }

}