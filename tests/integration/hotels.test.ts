import httpStatus from 'http-status';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { createHotel } from '../factories/hotels-factory';
import app, { init } from '@/app';

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

