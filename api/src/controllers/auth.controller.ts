import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res.status(409).json({ msg: "username already exists" });
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return res.status(201).json({ msg: user });
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "invalid password" });
    }

    const payload = { username, id: user._id };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("access_token", accessToken, { httpOnly: true })
      .cookie("refresh_token", refreshToken, { httpOnly: true });

    return res.status(200).json({ msg: "login successful" });
  }
);
