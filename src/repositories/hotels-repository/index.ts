import { prisma } from '@/config';

async function findHotels() {
  return prisma.hotel.findMany();
}



async function findHotelById(id: number) {
  return prisma.hotel.findUnique({
    where: { id },
    include: { Rooms: true }
  });
}

const hotelsRepository = {
  findHotels,
  findHotelById
};

export default hotelsRepository;
