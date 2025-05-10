import request from 'supertest';
import app from '../app-test';

export const createTestUserAndGetCookies = async () => {
  const user = {
    username: "John",
    email: "john@test.com",
    password: "john123"
  };

  await request(app).post('/api/v1/auth/signup').send(user);
  const res = await request(app).post('/api/v1/auth/signin').send({
    email: user.email,
    password: user.password
  });

  const rawCookies = res.headers['set-cookie'];
  return Array.isArray(rawCookies) ? rawCookies : rawCookies ? [rawCookies] : [];
};