import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';
import {
  createEnrollmentWithAddress,
  createTicket,
  createTicketType,
  createTicketTypePersonalized as createCustomTicket,
  createUser,
} from '../factories';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
    await cleanDb();
  });
  

const server = supertest(app);

describe('testes de get hotels', () => {

      it('should respond with status 401 when user token is invalid', async () => {
        const response = await server.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
    
      it('should respond with status 404 when no exist enrollment yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
    });

    it('should respond with status 404 when no exist ticket yet', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when ticket is not payed', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket was remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(true, false);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 when ticket not include hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(true, false);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    it('should respond with status 404 when dont exist hotels', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(false, true);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('should respond with status 200 when token is valid', async () => {
      const token = await generateValidToken()
      const hotel = await createHotel();
      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.body[0]).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString()
      })
      expect(response.status).toBe(200)
    });
    
});

