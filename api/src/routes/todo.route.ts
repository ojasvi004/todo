import { Router } from "express";
import {
  showAllTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from "../controllers/todo.controller";

const router: Router = Router();

router.get("/todo", showAllTodos);
router.post("/todo", addTodo);
router.delete("/todo/:id", deleteTodo);
router.patch("/todo/:id", updateTodo);

export { router };
