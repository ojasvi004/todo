import { User } from "../models/user.model";
import { Todo } from "../models/todo.model";
import { Request, Response } from "express";

export const showAllTodos = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const todos = await Todo.find({});
    return res.status(200).json({ msg: todos });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const addTodo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { title, description, status, userId } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ msg: "all fields are required!" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "user doesn't exist" });
    }

    await Todo.create({
      title,
      description,
      status,
      user: userId,
    });
    return res.status(201).json({ msg: "todo added successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const deleteTodo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const todoId = req.params.id;
    const todoElement = await Todo.findByIdAndDelete(todoId);
    if (!todoElement) {
      return res.status(404).json({ msg: "todo not found" });
    }
    return res.status(200).json({ msg: "deleted successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};

export const updateTodo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const todoId = req.params.id;
    const { title, description, status } = req.body;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json({ msg: "todo not found" });
    }
    todo.title = title;
    todo.description = description;
    todo.status = status;
    await todo.save();
    return res.status(200).json({ msg: "updated successfully" });
  } catch (error) {
    return res.status(500).json({ msg: error });
  }
};
