import { DataTypes, Model, Sequelize } from "sequelize";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });

  
export class Kata extends Model {
    declare id: number;
    declare name: string;

}


Kata.init({
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true

    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        

    }
   
},{sequelize, modelName: 'kata'});

Kata.sync();