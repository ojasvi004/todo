import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  username: string;
  password: string;
  todos?: mongoose.Schema.Types.ObjectId;
  refreshToken?: string;
}

export default IUser;
