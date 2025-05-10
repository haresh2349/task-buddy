import app from "../app-test";
import { TodoModel } from "../models/todos-model";
import UserModel from "../models/user-model";
import { createTestUserAndGetCookies } from "./test-helper";
import request from 'supertest';

const fetchTodosAPI = '/api/v1/todos';
const createTodoAPI = '/api/v1/todos/create-todos'
let cookies: string[];
let createdTodoId: string;
let todoIds:string[] = [];
const deleteTodosAPI = '/api/v1/todos/delete';

interface Todo {
    _id: string;
    title: string;
    dueDate: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    status:'todo' | 'inprogress' | 'done';
}

describe.skip('fetch Todos',() => {

    beforeAll(async() => {
        cookies = await createTestUserAndGetCookies();

         // Create sample todos
        for (let i = 0; i < 5; i++) {
            const todoRes = await request(app).post(`${fetchTodosAPI}/create-todo`)
                .set('Cookie', cookies)
                .send({
                    title: `Task ${i + 1}`,
                    status: 'todo',
                    dueDate: '2026-01-01',
                    description: `Test task ${i + 1}`,
                });

            if (i === 0) createdTodoId = todoRes.body.result.id; // store one for single fetch
        }
    })

    afterAll(() => {
        UserModel.deleteMany();
        TodoModel.deleteMany();
    })

    it('should fetch all todos with pagination', async () => {
        let page = 1;
        let limit = 3;
        const res = await request(app)
            .get(`${fetchTodosAPI}?page=${page}&limit=${limit}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.result.todos.length).toBeLessThanOrEqual(3);
        expect(res.body.result).toHaveProperty('pagination');
    });

    it('should fetch todos by search keyword in title or description',async() => {
        await request(app)
        .post(createTodoAPI)
        .set('Cookie', cookies)
        .send({
            title: 'Important Task',
            status: 'todo',
            dueDate: '2026-06-01',
            description: 'High priority'
        });

        await request(app)
        .post(createTodoAPI)
        .set('Cookie', cookies)
        .send({
            title: 'Random Task',
            status: 'todo',
            dueDate: '2026-06-01',
            description: 'Low priority'
        });

        const res = await request(app).get(`${fetchTodosAPI}/?search=${'important'}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.result.todos.length).toBeGreaterThan(0);
        res.body.result.todos.forEach((todo:Todo) => {
            const inTitle = todo.title.toLowerCase().includes('important');
            const inDesc = todo.description.toLowerCase().includes('important');
            expect(inTitle || inDesc).toBe(true);
        });
    })

    it('should fetch a single todo by ID', async () => {
        const res = await request(app)
            .get(`${fetchTodosAPI}/${createdTodoId}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(200);
        expect(res.body.result).toHaveProperty('title');
        expect(res.body.result._id).toBe(createdTodoId);
    });

    it('should return 404 if todo not found', async () => {
        const fakeId = '000000000000000000000000';
        const res = await request(app)
            .get(`${fetchTodosAPI}/${fakeId}`)
            .set('Cookie', cookies);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Invalid task id!');
    });


    it('should return 401 if not authenticated', async () => {
        const res = await request(app).get(fetchTodosAPI);
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('UnAuthorized request!')
    });
})


describe('delete Todos',() => {
    beforeAll(async() => {
        cookies = await createTestUserAndGetCookies();

         // Create sample todos
        for (let i = 0; i < 5; i++) {
            const todoRes = await request(app).post(`${fetchTodosAPI}/create-todo`)
                .set('Cookie', cookies)
                .send({
                    title: `Task ${i + 1}`,
                    status: 'todo',
                    dueDate: '2026-01-01',
                    description: `Test task ${i + 1}`,
                });

            todoIds.push(todoRes?.body.result.id)
        }
    })

    afterAll(() => {
        UserModel.deleteMany();
        TodoModel.deleteMany();
    })


    it('should delete created todos', async() => {
        const res = await request(app)
            .post(deleteTodosAPI)
            .set("Cookie",cookies)
            .send({todoIds});
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/5 todos deleted successfully/);
        expect(res.body.result.deletedCount).toBe(5);
    })

    it('should return 200 with 0 deleted if ids are invalid', async () => {
        const res = await request(app)
            .post(deleteTodosAPI)
            .set('Cookie', cookies)
            .send({ todoIds: ['invalid-id'] });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/No todos were deleted/);
        expect(res.body.result.deletedCount).toBe(0);
    });

    it('should return 401 if not authenticated', async () => {
        const res = await request(app)
            .post(deleteTodosAPI)
            .send({ todoIds });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/UnAuthorized request/);
    });

    it('should return 200 if empty array is passed', async () => {
        const res = await request(app)
            .post(deleteTodosAPI)
            .set('Cookie', cookies)
            .send({ todoIds: [] });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toMatch(/No todos were deleted/);
        expect(res.body.result.deletedCount).toBe(0);
    });
})