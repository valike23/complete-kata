

import { DataTypes, Model, Sequelize } from "sequelize";
import { Category } from "./category";
import { Entry } from "./entries";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });

export interface Icompetition{
    id?: number;
    competitionName?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
    active?: boolean
}
export class Competition extends Model {
    declare id: number;
    declare competitionName: string;
    declare image: string;
    declare active: boolean;
}

Competition.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    competitionName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    image:{
        type: DataTypes.STRING,
        allowNull: true,

    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
 
},{sequelize, modelName: 'competition'});


Competition.hasMany(Category);
Competition.hasMany(Entry);
Competition.sync();
export const createCompetition = async (competition: Icompetition)=>{
    try {
     const resp = await Competition.create(competition as any);
     return {
        status: 'success',
        body: resp
     }
    } catch (error) {
        console.error(error);
        return {
            status: 'failed',
            body: error
        }
    }
}

export const retrieveAllCompetition  =async (): Promise<Icompetition[]>=> {
    try {
       const competitions =await  Competition.findAll();
       return competitions;
    } catch (error) {
        console.log(error);
        return [];
    }
}

