import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log(`\nmongoDB connected! db host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("error: ", error);
    process.exit(1);
  }
};

export default connectDB;
