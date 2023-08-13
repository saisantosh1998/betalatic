import express from 'express';
import {CartController} from '../../controllers/CartController'


const router = express.Router();


router.get(`/:cartId`,CartController.getCart);
router.post(`/`,CartController.addItemToCart);


export { router as CartRouter };