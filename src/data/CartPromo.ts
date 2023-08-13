import { sequelize } from '../databases/postgres';
import { CartPromo } from '../models/CartPromo';

const insertCartPromoData = async () => {
    try {
        await sequelize.sync();
        const cartPromosToAdd = [
            {
                threshold: 150,
                discountAmount: 20,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        await CartPromo.bulkCreate(cartPromosToAdd);

        console.log('CartPromo Data added successfully');
    } catch (error) {
        console.error('Error adding CartPromo data:', error);
    } finally {
        await sequelize.close();
    }
};

insertCartPromoData();
