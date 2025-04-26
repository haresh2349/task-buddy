import { Router } from "express";
import * as todoController from "../controllers/todos-controller"
const router = Router();
router.route('/create-todo').post(todoController.createTodo)
router.route('/').get(todoController.getUserTodos)
router.route('/delete').delete(todoController.deleteTodos)

export default router