
import { DataTypes, Model, Sequelize } from "sequelize";
import { Entry, Ientry } from "./entries";
import { Pool } from "./pools";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });
export interface Icategory {
    id?: number;
    categoryName?: string;
    gender?: string;
    competitionId?: number;
    isDrafted?: boolean;
    entries?: Ientry[];
    createdAt?: Date;
    updatedAt?: Date;
}
  export class Category extends Model {
    declare id: number;
    declare categoryName: string;
    declare isDrafted: boolean;
    declare competitionId: number;
    declare gender: string
  };

  
Category.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    categoryName:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true

    },
    competitionId:{
        type: DataTypes.BIGINT,
    },
    isDrafted:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
        

    },
    gender:{
        type: DataTypes.STRING,
        defaultValue: "none"
    }
   
},{sequelize, modelName: 'category'});

Category.hasMany(Entry);
Category.hasMany(Pool);

Category.sync();


export const createCategory = async (category: any)=>{
    try {
       const resp = await Category.create(category);
       return {status: 'success', body: resp}
    } catch (error) {
        return {status: 'failed', body: error}
    }
}

