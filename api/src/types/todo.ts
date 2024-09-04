import mongoose, { Document } from "mongoose";

interface ITodo extends Document {
  title: string;
  description: string;
  status: boolean;
  user: mongoose.Schema.Types.ObjectId;
}

export default ITodo;
