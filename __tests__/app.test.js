import supertest from 'supertest';
import http from 'http';
import path from 'path';
import app from '../src/app';

process.env.NODE_ENV = 'test';

describe('basic test', () => {
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
    const res = await request.get('/api/v1');

    expect(res.status).toBe(200);
    done();
  });

  test('it returns project name', async (done) => {
    const res = await request.get('/api/v1');

    expect(res.body.status).toBe('success');
    expect(res.body.data.message).toBe('BuildForSdg Silos Api');
    done();
  });

  test('it should register a new user to the database', async (done) => {
    // Get path to sample image stored in testImage folder
    const filePath = await path.join(__dirname, './testImage/testImage.jpg');
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

    const result = await request
      .post('/api/v1/auth/register')
      .field(newUser)
      .attach('photo', `${filePath}`); /** attach used to upload sample picture from testImage folder */
    expect(result.statusCode).toEqual(201);
    done();
    expect(result.body.status).toBe('success');
    expect(result.body.data).toHaveProperty('userId', result.data.userId);
  });
});
