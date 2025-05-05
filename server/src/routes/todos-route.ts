import { Router } from "express";
import * as todoController from "../controllers/todos-controller"
const router = Router();
router.route('/create-todo').post(todoController.createTodo)
router.route('/:id').patch(todoController.updateTodo)
router.route('/').get(todoController.getUserTodos)
router.route('/:id').get(todoController.getSingleTodo)
router.route('/delete').post(todoController.deleteTodos)

export default router