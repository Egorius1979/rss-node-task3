import { server } from '../index';
import request from 'supertest';
import { IUser } from '../crud/utils/user';

describe('First test', () => {
  it('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const res1 = await request(server).get('/api/users');

    expect(res1.statusCode).toBe(200);
    expect(res1.body).toEqual([]);
  });

  let userId: string;

  it('A new object is created by a POST api/users request (a response containing newly created record is expected)', async () => {
    const res2 = await request(server)
      .post('/api/users')
      .send({
        username: 'Vasya',
        age: 43,
        hobbies: ['sex', 'drugs', 'rock-n-roll'],
      });

    userId = res2.body.id;

    expect(res2.statusCode).toBe(201);
    expect(res2.body.username).toBe('Vasya');
    expect(res2.body.age).toBe(43);
    expect(res2.body.hobbies).toEqual(['sex', 'drugs', 'rock-n-roll']);
  });

  it('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const res3 = await request(server).get(`/api/users/${userId}`);

    expect(res3.statusCode).toBe(200);
    expect(res3.body.username).toBe('Vasya');
    expect(res3.body.age).toBe(43);
    expect(res3.body.hobbies).toEqual(['sex', 'drugs', 'rock-n-roll']);
  });

  it('We try to update the created record with a PUT api/users/{userId}request (a response is expected containing an updated object with the same id)', async () => {
    const res4 = await request(server)
      .put(`/api/users/${userId}`)
      .send({
        age: 65,
        hobbies: ['pills', 'TV shows'],
      });

    expect(res4.statusCode).toBe(200);
    expect(res4.body.username).toBe('Vasya');
    expect(res4.body.age).toBe(65);
    expect(res4.body.hobbies).toEqual(['pills', 'TV shows']);
  });

  it('With a DELETE api/users/{userId} request, we delete the created object by id (confirmation of successful deletion is expected)', async () => {
    const res5 = await request(server).delete(`/api/users/${userId}`);

    expect(res5.statusCode).toBe(204);
  });

  it('With a GET api/user/{userId} request, we try to get the created record by its id (the created record is expected)', async () => {
    const res6 = await request(server).get(`/api/users/${userId}`);

    expect(res6.statusCode).toBe(404);
    expect(res6.body.message).toBe('no such record');
  });
});

describe('Second test (error handling)', () => {
  it('Get all users on an invalid endpoint (an error is expected)', async () => {
    const res1 = await request(server).get('/api/userss');

    expect(res1.statusCode).toBe(404);
    expect(res1.body.message).toBe('no such endpoint');
  });

  it('attempt to create an object without a required property (an error is expected)', async () => {
    const res2 = await request(server)
      .post('/api/users')
      .send({
        name: 'Petya',
        hobbies: ['books', 'sci-fi'],
      });

    expect(res2.statusCode).toBe(400);
    expect(res2.body.message).toBe('required properties are not specified');
  });

  it('Attempt to create an object with an invalid property types (an error is expected)', async () => {
    const res3 = await request(server)
      .post('/api/users')
      .send({
        username: 'Petya',
        age: '50',
        hobbies: [1],
      });

    expect(res3.statusCode).toBe(400);
    expect(res3.body.message).toBe('invalid properties types');
  });

  let userId: string;

  it('A new object is created (a response containing newly created record is expected)', async () => {
    const res4 = await request(server)
      .post('/api/users')
      .send({
        username: 'Petya',
        age: 50,
        hobbies: ['books', 'sci-fi'],
      });

    userId = res4.body.id;

    expect(res4.statusCode).toBe(201);
    expect(res4.body.username).toBe('Petya');
    expect(res4.body.age).toBe(50);
    expect(res4.body.hobbies).toEqual(['books', 'sci-fi']);
  });

  it('Аttempt to change an object by invalid uuid (an error is expected)', async () => {
    const res5 = await request(server).put(`/api/users/${userId}qw`);

    expect(res5.statusCode).toBe(400);
    expect(res5.body.message).toBe('not a uuid');
  });
});

describe('Third test ', () => {
  let firstUser: IUser, secondUser: IUser;
  let userFirstId: string, userSecondId: string;

  it('Should create user', async () => {
    const res1 = await request(server)
      .post('/api/users')
      .send({
        username: 'Vasya',
        age: 43,
        hobbies: ['sex', 'drugs', 'rock-n-roll'],
      });

    firstUser = res1.body;

    expect(res1.statusCode).toBe(201);
  });

  it('Should create a user with identical properties', async () => {
    const res2 = await request(server)
      .post('/api/users')
      .send({
        username: 'Vasya',
        age: 43,
        hobbies: ['sex', 'drugs', 'rock-n-roll'],
      });

    secondUser = res2.body;

    expect(res2.statusCode).toBe(201);
  });

  it('Non-unique properties (except id)', async () => {
    const res3 = await request(server).get(`/api/users/${firstUser.id}`);

    expect(res3.statusCode).toBe(200);
    expect(res3.body.username).toBe(secondUser.username);
    expect(res3.body.age).toBe(secondUser.age);
    expect(res3.body.hobbies).toEqual(secondUser.hobbies);
  });

  it('Attempt to make the same id (error is not expected)', async () => {
    const res4 = await request(server)
      .put(`/api/users/${secondUser.id}`)
      .send({ id: firstUser.id });

    secondUser = res4.body;

    expect(res4.statusCode).toBe(200);
  });

  it('Should return all users with unique ids', async () => {
    const res5 = await request(server).get('/api/users');

    const [first, second] = res5.body.filter(
      (user) =>
        user.username === firstUser.username &&
        user.age === firstUser.age &&
        user.hobbies.join('') === firstUser.hobbies.join('')
    );

    console.log(first, second);

    expect(res5.statusCode).toBe(200);
    expect(first.id).not.toBe(second.id);
  });
});
