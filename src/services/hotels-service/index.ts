import { Event } from '@prisma/client';
import { notFoundError, requestError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import { exclude } from '@/utils/prisma-utils';
import enrollmentsService from '../enrollments-service';
import ticketsRepository from '@/repositories/tickets-repository';
import ticketService from '@/services/tickets-service';

async function getAllHotelsById(userId:number) {
  //validations 
  

  const enrollment =  await enrollmentsService.getOneWithAddressByUserId(userId);
  
  if(!enrollment || enrollment === null) throw notFoundError();

  const  ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id)
  console.log('TICKET', ticket)
  if(!ticket || ticket === null){
    
    throw notFoundError();
  } 
  if(ticket.status === 'RESERVED') {
    console.log("entrou no ticket reserved error ")
     throw Error('Payment_Required')
    
    }
  
     const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
     console.log("TICKETYPE", ticketsTypes)
    if (ticketsTypes.TicketType.isRemote === true) {
        throw Error('Payment_Required');
    }
    if(!ticketsTypes.TicketType.includesHotel) throw Error('Payment_Required');
    
    
  console.log("ticketTypes", ticketsTypes)
  const hotel = await hotelsRepository.findHotels();

  console.log("HOTELS" , hotel)

  if ( !hotel[0]|| !hotel  || hotel.length === 0 ) throw notFoundError();

  return hotel
}


async function getHotelByUserId(userId:number,hotelId:number){
  if (!hotelId) throw Error('BadRequest');

  const enrollment = await enrollmentsService.getOneWithAddressByUserId(userId);
  if (!enrollment) throw  notFoundError();


  const userTicket = await ticketService.getTicketByUserId(userId);
  if (!userTicket) throw notFoundError();

  if (userTicket.status === 'RESERVED') throw requestError(402,'Payment_Required');;

  const ticketsTypes = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (ticketsTypes.TicketType.isRemote) {
    throw requestError(402,'Payment_Required');
  }

  if(!ticketsTypes.TicketType.includesHotel) throw Error('Payment_Required');
 

  const result = await hotelsRepository.findHotelById(hotelId)
  if (!result) throw Error('NotFound');
  console.log ('HOTELS', result)
  return result;

}



const hotelsService = {
  getAllHotelsById,
  getHotelByUserId
};

export default hotelsService;
