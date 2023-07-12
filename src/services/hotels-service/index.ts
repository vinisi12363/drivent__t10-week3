import { Event } from '@prisma/client';
import dayjs from 'dayjs';
import { notFoundError } from '@/errors';
import hotelsRepository from '@/repositories/hotels-repository';
import { exclude } from '@/utils/prisma-utils';

async function getAllHotels() {
  const result = await hotelsRepository.findHotels();
  console.log ("HOTELS",  result)
  if (!result) throw notFoundError();

  return result
}
async function getHotelByid(id:number){
  const result = await hotelsRepository.findHotelById(id)
  if (!result) throw notFoundError();

  return result

}



const hotelsService = {
  getAllHotels,
  getHotelByid
};

export default hotelsService;
