import { User } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { registerValidation } from "../schemas/registration.schema";
import { loginValidation } from "../schemas/login.schema";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

export const register = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    try {
      registerValidation.parse(req.body);
    } catch (error) {
      return res.status(400).json(new ApiResponse(400, null, "invalid input"));
    }

    const { username, password } = req.body;

    const checkUsername = await User.findOne({ username });
    if (checkUsername) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "username already exists"));
    }

    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });
    return res
      .status(201)
      .json(new ApiResponse(201, user, "registration successful"));
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    try {
      loginValidation.parse(req.body);
    } catch (error) {
      return res.status(400).json(new ApiResponse(400, null, "invalid input"));
    }
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json(new ApiResponse(404, null, "user not found"));
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "invalid password"));
    }

    const payload = { username, id: user._id };

    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("access_token", accessToken, { httpOnly: true })
      .cookie("refresh_token", refreshToken, { httpOnly: true });

    return res.status(200).json(new ApiResponse(200, null, "login successful"));
  }
);

export const refreshToken = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "refresh token doesn't exist"));
    }
    const token = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET!
    ) as JwtPayload;
    const user = await User.findOne({ username: token.username });

    if (!user || user.refreshToken !== refresh_token) {
      return res
        .status(403)
        .json(new ApiResponse(403, null, "invalid refresh token"));
    }

    const payload = { username: token.username, id: token.id };

    const newAccessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
    );

    const newRefreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
      })
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
      });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "tokens refreshed successfully"));
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    res
      .cookie("access_token", "", { httpOnly: true })
      .cookie("refresh_token", "", { httpOnly: true })
      .status(200);

    return res.json(new ApiResponse(200, null, "logout successful"));
  }
);
