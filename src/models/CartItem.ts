import { Sequelize, DataTypes, Model } from 'sequelize';
import { sequelize } from '../databases/postgres';
import { Item } from './Item';
import { Cart } from './Cart';

class CartItem extends Model { }

CartItem.init(
  {
    id: {
      type:DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true
    },
    quantity: DataTypes.INTEGER,
    itemCode: {
      type: DataTypes.STRING,
      references : {
        model : Item,
        key: 'code'
      }
    },
    cartId: {
      type: DataTypes.INTEGER,
      references : {
        model : Cart,
        key: 'id'
      }
    },
  },
  {
    sequelize,
    modelName: 'cartitem',
  }
);


export { CartItem };

