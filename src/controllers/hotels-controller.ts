import { Request, Response } from 'express';
import httpStatus from 'http-status';
import hotelsService from '@/services/hotels-service';
import { AuthenticatedRequest } from '../middlewares';

export async function getHotels(_req: AuthenticatedRequest, res: Response) {
  try {
    const event = await hotelsService.getAllHotels()
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}

export async function getHotelsById(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
 
  try {
    const event = await hotelsService.getHotelByid(hotelId)
    return res.status(httpStatus.OK).send(event);
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({});
  }
}
