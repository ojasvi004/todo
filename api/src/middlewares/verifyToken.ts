import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

interface CustomRequest extends Request {
  user?: any;
}

export const verifyToken = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({ msg: "token does not exist" });
  }

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET!,
    (error: any, user: any) => {
      if (error) {
        return res.status(403).json({ msg: "invalid token" });
      }
      req.user = user;
      next();
    }
  );
};

//imp: default Request object doesn't obviously include a user property!!!
