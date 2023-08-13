import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../databases/postgres';
import { Item } from './Item';

class Promo extends Model { }

Promo.init(
  {
    itemCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Item,
        key: "code"
      }
    },
    requiredQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountedPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'promo',
  }
);

export { Promo };
