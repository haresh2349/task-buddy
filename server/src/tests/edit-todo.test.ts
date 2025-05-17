import request from "supertest";
import app from "../app-test";
import { createTestUserAndGetCookies } from "./test-helper";
import { TodoStatus } from "../types/todos-types";
let cookies: string[];
describe("Update a task", () => {
  beforeAll(async () => {
    cookies = await createTestUserAndGetCookies();
  });

  it("should update a todo successfully for an authenticated user", async () => {
    const created = await request(app)
      .post("/api/v1/todos/create-todo")
      .set("Cookie", cookies)
      .send({
        title: "Original Title",
        status: TodoStatus.TODO,
        dueDate: "2026-01-01",
      });

    const todoId = created.body.result.id;

    const res = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Cookie", cookies)
      .send({
        title: "Updated Title",
        status: TodoStatus.PENDING,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task updated successfully");
    expect(res.body).toHaveProperty("result.id");
  });

  it("should return 401 if user is not authenticated", async () => {
    const res = await request(app)
      .patch(`/api/v1/todos/some-id`)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(401);
  });

  it("should return 400 for invalid todo ID format", async () => {
    const res = await request(app)
      .patch(`/api/v1/todos/invalid-id`)
      .set("Cookie", cookies)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid todo ID");
  });

  it("should return 404 if todo not found", async () => {
    const nonExistingId = "60f6f7cfc25e4a3a885e8b7a"; // random ObjectId
    const res = await request(app)
      .patch(`/api/v1/todos/${nonExistingId}`)
      .set("Cookie", cookies)
      .send({ title: "New Title" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(
      `Todo not found or you don't have permission`
    );
  });

  it("should return 400 for invalid status value", async () => {
    const created = await request(app)
      .post("/api/v1/todos/create-todo")
      .set("Cookie", cookies)
      .send({
        title: "Some Task",
        description: "This is test",
        status: TodoStatus.TODO,
        dueDate: "2026-01-01",
      });

    const todoId = created.body.result.id;

    const res = await request(app)
      .patch(`/api/v1/todos/${todoId}`)
      .set("Cookie", cookies)
      .send({ status: "not-valid" });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid status value");
  });
});
