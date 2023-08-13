import httpStatus from 'http-status';
import { Item } from '../models/Item';
import ApiError from '../utils/ApiError';

class ItemService {
    static async getAllItems(): Promise<Item[]> {
        try {
            const items:Item[] = await Item.findAll({});
            if(items.length===0){
                throw new ApiError(httpStatus.NOT_FOUND,"currently no items present in db");
            }
            return items;
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,'Something went wrong while fetching items from db');
        }
    }
}

export { ItemService };
