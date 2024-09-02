import express, { Express } from "express";
import cors from "cors";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
app.use(cors());

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

