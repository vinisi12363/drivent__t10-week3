import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}



async function findHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id:hotelId
    }
   
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById
};

export default hotelsRepository;
