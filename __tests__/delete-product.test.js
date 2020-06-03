import supertest from 'supertest';
import http from 'http';
import Chance from 'chance';
import app from '../src/app';
import userFactory from '../src/factory/userFactory';
import productsFactory from '../src/factory/productsFactory';

process.env.NODE_ENV = 'test';
const chance = new Chance();

describe('Delete product', () => {
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

  test('it should return status of 200', async (done) => {
    // use productsfactory to create products
    const product = await productsFactory.create();
    const testProductId = product.id;

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

    const user = await userFactory.createUser(userDetails);
    const token = await userFactory.generateUserToken(user);

    const res = await request.delete(`/api/v1/products/${testProductId}/delete`).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.message).toBe('Product Deleted Successfully');
    done();
  });
});
