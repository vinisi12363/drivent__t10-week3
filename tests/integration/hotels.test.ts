import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { buildHotel } from '../factories/hotels-factory';
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
  

const api = supertest(app);

describe('testes de get hotels', () => {

      it('should respond with status 401 when user token is invalid', async () => {
        const response = await api.get('/hotels');
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
    
      it('deve responder com status 404 quando ainda não existe inscrição', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
    });

    it('deve responder com status 404 quando ainda não existe ticket', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);

        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('deve responder com status 402 quando o boleto não for pago', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType();
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

    it('deve responder com status 402 quando o ticket era remoto', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(true, false);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });

   it('deve responder com status 402 quando o bilhete não inclui hotel', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(true, false);
        await createTicket(enrollment.id, ticketType.id, 'RESERVED');

        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
    });
    it('deve responder com status 404 quando não existem hotéis', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createCustomTicket(false, true);
        await createTicket(enrollment.id, ticketType.id, 'PAID');

        const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    it('deve responder com status 200 e com objeto quando o token for válido', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const hotel = await buildHotel();
      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);
  
      expect(response.body[0]).toEqual({
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          createdAt: hotel.createdAt.toISOString(),
          updatedAt: hotel.updatedAt.toISOString()
      })
      expect(response.status).toBe(httpStatus.OK)
    });
    
});

describe('GET /hotels/:hotelId', () => {
  it('Retorna status 401 ao enviar token inválido', async () => {
      const response = await api.get('/hotels/1');

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('Retorna status 404 se inscrição não existir', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Retorna status 404 se ticket não existir', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      await createEnrollmentWithAddress(user);

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Retorna status 404 se hotel não existir', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicket(false, true);

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await api.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('Retorna 402 se ticket não foi pago', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();

      await createTicket(enrollment.id, ticketType.id, 'RESERVED');

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Retorna 402 se o tipo do ticket for remoto', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicket(true, false);

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

  it('Retorna 402 se o tipo do ticket não inclui hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createCustomTicket(true, false);

      await createTicket(enrollment.id, ticketType.id, 'PAID');

      const response = await api.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
  });

});