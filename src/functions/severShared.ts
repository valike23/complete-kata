import type { Ipool } from "../Controllers/pools";

export interface ImodelResp {
    status: string;
    body: any
}
function handleTwoPools(pools){
    // count if pool content in any of the pools is less than or equal to 4
    // 4 then we move to the final both where the lowest is eradicated and 
    //the top 3 is drafted into the final groups, final medal bouth, 
    //1st Bronze medal Bouth and Second Medal Bouth




    //if it is more than 4 then we take the top 4 athletes from 1 pool and match it w


    
}
function handleOtherPools(pools){

}
export function progressionAlgorithm(pools: Ipool[]){
    //check if we have only 2 pools
    if(pools.length == 2) return handleTwoPools(pools)
    return handleOtherPools;

}