import { Event } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import { exclude } from '@/utils/prisma-utils';
import enrollmentsService from '../enrollments-service';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';

async function getAllHotelsById(userId:number) {
  //validations 
  console.log('iniciando checagens')

  const enrollment =  await enrollmentsService.getOneWithAddressByUserId(userId);
  console.log('enrollments', enrollment)
  if(!enrollment || enrollment === null) throw notFoundError();

  const  ticket = await ticketsRepository.findTickeyById(userId)
  console.log('ticket', ticket)
  if(!ticket || ticket === null){
    
    throw notFoundError();
  } 
  if(ticket.status === 'RESERVED') {
    console.log("entrou no ticket reserved error ")
     throw requestError(402,'No payment Effected');}
  
     const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (ticketsTypes.TicketType.isRemote === true || ticketsTypes.TicketType.includesHotel === false) {
        throw Error('PaymentRequired');
    }

  const result = await hotelsRepository.findHotels();
  console.log("HOTELS" , result)

  if (!result || !result[0] ) throw notFoundError();

  return result
}


async function getHotelByUserId(userId:number,hotelId:number){
  if (!hotelId) throw Error('BadRequest');

  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!enrollment) throw  notFoundError();


  const userTicket = await ticketService.getTicketByUserId(userId);
  if (!userTicket) throw notFoundError();

  if (userTicket.status !== 'PAID') throw requestError(402,'No payment Effected');;

  const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (ticketsTypes.TicketType.isRemote === true || ticketsTypes.TicketType.includesHotel === false) {
    throw requestError(402,'No payment Effected');
  }

  const hotels = await hotelsRepository.findHotelById(enrollment.id)
  if (!hotels) throw Error('NotFound');

  return hotels;

}



const hotelsService = {
  getAllHotelsById,
  getHotelByUserId
};

export default hotelsService;
