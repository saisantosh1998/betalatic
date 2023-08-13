import httpStatus from 'http-status';
import { Item } from '../models/Item';
import ApiError from '../utils/ApiError';

class ItemService {
    static async getAllItems(): Promise<Item[]> {
        const items: Item[] = await Item.findAll({});
        if (items.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, "currently no items present in db");
        }
        return items;
    }
}

export { ItemService };
