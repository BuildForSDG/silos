import supertest from 'supertest';
import http from 'http';
import app from '../src/app';
// import bcrypt from 'bcrypt';
// import sequelize from '../src/config/sequelize';

process.env.NODE_ENV = 'test';

describe('basic test', () => {
  let server;
  let request;

  beforeAll((done) => {
    server = http.createServer(app);
    server.listen(done);
    request = supertest(server);
  });

  afterAll((done) => {
    server.close(done);
    jest.useFakeTimers();
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

  // test('it should connect to database', async done => {
  //   sequelize
  //     .authenticate()
  //     .then(() => console.log('OK!'))
  //     .catch(err => console.log(err));

  //   const hashed = await bcrypt.hash('password', 10);
  // const res = await request.post('/api/v1/auth/register').send({
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'johndoe@mymail.com',
  //   password: hashed,
  //   phoneNumber: '09876543218',
  //   userType: 'Producer',
  //   businessName: 'My Biz Name',
  //   bio: 'My Biography',
  //   address: 'FT Abuja, Nigeria'
  // });
  // expect(res.body.statusCode).toEqual(201);
  //     done();
  //   });
});
