import supertest from 'supertest';
import http from 'http';
import Chance from 'chance';
import app from '../src/app';
import userFactory from '../src/factory/userFactory';

const chance = new Chance();

process.env.NODE_ENV = 'test';

describe('User Registration Test', () => {
  let server;
  let request;

  beforeAll(async (done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
    jest.setTimeout(10 * 1000);
  });

  afterAll((done) => {
    server.close(done);
  });

  const url = '/api/v1/products/create';

  test('it should view all products', async (done) => {
    const userDetails = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: 'dhye%$&6*',
      phoneNumber: chance.phone(),
      userType: 'producer',
      businessName: chance.name(),
      bio: chance.sentence(),
      address: chance.address()
    };

    const productDetails = {
      productName: 'Parboiled Rice',
      description: chance.word(),
      availableQuantity: 20,
      categoryId: 1,
      price: 5000,
      unit: 5
    };

    const user = await userFactory.createUser(userDetails);
    const token = await userFactory.generateUserToken(user);

    const res = await request
      .post(url)
      .set('Authorization', `Bearer ${token}`)
      .send(productDetails);

    const result = await request.get('/api/v1/products?page=1&limit=50');

    expect(result.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');

    // expect(res.statusCode).toEqual(201);
    // expect(res.body.status).toBe('success');
    // expect(productsBeforeRequest).toBe(productsAfterRequest - 1);
    // expect(res.body.data).toHaveProperty('productId', res.body.data.productId);
    done();
  });
});
