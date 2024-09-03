import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
    try {
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
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ msg: error });
    }
};

