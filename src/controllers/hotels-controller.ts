import { Request, Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '../middlewares';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
 
  try {
    const event = await hotelsService.getAllHotelsById(req.userId)
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
   
    if (error.message === 'NotFound') {
        return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.message === 'PaymentRequired') {
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
 
  try {
    const event = await hotelsService.getHotelByUserId(req.userId, hotelId)
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    if (error.message === 'NotFound') {
        return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.message === 'PaymentRequired') {
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
}
