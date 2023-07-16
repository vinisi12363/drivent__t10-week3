import { Event } from '@prisma/client';
import { notFoundError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import { exclude } from '@/utils/prisma-utils';
import enrollmentsService from '../enrollments-service';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';

async function getAllHotelsById(userId:number) {
  //validations 

  const enrollment =  await enrollmentsService.getOneWithAddressByUserId(userId);
  if(!enrollment) throw notFoundError();

  const  ticket = await ticketService.getTicketByUserId(userId);
  if(!ticket) throw notFoundError();

  if(ticket.status !== 'PAID')  throw Error('No payment Effected');
  


  const result = await hotelsRepository.findHotels();

  if (!result || !result[0] ) throw notFoundError();

  return result
}


async function getHotelByUserId(userId:number,hotelId:number){
  const result = await hotelsRepository.findHotelById(hotelId)
  if (!result) throw notFoundError();

  return result

}



const hotelsService = {
  getAllHotelsById,
  getHotelByUserId
};

export default hotelsService;
