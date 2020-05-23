import supertest from 'supertest';
import http from 'http';
// import path from 'path';
import Chance from 'chance';
import app from '../src/app';
import userFactory from '../src/factory/userFactory';

const chance = new Chance();

process.env.NODE_ENV = 'test';

describe('User Registration Test', () => {
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

  test('it should validate user input and return 400 if fields are missing', async (done) => {
    const newUser = {
      email: chance.email(),
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const usersBeforeRequest = await userFactory.userCount();
    const result = await request.post('/api/v1/auth/register').send(newUser);
    const usersAfterRequest = await userFactory.userCount();

    expect(result.statusCode).toEqual(400);
    expect(result.body.status).toBe('error');
    expect(usersBeforeRequest).toBe(usersAfterRequest);
    expect(result.body.data).toMatchObject({
      message: 'missing field',
      error: [{ firstName: 'firstName is required' }, { lastName: 'lastName is required' }]
    });
    done();
  });

  test('it should validate wrong email format and return 400 ', async (done) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe',
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const usersBeforeRequest = await userFactory.userCount();

    const result = await request.post('/api/v1/auth/register').send(newUser);

    const usersAfterRequest = await userFactory.userCount();

    expect(result.statusCode).toEqual(400);
    expect(result.body.status).toBe('error');
    expect(usersBeforeRequest).toBe(usersAfterRequest);
    expect(result.body.data).toMatchObject({
      message: 'missing field',
      error: [{ email: 'email is required, make sure it is in the pattern yourmailname@domain.com' }]
    });
    done();
  });

  // /*
  // comment out test to prevent upload of image at every test

  // test('it should register a new user to the database with an image', async (done) => {
  //   // Get path to sample image stored in testImage folder
  //   const filePath = await path.join(__dirname, './testImage/testImage.jpg');
  //   const newUser = {
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     email: 'johndoe@mymail.com',
  //     password: 'hashed',
  //     phoneNumber: '0987657',
  //     userType: 'Producer',
  //     businessName: 'My Biz Name',
  //     bio: 'My Biography',
  //     address: 'FT Abuja, Nigeria'
  //   };

  //   const result = await request
  //     .post('/api/v1/auth/register')
  //     .field(newUser)
  //     .attach('photo', `${filePath}`);
  //   expect(result.statusCode).toEqual(201);
  //   expect(result.body.status).toBe('success');
  //   expect(result.body.data).toHaveProperty('userId', result.body.data.userId);
  //   done();
  // });
  // */

  const newUser = {
    firstName: chance.first(),
    lastName: chance.last(),
    email: chance.email(),
    password: chance.word({ length: 10 }),
    phoneNumber: '0987657',
    userType: 'Producer',
    businessName: 'My Biz Name',
    bio: 'My Biography',
    address: 'FT Abuja, Nigeria'
  };

  test('it should register a user to the database without an image', async (done) => {
    const usersBeforeRequest = await userFactory.userCount();

    const result = await request.post('/api/v1/auth/register').send(newUser);

    const usersAfterRequest = await userFactory.userCount();

    expect(result.statusCode).toEqual(201);
    expect(result.body.status).toBe('success');
    expect(usersBeforeRequest).toBe(usersAfterRequest - 1);
    expect(result.body.data).toHaveProperty('userId', result.body.data.userId);
    done();
  });

  test('it should return 403 if a user with that email already exists', async (done) => {
    const usersBeforeRequest = await userFactory.userCount();
    const result = await request.post('/api/v1/auth/register').send(newUser);
    const usersAfterRequest = await userFactory.userCount();

    expect(result.statusCode).toEqual(403);
    expect(result.body.status).toBe('error');
    expect(usersBeforeRequest).toBe(usersAfterRequest);
    expect(result.body.data).toMatchObject({
      message: `User with the email: ${newUser.email} already exist`
    });
    done();
  });
});
