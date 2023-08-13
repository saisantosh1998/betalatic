import { NextFunction, Request, Response } from "express";
import { ItemService } from '../services/ItemService';
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { Item } from "../models/Item";

class ItemController {
    static async getAllItems(req: Request, res: Response, next: NextFunction) {
        try {
            const items: Item[] = await ItemService.getAllItems();
            res.status(httpStatus.OK).json({ items });
        } catch (err) {
            next(err);
        }
    }
}

export { ItemController };

