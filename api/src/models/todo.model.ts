import mongoose, { Schema } from "mongoose";
import ITodo from "../types/todo";

const TodoSchema: Schema<ITodo> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Todo = mongoose.model<ITodo>("Todo", TodoSchema);
