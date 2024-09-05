import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
} from "../controllers/auth.controller";

const router: Router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh_token", refreshToken);

export { router };
