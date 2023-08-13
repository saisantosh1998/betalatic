import { sequelize } from '../databases/postgres';
import { Promo } from '../models/Promo';

const insertPromoData = async () => {
  try {
    await sequelize.sync();

    const promosToAdd = [
      {
        id: "1",
        itemCode: 'A',
        requiredQuantity: 3,
        discountedPrice: 75.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        itemCode: 'B',
        requiredQuantity: 2,
        discountedPrice: 35.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await Promo.bulkCreate(promosToAdd);

    console.log('Promo Data added successfully');
  } catch (error) {
    console.error('Error adding Promo data:', error);
  } finally {
    await sequelize.close();
  }
};

insertPromoData();
