import { NextFunction, Request, Response } from "express";
import { Checkout } from '../services/CartService';
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import { CartPromo } from "../models/CartPromo";
import { Op } from 'sequelize';


class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction) {
    try{
      const {cartId} = req.params;
      if(!cartId)throw new ApiError(httpStatus.BAD_REQUEST, 'provide cartId to add an item');
      const checkout = new Checkout();
      const cartItems = await checkout.getCart(Number(cartId));
      let totalPrice = await checkout.total(cartItems);
      let totalDiscount = await checkout.total_discounts(cartItems);
      const cartPromo = await CartPromo.findOne({
            where: {
                threshold: {
                    [Op.lte]: totalPrice,
                },
            },
            order: [['threshold', 'DESC']], // Order by threshold in descending order
        })
        const threshold = cartPromo?.getDataValue('threshold')
        const discountAmount = cartPromo?.getDataValue('discountAmount');
        if (cartPromo && totalPrice >= threshold) {
            totalPrice -= discountAmount;
            totalDiscount += discountAmount;
        }
      res.status(200).json({cart:{cartItems,totalPrice,totalDiscount}});
    }catch(err){
      if(err){
        next(err);
      }
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR,"something went wrong while fetching cart try again")
    }
  }
  static async addItemToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const item = req.body;
      const { create = false, cartId = null } = req.query;
      if (!create && !cartId) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'provide cartId to add an item')
      }
      const checkout = new Checkout();
      const cart = await checkout.scan(item, String(cartId), Boolean(create));
      res.status(200).json({ cart });
    } catch (err) {
      if (err) {
        next(err);
      }
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "something went wrong while fetching cart try again"))
    }
  }
}

export { CartController };

