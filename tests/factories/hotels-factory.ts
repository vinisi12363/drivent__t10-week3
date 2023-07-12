import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createHotel() {
  const hotelData = {
    name: faker.name.firstName(),
    image: faker.image.image(),
    updatedAt: new Date(),
    createdAt: new Date(),
  };

  const createdHotel = await prisma.hotel.create({
    data: hotelData,
  });

  return createdHotel;
}