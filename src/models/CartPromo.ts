import { DataTypes, Model } from "sequelize";
import { sequelize } from "../databases/postgres";

class CartPromo extends Model {}

CartPromo.init(
  {
    threshold: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "CartPromo",
  }
);

export { CartPromo };
