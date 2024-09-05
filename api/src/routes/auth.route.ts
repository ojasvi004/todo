import { Router } from "express";
import { register, login, logout } from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);



export { router };
