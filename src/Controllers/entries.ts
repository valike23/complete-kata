import { DataTypes, Model, Sequelize } from "sequelize";
import type { ImodelResp } from "../functions/severShared";
import { Category } from "./category";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });
export interface Ientry {
    id?: number;
    name?: string;
    categoryName?: string;
    clubName?: string;
    flag?: string;
    categoryId?: string;
    clubId?: number;
    competitionId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Entry extends Model {
    declare id: number;
    declare name: string;
    declare categoryId: number;
    declare clubId: number;
    declare competitionId: number;

}

Entry.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        

    },
    categoryId:{
        type: DataTypes.BIGINT,
        

    }, 
     competitionId:{
      type: DataTypes.BIGINT,
      

  },
    clubId:{
        type: DataTypes.BIGINT,
        

    }
   
},{sequelize, modelName: 'entry'});
Entry.sync();

export const addEntry =async (entry: Ientry): Promise<ImodelResp> =>{
    try {
      const body = await  Entry.create(entry as any);
      const modelResp : ImodelResp= {
        status: "success",
        body

      };
      return modelResp;
    } catch (error) {
        const modelResp : ImodelResp= {
            status: "failed",
            body: error
    
          };
          return modelResp;
    }
}

export const addEntries =async (entry: Ientry[]): Promise<ImodelResp> =>{
    try {
      const body = await  Entry.bulkCreate(entry as any);
      const modelResp : ImodelResp= {
        status: "success",
        body

      };
      return modelResp;
    } catch (error) {
        const modelResp : ImodelResp= {
            status: "failed",
            body: error
    
          };
          return modelResp;
    }
}
export const deleteEntry =async (id: number): Promise<ImodelResp> =>{
    try {
      const body = await  Entry.destroy({where: {id}});
      const modelResp : ImodelResp= {
        status: "success",
        body

      };
      return modelResp;
    } catch (error) {
        const modelResp : ImodelResp= {
            status: "failed",
            body: error
    
          };
          return modelResp;
    }
}




