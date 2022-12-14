import { DataTypes, Model, Sequelize } from "sequelize";
import { Entry, Ientry } from "./entries";
import { Judge } from "./judges";

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '../../sqlite/test.db'
  });
export enum EpoolStatus {
  CREATED = 0,
  ACTIVE = 1,
  COMPLETED = 2,
  CLOSED = 3,
  PAUSED = 4

}
export interface Ipool {
    poolName?: string;
    entries?: Ientry[];
    status?: EpoolStatus;
    competitionId?: number;
    categoryId?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IpoolEntries {
  id?: number;
  total?: number;
  ATH?: number;
  TEC?: number;
  kata?: string;
  status?: number;
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
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true

},
  total: DataTypes.DECIMAL,
  ATH: DataTypes.DECIMAL,
  TEC: DataTypes.DECIMAL,
  kata: DataTypes.STRING,
  status:{type: DataTypes.SMALLINT, defaultValue: 0}
}, { timestamps: false });


export const poolEntriesJudge = sequelize.define('pool_entries_judge', {

  ATH: DataTypes.DECIMAL,
  TEC: DataTypes.DECIMAL,
  status:{type: DataTypes.SMALLINT, defaultValue: 0}
}, { timestamps: false });
Pool.belongsToMany(Entry,{through: poolEntries});
Entry.belongsToMany(Pool, {through: poolEntries});
poolEntries.belongsToMany(Judge,{through: poolEntriesJudge});
Judge.belongsToMany(poolEntries, {through: poolEntriesJudge});
Pool.sync();
poolEntries.sync();
poolEntriesJudge.sync();


