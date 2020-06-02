import supertest from 'supertest';
import http from 'http';
import app from '../src/app';
import productsFactory from '../src/factory/productsFactory';

process.env.NODE_ENV = 'test';

describe('get products', () => {
  let server;
  let request;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
    jest.setTimeout(10 * 1000);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('it should return status of 200 and one product', async (done) => {
    // use productsfactory to create products
    await productsFactory.createMany(2);

    const res = await request.get('/api/v1/products/1');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data).toHaveProperty('id', 1);
    done();
  });

  test('it should return status of 204 if product does not exist', async (done) => {
    // use productsfactory to create products
    await productsFactory.createMany(2);

    const res = await request.get('/api/v1/products/1225');

    expect(res.status).toBe(204);
    // expect(res.body.status).toBe('success');
    // expect(res.body.data).toHaveProperty('id', 1);
    done();
  });
});
