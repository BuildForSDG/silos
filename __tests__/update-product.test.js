import supertest from 'supertest';
import http from 'http';
import Chance from 'chance';
import path from 'path';
import app from '../src/app';
import userFactory from '../src/factory/userFactory';
import productsFactory from '../src/factory/productsFactory';

const chance = new Chance();

process.env.NODE_ENV = 'test';

describe('User Registration Test', () => {
  let server;
  let request;
  // let product;

  beforeAll(async (done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
    jest.setTimeout(10 * 1000);
  });

  afterAll((done) => {
    server.close(done);
  });

  const url = '/api/v1/products/1';

  test('it should return 401 if the user is not logged in', async (done) => {
    const res = await request.post(url).send({});

    expect(res.statusCode).toEqual(401);
    expect(res.body).toMatchObject({
      status: 'error',
      errors: { message: 'Unauthenticated User' }
    });
    done();
  });

  test('it should reject in valid token and return 403', async (done) => {
    const res = await request.post(url).set('Authorization', 'Bearer djjajdsjadskjdaksdjksajdskjdsk');

    expect(res.statusCode).toEqual(403);
    expect(res.body).toMatchObject({
      status: 'error',
      errors: { message: 'Invalid or Expired Token' }
    });
    done();
  });

  test('it should validate products input and return 400 if fields are missing', async (done) => {
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

    const res = await request.post(url).set('Authorization', `Bearer ${token}`).send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body).toMatchObject({
      status: 'error',
      errors: {
        productName: 'Product Name is required',
        description: 'Description is required',
        availableQuantity: 'Quantity is required',
        categoryId: 'Category is required',
        price: 'Price is required',
        unit: 'Unit is required'
      }
    });
    done();
  });

  const productDetails = {
    productName: 'Parboiled Rice',
    description: chance.word(),
    availableQuantity: 20,
    categoryId: 1,
    price: 5000,
    unit: 5
  };

  test('it should return error and 422 if the user is not a producer', async (done) => {
    const userDetails = {
      firstName: chance.first(),
      lastName: chance.last(),
      email: chance.email(),
      password: 'dhye%$&6*',
      phoneNumber: chance.phone(),
      userType: 'financial_institution',
      businessName: chance.name(),
      bio: chance.sentence(),
      address: chance.address()
    };

    const user = await userFactory.createUser(userDetails);
    const token = await userFactory.generateUserToken(user);

    const productsBeforeRequest = await productsFactory.productsCount();

    const res = await request.post(url).set('Authorization', `Bearer ${token}`).send(productDetails);

    const productsAfterRequest = await productsFactory.productsCount();

    expect(res.statusCode).toEqual(422);
    expect(productsBeforeRequest).toBe(productsAfterRequest);
    expect(res.body).toMatchObject({
      status: 'error',
      errors: { message: 'Only Producers can create products' }
    });
    done();
  });

  test('it should create the product without an image and return the product_id', async (done) => {
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

    const productsBeforeRequest = await productsFactory.productsCount();

    const res = await request.post(url).set('Authorization', `Bearer ${token}`).send(productDetails);

    const productsAfterRequest = await productsFactory.productsCount();

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('success');
    expect(productsBeforeRequest).toBe(productsAfterRequest - 1);
    expect(res.body.data).toHaveProperty('productId', res.body.data.productId);
    done();
  });

  test('it should create the product with an image and return the product_id', async (done) => {
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
    const filePath = await path.join(__dirname, './testImage/how-to-sell-farm-products-in-nigeria.jpg');

    const user = await userFactory.createUser(userDetails);
    const token = await userFactory.generateUserToken(user);

    const productsBeforeRequest = await productsFactory.productsCount();

    const res = await request.post(url).set('Authorization', `Bearer ${token}`).field(productDetails).attach('image', `${filePath}`);

    const productsAfterRequest = await productsFactory.productsCount();

    expect(res.statusCode).toEqual(201);
    expect(res.body.status).toBe('success');
    expect(productsBeforeRequest).toBe(productsAfterRequest - 1);
    expect(res.body.data).toHaveProperty('productId', res.body.data.productId);
    expect(res.body.data.image).not.toBeNull();
    done();
  });
});
