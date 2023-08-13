import { sequelize } from '../databases/postgres';
import { Item } from '../models/Item';

const insertItemData = async () => {
  try {
    await sequelize.sync();

    const itemsToAdd = [
      {
        code: 'A',
        name: 'Item A',
        price: 30.0,
        promos: [1],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'B',
        name: 'Item B',
        price: 20.0,
        promos: [2],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'C',
        name: 'Item C',
        price: 50.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        code: 'D',
        name: 'Item D',
        price: 15.0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await Item.bulkCreate(itemsToAdd);

    console.log('Item Data added successfully');
  } catch (error) {
    console.error('Error adding Item data:', error);
  } finally {
    await sequelize.close();
  }
};

insertItemData();
