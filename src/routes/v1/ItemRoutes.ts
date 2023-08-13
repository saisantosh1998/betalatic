import express from 'express';
import {ItemController} from '../../controllers/ItemController'


const router = express.Router();


router.get(`/getAll`,ItemController.getAllItems);

export { router as ItemRouter };