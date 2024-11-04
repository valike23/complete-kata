import { Ientry } from "./entries";
import { IpoolEntries } from "./pools";



export interface Ibout  {
    id: number;
    redEntryId: number;
    redEntry: Ientry;
    blueEntryId: number;
    blueEntry: Ientry;
    parentBoutId: number;
    parentBout: Ibout;
    leftEntryScoresId: number;
    leftEntryScores: IpoolEntries;
    rightEntryScoresId: number;
    rightEntryScores: IpoolEntries;
}

export class Bout {
    declare id: number;
    declare redEntry: number
}