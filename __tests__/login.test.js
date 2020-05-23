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

  // the user details
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

  //   test('it should return 400 if username or password is empty');

  //   test('it should return 404 error if email does not exist');

  test('it should login an existing user with the correct email and password and return token', async (done) => {
    const user = await userFactory.createUser(userDetails);

    const loginDetails = {
      email: user.email,
      password: 'dhye%$&6*'
    };

    const res = await request.post('/api/v1/auth/signin').send(loginDetails);

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.message).toBe('Authentication Successful');
    done();
  });

  test('it should throw an authentication error with the wrong email and/or password', async (done) => {
    const loginDetails2 = {
      email: userDetails.email,
      password: '1234'
    };

    const res = await request.post('/api/v1/auth/signin').send(loginDetails2);

    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Authentication Failed: Wrong Password');
    done();
  });
});
