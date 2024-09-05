import { Router } from "express";
import {
  showAllTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = Router();

router.route('/todo').get(verifyToken, showAllTodos).post(verifyToken, addTodo);
router.route('/todo/:id').delete(verifyToken, deleteTodo).patch(verifyToken, updateTodo);

export { router };
