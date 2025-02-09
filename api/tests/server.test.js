// api/tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('POST /api/auth/register', () => {
    it('debería registrar un usuario nuevo', async () => {
        const newUser = {
            name: "Test",
            lastname: "User",
            mail: "testuser@example.com",
            password: "password123"
        };
        const res = await request(app)
            .post('/api/auth/register')
            .send(newUser);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("id");
    });

    it('debería retornar error si faltan campos obligatorios', async () => {
        const incompleteUser = {
            name: "Test",
            mail: "testuser@example.com",
            password: "password123"
        };
        const res = await request(app)
            .post('/api/auth/register')
            .send(incompleteUser);
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error");
    });
});
