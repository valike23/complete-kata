import { DataTypes, Model, Sequelize } from "sequelize";
import { Entry, Ientry } from "./entries";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });

export interface Ipool {
    poolName?: string;
    entries?: Ientry[];
    status?: number;
    competitionId?: number;
    categoryId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Pool extends Model {
  declare id: number;
  declare poolName: string;
  declare status: number;
  declare competitionId: number;
  declare categoryId: number;

}


Pool.init({
  id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true

  },
  poolName:{
      type: DataTypes.STRING,
      allowNull: false,
      

  },
  categoryId:{
      type: DataTypes.BIGINT,
      

  }, 
   competitionId:{
    type: DataTypes.BIGINT,
    

},
  status:{
      type: DataTypes.SMALLINT,
      defaultValue: 0
      

  }
 
},{sequelize, modelName: 'pool'});
export const poolEntries = sequelize.define('pool_entries', {
  total: DataTypes.DECIMAL,
  ATH: DataTypes.DECIMAL,
  TEC: DataTypes.DECIMAL,
  kata: DataTypes.STRING,
  status:{type: DataTypes.SMALLINT, defaultValue: 0}
}, { timestamps: false });
Pool.belongsToMany(Entry,{through: poolEntries});
Entry.belongsToMany(Pool, {through: poolEntries});
Pool.sync();
poolEntries.sync();


