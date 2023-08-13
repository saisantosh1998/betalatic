// services/CartService.ts
import { Item } from '../models/Item';
import { CartItem } from '../models/CartItem';
import { Cart } from '../models/Cart';
import { Promo } from '../models/Promo';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

class CartService {
    constructor() {
    }
    async scan(body: any, cartId: string, create: boolean): Promise<Cart> {
        const { itemCode = '', quantity = '' } = body;
        const validItem = await Item.findByPk(itemCode);
        if (!validItem) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Please select a valid item');
        }
        if (create) {
            const cart = await Cart.create({ items: [] });
            const cartItem = await CartItem.create({ itemCode, quantity, cartId: cart.dataValues.id });
            const newItem = {
                itemCode: cartItem.dataValues.itemCode,
                quantity: cartItem.dataValues.quantity
            }
            if (newItem.quantity > 0) {
                await cart.update({
                    items: [...cart.items, newItem],
                });
            }
            return cart;
        } else {
            const cart = await Cart.findByPk(cartId);
            if (cart) {
                let cartItem = await CartItem.findOne({
                    where: {
                        itemCode, cartId
                    }
                })
                if (!cartItem) {
                    cartItem = await CartItem.create({ itemCode, quantity, cartId });
                } else {
                    await cartItem.update({ quantity })
                }
                const newItem = {
                    itemCode: cartItem.dataValues.itemCode,
                    quantity: cartItem.dataValues.quantity
                }
                if (newItem.quantity <= 0) {
                    const newItems = cart.dataValues.items.filter((item: any) => item.itemCode != newItem.itemCode);
                    await cart.update({
                        items: [...newItems],
                    });
                    return cart;
                } else {
                    const newItems = [...cart.items];
                    const itemExists = newItems.findIndex(item => item.itemCode === itemCode);
                    if (itemExists !== -1) {
                        newItems[itemExists] = newItem;
                    } else {
                        newItems.push(newItem);
                    }
                    await cart.update({
                        items: [...newItems],
                    });
                    return cart;
                }
            } else {
                throw new ApiError(httpStatus.NOT_FOUND, `cart with ${cartId} is not found`);
            }
        }
    }
    async getCart(cartId: number) {
        const cart: any = await Cart.findByPk(cartId);
        if (!cart) {
            throw new ApiError(httpStatus.NOT_FOUND, `cart with ${cartId} is not found`)
        }
        const cartItems = cart.getDataValue('items');
        let processedCartItems: any[] = [];

        for (const cartItem of cartItems) {
            const itemCode = cartItem.itemCode;
            const item = await Item.findByPk(itemCode);
            let itemPrice = item?.getDataValue('price') * cartItem.quantity;
            let itemDiscount = 0;
            const promos = item?.getDataValue('promos');
            let promoDataArray = await Promise.all(promos.map((promo: any) => Promo.findByPk(promo)));
            promoDataArray = promoDataArray.map(promoData => promoData.dataValues)
            for (let i = 0; i < promos.length; i++) {
                const promoData = promoDataArray[i];
                if (cartItem.quantity >= promoData.requiredQuantity) {
                    const promoCount = Math.floor(cartItem.quantity / promoData?.requiredQuantity);
                    const prevPrice = itemPrice;
                    itemPrice = promoCount * promoData?.discountedPrice + (cartItem.quantity % promoData?.requiredQuantity) * item?.getDataValue('price');
                    itemDiscount = prevPrice - itemPrice;
                }
            }
            processedCartItems = [...processedCartItems, { itemCode: cartItem.itemCode, quantity: cartItem.quantity, itemPrice, itemDiscount }];
        }

        return processedCartItems;
    }
    async total(cartItems: any) {
        let totalPrice = 0;
        cartItems.forEach((item: any) => totalPrice += item.itemPrice)
        return totalPrice;
    }
    async total_discounts(cartItems: any) {
        let totalDiscount = 0;
        cartItems.forEach((item: any) => totalDiscount += item.itemDiscount);
        return totalDiscount;
    }
}

export { CartService as Checkout };
