import request from "supertest";
import app from "../app-test";
import { TodoModel } from "../models/todos-model";
import UserModel from "../models/user-model";
import { createTestUserAndGetCookies } from "./test-helper";
import { TodoStatus } from "../types/todos-types";

let cookies: string[] = [];
const createTodoAPI = "/api/v1/todos/create-todo";

let newTask = {
  title: "Test task",
  status: TodoStatus.TODO,
  dueDate: "2026-05-17",
  description: "This is a testing.",
};

describe("Create a task", () => {
  beforeAll(async () => {
    cookies = await createTestUserAndGetCookies(); // safe and clean
  });

  afterEach(() => {
    TodoModel.deleteMany();
  });

  afterAll(() => {
    UserModel.deleteMany();
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app).post(createTodoAPI).send(newTask);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("UnAuthorized request!");
  });

  it("should create a new task", async () => {
    const res = await request(app)
      .post(createTodoAPI)
      .set("Cookie", cookies)
      .send(newTask);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Task created successfully");
    expect(res.body).toHaveProperty("result.id");
  });

  it("should return 400 if title is missing", async () => {
    const res = await request(app)
      .post(createTodoAPI)
      .set("Cookie", cookies)
      .send({
        status: TodoStatus.TODO,
        dueDate: "2026-01-01",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Title is required");
  });

  it("should return 400 if status is not valid", async () => {
    const res = await request(app)
      .post(createTodoAPI)
      .set("Cookie", cookies)
      .send({
        title: "Test task",
        status: "random",
        dueDate: "2026-01-01",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid status value");
  });

  it("should return 400 if dueDate is missing", async () => {
    const res = await request(app)
      .post(createTodoAPI)
      .set("Cookie", cookies)
      .send({
        title: "Test task",
        status: TodoStatus.TODO,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Due date is required");
  });

  it("should return 400 if dueDate is not a valid ISO date string", async () => {
    const res = await request(app)
      .post(createTodoAPI)
      .set("Cookie", cookies)
      .send({
        title: "Test task",
        status: TodoStatus.TODO,
        dueDate: "not-a-date",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid Due Date");
  });
});
