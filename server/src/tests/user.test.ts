import UserModel from "../models/user-model";
import request from "supertest"
import app from "../app-test"
describe('User registration',() => {
    const api = '/api/v1/auth/signup';

    beforeEach(async () => {
        await UserModel.deleteMany();
    })

    it('should register a new user with valid data', async () => {
        const res = await request(app).post(api).send({
            username:'John',
            email:'john@test.com',
            password:'john123'
        })
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message','User created successfully')
        expect(res.body).toHaveProperty('result.id');
        expect(typeof res.body.result.id).toBe('string');
    })

    it('should not register user with existing email',async() => {
        await request(app).post(api).send({
            username:'John',
            email:'john@test.com',
            password:'john123'
        })

        const res = await request(app).post(api).send({
            username:'John',
            email:'john@test.com',
            password:'john123'
        })

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe('Email already exists!')
    })

    it('should throw an error if email is not passed',async () => {
        const res = await request(app).post(api).send({
            username:'John',
            password:'john123'
        })

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required!')
    })

    it('should throw an error if username is not passed',async () => {
        const res = await request(app).post(api).send({
            password:'John123',
            email:'john@test.com'
        })

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required!')
    })

    it('should throw an error if password is not passed',async () => {
        const res = await request(app).post(api).send({
            username:'John',
            email:'john@test.com'
        })

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required!')
    })

    it('should throw an error if email is not valid',async() => {
        const res = await request(app).post(api).send({
            username:'John',
            email:'johntest.com',
            password:'john123'
        })

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Invalid email format')
    })
})

describe('User login', () => {
    const api = '/api/v1/auth/signin';

    beforeEach(async () => {
        await UserModel.deleteMany();
        await request(app).post('/api/v1/auth/signup').send({
            username: 'John',
            email: 'john@test.com',
            password: 'john123',
        });
    });

    it('should login with valid credentials', async () => {
        const res = await request(app).post(api).send({
            email: 'john@test.com',
            password: 'john123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'User loggedIn successfully.');
        expect(res.body).toHaveProperty('result.accessToken');
    });

    it('should throw error for invalid email', async () => {
        const res = await request(app).post(api).send({
            email: 'wrong@test.com',
            password: 'john123',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('should throw error for incorrect password', async () => {
        const res = await request(app).post(api).send({
            email: 'john@test.com',
            password: 'wrongpass',
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Invalid credentials');
    });

    it('should throw error if email is not provided', async () => {
        const res = await request(app).post(api).send({
            password: 'john123',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required!');
    });

    it('should throw error if password is not provided', async () => {
        const res = await request(app).post(api).send({
            email: 'john@test.com',
        });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('All fields are required!');
    });

    it('should set a cookie on successful login',async() => {
        const res = await request(app).post(api).send({
            email: 'john@test.com',
            password: 'john123',
        });

        expect(res.statusCode).toBe(200);
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        if(Array.isArray(cookies)){
            expect(cookies?.some((cookie) => cookie.startsWith('accessToken='))).toBe(true)
            expect(cookies?.some((cookie) => cookie.startsWith('refreshToken='))).toBe(true)
        }
    })
});

