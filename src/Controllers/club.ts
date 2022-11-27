import { DataTypes, Model, Sequelize } from "sequelize";
import type { ImodelResp } from "../functions/severShared";
import { Entry } from "./entries";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });
export interface Iclub {
    id?: number;
    clubName?: string;
    flag?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Club extends Model {
    declare id: number;
    declare clubName: string;
    declare flag: string;

}

Club.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    clubName:{
        type: DataTypes.STRING,
        allowNull: false,
        

    },
    flag:{
        type: DataTypes.STRING,
        allowNull: false,
        

    }

   
},{sequelize, modelName: 'club'});
Club.hasMany(Entry);
Club.sync();

export const addClub =async (club: Iclub): Promise<ImodelResp> =>{
    try {
      const body = await  Club.create(club as any);
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

export const addClubs =async (club: Iclub[]): Promise<ImodelResp> =>{
    try {
      const body = await  Club.bulkCreate(club as any);
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
export const deleteClub =async (id: number): Promise<ImodelResp> =>{
    try {
      const body = await  Club.destroy({where: {id}});
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

export const getAllClub = async ():  Promise<ImodelResp> =>{
    try {
       const body = await Club.findAll();
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




