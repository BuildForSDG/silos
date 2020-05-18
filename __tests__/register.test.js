import supertest from 'supertest';
import http from 'http';
import path from 'path';
import app from '../src/app';

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

  beforeEach((done) => {
    /**
     * Suppress console warning for each test
     * Reference: https://stackoverflow.com/questions/44467657/jest-better-way-to-disable-console-inside-unit-tests
     */
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    done();
  });

  afterAll((done) => {
    server.close(done);
  });

  test('it should validate user input and return 400 if fields are missing', async (done) => {
    const newUser = {
      email: 'johndoe2@mymail.com',
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const result = await request.post('/api/v1/auth/register').send(newUser);

    expect(result.statusCode).toEqual(400);
    expect(result.body.status).toBe('error');
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

    const result = await request.post('/api/v1/auth/register').send(newUser);

    expect(result.statusCode).toEqual(400);
    expect(result.body.status).toBe('error');
    expect(result.body.data).toMatchObject({
      message: 'missing field',
      error: [{ email: 'email is required, make sure it is in the pattern yourmailname@domain.com' }]
    });
    done();
  });

  test('it should register a new user to the database with an image', async (done) => {
    // Get path to sample image stored in testImage folder
    const filePath = await path.join(__dirname, './testImage/testImage.jpg');
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@mymail.com',
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const result = await request
      .post('/api/v1/auth/register')
      .field(newUser)
      .attach('photo', `${filePath}`); /** attach used to upload sample picture from testImage folder */
    expect(result.statusCode).toEqual(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data).toHaveProperty('userId', result.body.data.userId);
    done();
  });

  test('it should register a user to the database without an image', async (done) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe2@mymail.com',
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const result = await request.post('/api/v1/auth/register').send(newUser);

    expect(result.statusCode).toEqual(201);
    expect(result.body.status).toBe('success');
    expect(result.body.data).toHaveProperty('userId', result.body.data.userId);
    done();
  });

  test('it should return 403 if a user with that email already exists', async (done) => {
    const newUser = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe2@mymail.com',
      password: 'hashed',
      phoneNumber: '0987657',
      userType: 'Producer',
      businessName: 'My Biz Name',
      bio: 'My Biography',
      address: 'FT Abuja, Nigeria'
    };

    const result = await request.post('/api/v1/auth/register').send(newUser);

    expect(result.statusCode).toEqual(403);
    expect(result.body.status).toBe('error');

    done();
  });

  test('it should login an existing user with the correct email and password', async (done) => {
    const loginDetails = {
      email: 'johndoe2@mymail.com',
      password: 'hashed'
    };

    const login = await request.post('/api/v1/auth/signin').send(loginDetails);

    expect(login.statusCode).toEqual(200);
    expect(login.body.status).toBe('success');

    done();
  });

  test('it should throw an authentication error with the wrong email and/or password', async (done) => {
    const loginDetails2 = {
      email: 'johndoe@mymail.com',
      password: '1234'
    };

    const login2 = await request.post('/api/v1/auth/signin').send(loginDetails2);

    expect(login2.statusCode).toEqual(401);
    expect(login2.body.status).toBe('error');

    done();
  });
});
