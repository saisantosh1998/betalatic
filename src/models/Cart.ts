import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../databases/postgres';

class Cart extends Model {
    items: any;
}

Cart.init(
  {
    id:{
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey:true
    },
    items: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: []
    }
  },
  {
    sequelize,
    modelName: 'cart',
  }
);

export { Cart };
