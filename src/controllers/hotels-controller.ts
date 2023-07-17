import { Request, Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '../middlewares';

 async function getHotels(req: AuthenticatedRequest, res: Response) {
    console.log("req USER ID ", req.userId)
    try {
      const event = await hotelsService.getAllHotelsById(req.userId)
      return res.status(httpStatus.OK).send(event);
    } catch (error) {
      console.log('no controller', error.message)
      if (error.name === 'NotFoundError') {
          return res.sendStatus(httpStatus.NOT_FOUND);
        } else if (error.message === 'Payment_Required') {
          return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
      } else {
          res.sendStatus(httpStatus.BAD_REQUEST);
      }
    }
  
 }


async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
  console.log(hotelId)
  if (!hotelId) return res.sendStatus(httpStatus.BAD_REQUEST);
  const numberIdHotel = Number(hotelId);
  if (isNaN(numberIdHotel)) return res.sendStatus(httpStatus.BAD_REQUEST);
   
  try {
    const event = await hotelsService.getHotelByUserId(req.userId, hotelId)
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    console.log('ERROR NO CONTROLLER', error)
    if (error.name === 'NotFoundError') {
        return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.message === 'Payment_Required') {
        return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    } else {
        res.sendStatus(httpStatus.BAD_REQUEST);
    }
  }
} 



export {
  getHotels,
  getHotelsById,
}
