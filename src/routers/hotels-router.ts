import { Router } from 'express';
import { getHotels, getHotelsById } from '../controllers/hotels-controller';
import {authenticateToken} from '@/middlewares'

const hotelsRouter = Router();
hotelsRouter
    .all('/*', authenticateToken)
    .get('/', getHotels)
    .get('/:hotelId', getHotelsById)

export { hotelsRouter };
