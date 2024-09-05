import express, { Express } from "express";
import cors from "cors";
import connectDB from "./db/index";
import { errorHandler } from "./middlewares/errorHandler";
import dotenv from "dotenv";
import { router as authRouter } from "./routes/auth.route";
import { router as todoRouter } from "./routes/todo.route";
import cookieParser from "cookie-parser";

dotenv.config();

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(errorHandler);

app.use("/api/v1", authRouter);
app.use("/api/v1", todoRouter);

connectDB()
  .then(() => {
    const port = process.env.PORT ? Number(process.env.PORT) : 8000;

    app.listen(port, () => {
      console.log(`server is running on port: ${port}`);
    });
    app.on("error", (error) => {
      console.log("error: ", error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("mongoDB connection failed ", error);
    process.exit(1);
  });
