import { DataTypes, HasMany, Model } from 'sequelize';
import { sequelize } from '../databases/postgres';
import { Promo } from './Promo';

class Item extends Model {
}

Item.init(
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    promos:{
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue:[]
    },
  },
  {
    sequelize,
    modelName: 'item',
  }
);


export { Item };
