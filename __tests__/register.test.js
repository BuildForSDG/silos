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

  test('it should return 403 is a user with that email already exists', async (done) => {
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
});
