import { User } from "../models/user.model";
import { Todo } from "../models/todo.model";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { todoValidation } from "../schemas/todo.schema";

export const showAllTodos = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const todos = await Todo.find({});
    return res.status(200).json(new ApiResponse(200, todos));
  }
);

export const addTodo = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    try {
      todoValidation.parse(req.body);
    } catch (e) {
      return res.status(400).json(new ApiResponse(400, null, "invalid input"));
    }

    const { title, description, status, userId } = req.body;
    if (!title || !description || !status) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "all fields are required!"));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "user doesn't exist"));
    }

    await Todo.create({
      title,
      description,
      status,
      user: userId,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, null, "added successfully"));
  }
);

export const deleteTodo = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const todoId = req.params.id;
    const todoElement = await Todo.findByIdAndDelete(todoId);
    if (!todoElement) {
      return res.status(404).json(new ApiResponse(404, null, "todo not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "deleted successfully"));
  }
);

export const updateTodo = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    try {
      todoValidation.parse(req.body);
    } catch (e) {
      return res.status(400).json(new ApiResponse(400, null, "invalid input"));
    }

    const todoId = req.params.id;
    const { title, description, status } = req.body;
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).json(new ApiResponse(404, null, "todo not found"));
    }

    todo.title = title;
    todo.description = description;
    todo.status = status;
    await todo.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "updated successfully"));
  }
);
