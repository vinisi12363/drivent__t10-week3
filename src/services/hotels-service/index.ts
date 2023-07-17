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
  


  const result = await hotelsRepository.findHotels();
  console.log("HOTELS" , result)

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
