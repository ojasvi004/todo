import { Document } from "mongoose";

interface ITodo extends Document {
  title: string;
  description: string;
  status: boolean;
}

export default ITodo;
