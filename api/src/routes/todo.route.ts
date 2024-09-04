import { Router } from "express";
import {
  showAllTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller";
import { verifyToken } from "../middlewares/verifyToken";

const router: Router = Router();

router.get("/todo", verifyToken, showAllTodos);
router.post("/todo", verifyToken, addTodo);
router.delete("/todo/:id", verifyToken, deleteTodo);
router.patch("/todo/:id", verifyToken, updateTodo);

export { router };
