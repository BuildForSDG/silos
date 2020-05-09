import supertest from 'supertest';
import http from 'http';
import app from '../src/app';

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
});
