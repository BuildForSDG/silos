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

  test('it should return status of 200 and the array of products', async (done) => {
    const userId = 2;
    // use productsfactory to create users products
    await productsFactory.createForUser(userId, 3);

    const res = await request.get(`/api/v1/users/${userId}/products?page=1`);

    const { products } = res.body.data;

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(products.length).toBeGreaterThan(2);
    done();
  });

  test('it return rows perpage, currentPage and total records', async (done) => {
    const userId = 2;
    // get counnt of all existing users products
    const productsCount = await productsFactory.totalUsersProduct(userId);

    const res = await request.get(`/api/v1/users/${userId}/products?page=1`);

    const { currentPage, rowsPerPage, totalProducts } = res.body.data;

    expect(currentPage).toBe(1);
    expect(rowsPerPage).toBe(30);
    expect(totalProducts).toBe(productsCount);
    done();
  });
});
